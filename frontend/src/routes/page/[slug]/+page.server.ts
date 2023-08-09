import { env } from '$env/dynamic/private';
import { env as envPublic } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
import { compile } from 'mdsvex';
import qs from 'qs';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const query = qs.stringify(
		{
			filters: {
				slug: {
					$eq: params.slug,
				},
			},
			populate: {
				header_image: true,
			},
		},
		{
			encodeValuesOnly: true, // prettify URL
		},
	);

	const pages = await (
		await fetch(`${envPublic.PUBLIC_STRAPI_HOST}/api/pages?${query}`, {
			headers: {
				Authorization: `bearer ${env.STRAPI_API_TOKEN}`,
			},
		})
	).json();

	if (pages.meta.total < 1) {
		throw error(404, {
			message: 'Page not found',
		});
	}

	const page = pages.data[0];

	console.log('page', params.slug, page);

	let content;
	if (page?.attributes?.content) {
		content = await compile(page.attributes.content);
	}

	return {
		page,
		content,
	};
}) satisfies PageServerLoad;
