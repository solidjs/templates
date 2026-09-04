// A server-only data source. Nothing here reaches the client bundle — the
// 'use server' functions in src/data.ts are this module's only consumers,
// and in this template those run exclusively at build time. Swap the
// in-memory array for a database, a CMS client, or the filesystem
// (markdown posts) without touching anything else.
export interface Post {
  slug: string;
  title: string;
  body: string;
  publishedAt: Date;
}

const POSTS: Post[] = [
  {
    slug: 'hello-world',
    title: 'Hello, world',
    body: 'The first post, served with zero servers.',
    publishedAt: new Date('2026-01-05'),
  },
  {
    slug: 'static-server-functions',
    title: 'Static server functions',
    body: "This page's data was a typed server function call — executed once, at build time.",
    publishedAt: new Date('2026-02-11'),
  },
  {
    slug: 'crawl-discovers-pages',
    title: 'The crawl discovers pages',
    body: 'Nobody listed this page in config. The build followed a link here and prerendered it.',
    publishedAt: new Date('2026-03-20'),
  },
];

export const listPosts = () =>
  POSTS.map(({ slug, title, publishedAt }) => ({ slug, title, publishedAt }));

export const findPost = (slug: string) =>
  POSTS.find((post) => post.slug === slug) ?? null;
