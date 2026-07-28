-- Store Legal paragraphs and bullets in a single ordered array so newly added
-- content renders in the exact sequence in which it was created.

update public.site_content as page
set
  content = jsonb_set(
    jsonb_set(
      page.content,
      '{hero}',
      (page.content -> 'hero')
        || jsonb_build_object(
          'blocks',
          coalesce(
            page.content #> '{hero,blocks}',
            (
              select coalesce(jsonb_agg(block.value order by block.group_order, block.position), '[]'::jsonb)
              from (
                select
                  1 as group_order,
                  paragraph.position,
                  jsonb_build_object('type', 'paragraph', 'text', paragraph.value) as value
                from jsonb_array_elements(
                  case
                    when jsonb_typeof(page.content #> '{hero,paragraphs}') = 'array'
                      then page.content #> '{hero,paragraphs}'
                    else '[]'::jsonb
                  end
                ) with ordinality as paragraph(value, position)
                union all
                select
                  2 as group_order,
                  bullet.position,
                  jsonb_build_object('type', 'bullet', 'text', bullet.value) as value
                from jsonb_array_elements(
                  case
                    when jsonb_typeof(page.content #> '{hero,bullets}') = 'array'
                      then page.content #> '{hero,bullets}'
                    else '[]'::jsonb
                  end
                ) with ordinality as bullet(value, position)
              ) as block
            )
          )
        ),
      false
    ),
    '{sections}',
    (
      select jsonb_agg(
        section.value
          || jsonb_build_object(
            'blocks',
            coalesce(
              section.value -> 'blocks',
              (
                select coalesce(jsonb_agg(block.value order by block.group_order, block.position), '[]'::jsonb)
                from (
                  select
                    1 as group_order,
                    paragraph.position,
                    jsonb_build_object('type', 'paragraph', 'text', paragraph.value) as value
                  from jsonb_array_elements(
                    case
                      when jsonb_typeof(section.value -> 'paragraphs') = 'array'
                        then section.value -> 'paragraphs'
                      when nullif(btrim(section.value ->> 'body'), '') is not null
                        then jsonb_build_array(section.value ->> 'body')
                      else '[]'::jsonb
                    end
                  ) with ordinality as paragraph(value, position)
                  union all
                  select
                    2 as group_order,
                    bullet.position,
                    jsonb_build_object('type', 'bullet', 'text', bullet.value) as value
                  from jsonb_array_elements(
                    case
                      when jsonb_typeof(section.value -> 'bullets') = 'array'
                        then section.value -> 'bullets'
                      else '[]'::jsonb
                    end
                  ) with ordinality as bullet(value, position)
                ) as block
              )
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
