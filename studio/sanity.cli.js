import {defineCliConfig} from 'sanity/cli'

// 👉 Replace YOUR_PROJECT_ID with the same Project ID used in sanity.config.js
export default defineCliConfig({
  api: {
    projectId: 'YOUR_PROJECT_ID',
    dataset: 'production',
  },
})
