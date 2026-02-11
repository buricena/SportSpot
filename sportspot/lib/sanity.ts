import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'dqjv3zhu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
