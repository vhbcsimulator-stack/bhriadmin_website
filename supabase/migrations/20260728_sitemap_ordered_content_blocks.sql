-- Add ordered paragraph/bullet blocks to the Sitemap hero and sections.
-- Existing content is preserved, and this query is safe to run more than once.

update public.site_content as page
set
  content = jsonb_set(
    jsonb_set(
      page.content,
      '{hero,blocks}',
      case
        when jsonb_typeof(page.content #> '{hero,blocks}') = 'array'
          then page.content #> '{hero,blocks}'
        else '[]'::jsonb
      end,
      true
    ),
    '{sections}',
    (
      select jsonb_agg(
        section.value
          || jsonb_build_object(
            'blocks',
            case
              when jsonb_typeof(section.value -> 'blocks') = 'array'
                then section.value -> 'blocks'
              when nullif(btrim(section.value ->> 'body'), '') is not null
                then jsonb_build_array(
                  jsonb_build_object(
                    'type', 'paragraph',
                    'text', section.value ->> 'body'
                  )
                )
              else '[]'::jsonb
            end
          )
        order by section.position
      )
      from jsonb_array_elements(page.content -> 'sections')
        with ordinality as section(value, position)
    ),
    false
  ),
  updated_at = now()
where page.id = 'sitemap'
  and jsonb_typeof(page.content -> 'hero') = 'object'
  and jsonb_typeof(page.content -> 'sections') = 'array'
  and (
    jsonb_typeof(page.content #> '{hero,blocks}') is distinct from 'array'
    or exists (
      select 1
      from jsonb_array_elements(page.content -> 'sections') as section(value)
      where jsonb_typeof(section.value -> 'blocks') is distinct from 'array'
    )
  );
