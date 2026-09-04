import { query } from '@solidjs/router';
import { prerendered } from '@solidjs/prerender';
import { findPost, listPosts } from './server/posts';

// The data layer: typed 'use server' functions, declared `prerendered`.
// Each call the build's crawl performs is executed once and captured as a
// static JSON artifact keyed by (function, arguments); the deployed client
// fetches that file instead of calling a server. Values survive intact —
// `publishedAt` arrives as a real Date, not a string. `query()` layers
// router caching on top (preload and render share one read per key).
//
// In dev these are ordinary server functions against the dev server, so
// the edit-refresh loop stays live — no rebuild to see data changes.
export const getPosts = query(
  prerendered(async () => {
    'use server';
    return listPosts();
  }),
  'posts',
);

export const getPost = query(
  prerendered(async (slug: string) => {
    'use server';
    return findPost(slug);
  }),
  'post',
);
