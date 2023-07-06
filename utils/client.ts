import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: '0jeukowm',
  dataset: 'production',
  apiVersion: '2023-03-03',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
