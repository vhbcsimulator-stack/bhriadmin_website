-- Migrate Legal pages from one `body` string per section to independently
-- editable paragraph and bullet arrays. Existing headings and other fields are
-- retained, and rerunning this migration is safe.

update public.site_content as page
set
  content = jsonb_set(
    page.content,
    '{sections}',
    (
      select jsonb_agg(
        (
          section.value - 'body'
          || jsonb_build_object(
            'paragraphs',
            case
              when jsonb_typeof(section.value -> 'paragraphs') = 'array'
                then section.value -> 'paragraphs'
              when nullif(btrim(section.value ->> 'body'), '') is not null
                then jsonb_build_array(section.value ->> 'body')
              else '[]'::jsonb
            end,
            'bullets',
            case
              when jsonb_typeof(section.value -> 'bullets') = 'array'
                then section.value -> 'bullets'
              else '[]'::jsonb
            end
          )
        )
        order by section.position
      )
      from jsonb_array_elements(page.content -> 'sections')
        with ordinality as section(value, position)
    ),
    false
  ),
  updated_at = now()
where page.id in ('privacy', 'terms', 'cookies')
  and jsonb_typeof(page.content -> 'sections') = 'array'
  and exists (
    select 1
    from jsonb_array_elements(page.content -> 'sections') as section(value)
    where section.value ? 'body'
       or jsonb_typeof(section.value -> 'paragraphs') is distinct from 'array'
       or jsonb_typeof(section.value -> 'bullets') is distinct from 'array'
  );
