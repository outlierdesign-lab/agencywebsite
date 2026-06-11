import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project / Case Study',
  type: 'document',
  fields: [
    // ---- card + identity ----
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (R) => R.required(),
      description: 'Used in the page URL, e.g. ?slug=blend',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first in the Works grid.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Card subtitle',
      type: 'string',
      description: 'Shown under the title on the grid, e.g. "Relationship app · Brand & App Design"',
    }),
    defineField({
      name: 'funding',
      title: 'Funding badge',
      type: 'string',
      description: 'Optional, e.g. "$1M Pre-Seed". Leave blank to hide.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
    }),

    // ---- case-study hero ----
    defineField({
      name: 'kicker',
      title: 'Case-study kicker',
      type: 'string',
      description: 'Small label above the title, e.g. "01 — Brand & App Design". Falls back to the card subtitle.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 2,
    }),

    // ---- meta strip ----
    defineField({name: 'client', title: 'Client', type: 'string'}),
    defineField({name: 'services', title: 'Services', type: 'string'}),
    defineField({name: 'stage', title: 'Stage', type: 'string', description: 'e.g. "$1.8M Seed" (optional)'}),
    defineField({name: 'year', title: 'Year', type: 'string'}),
    defineField({name: 'timeline', title: 'Timeline', type: 'string', description: 'Shown if Stage is empty, e.g. "6 weeks"'}),

    // ---- body ----
    defineField({
      name: 'overview',
      title: 'Overview / the brief',
      type: 'text',
      rows: 3,
      description: 'The big single statement at the top of the case study.',
    }),
    defineField({
      name: 'challenge',
      title: 'The challenge (paragraphs)',
      type: 'array',
      of: [{type: 'text', rows: 3}],
    }),
    defineField({
      name: 'galleryPair',
      title: 'Gallery — two-up images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: 'Add two images to show side by side.',
    }),
    defineField({
      name: 'whatWeDid',
      title: 'What we did (bullets)',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'featureImage',
      title: 'Feature image (wide)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'outcome',
      title: 'The outcome',
      type: 'text',
      rows: 3,
    }),

    // ---- quote ----
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'object',
      fields: [
        {name: 'text', title: 'Quote', type: 'text', rows: 3},
        {name: 'name', title: 'Name', type: 'string'},
        {name: 'role', title: 'Role', type: 'string'},
      ],
    }),

    // ---- results ----
    defineField({
      name: 'results',
      title: 'Results',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', title: 'Value', type: 'string', description: 'e.g. "$70M"'},
            {name: 'label', title: 'Label', type: 'string', description: 'e.g. "Series C raised during the engagement"'},
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        },
      ],
    }),
  ],

  orderings: [
    {title: 'Order (asc)', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],

  preview: {
    select: {title: 'title', subtitle: 'subtitle', media: 'coverImage'},
  },
})
