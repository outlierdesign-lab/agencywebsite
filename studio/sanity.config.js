import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// 👉 Replace YOUR_PROJECT_ID with the Project ID from https://www.sanity.io/manage
export default defineConfig({
  name: 'default',
  title: 'Outliers at Play',

  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
