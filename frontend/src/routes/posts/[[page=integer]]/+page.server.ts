import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	return {
		posts: (await fetch(`/posts?page=${params.page || 1}`)).json(),
	};
}) satisfies PageServerLoad;
