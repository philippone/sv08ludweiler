<script lang="ts">
	import { goto } from '$app/navigation';
	import { env as envPublic } from '$env/dynamic/public';
	import NewspaperTile from '$lib/components/NewspaperTile.svelte';
	import PostColumns from '$lib/components/PostColumns.svelte';
	import SocialMediaLink from '$lib/components/SocialMediaLink.svelte';
	import FupaWidget from '$lib/components/fupa/FupaWidget.svelte';
	import FussballDeWidget2024 from '$lib/components/fussball-de-widget/FussballDeWidget2024.svelte';
	import FussballDeWidget from '$lib/components/fussball-de-widget/FussballDeWidget.svelte';
	import Button from '@smui/button';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let submenu: HTMLDivElement | undefined = $state();
</script>

<svelte:head>
	<title>SV 08 Ludweiler</title>
	<meta name="description" content="Homepage des Fußballverein SV 08 Ludweiler" />
</svelte:head>

{#if data.news || data?.landingPage?.Vereinsspielplan || data.newspaper?.meta?.pagination?.total}
	<div class="submenu fixed z-10 w-full bg-green-700 text-white" bind:this={submenu}>
		<ul
			class="flex h-full flex-row items-center overflow-hidden overflow-x-auto px-4 md:container md:mx-auto"
		>
			{#if data.news}
				<li class="nav-menu h-full"><a class="menu-item" href="#news">Aktuelles</a></li>
			{/if}
			{#if data.newspaper?.meta?.pagination?.total}
				<li class="nav-menu h-full"><a class="menu-item" href="#newspaper">Stadionheft</a></li>
			{/if}
			{#if data?.landingPage?.Vereinsspielplan}
				<li class="nav-menu h-full">
					<a
						class="menu-item"
						href={`#${data.landingPage.Vereinsspielplan.title.trim().replace(' ', '-')}`}
						>{data.landingPage.Vereinsspielplan.title}</a
					>
				</li>
			{/if}
		</ul>
	</div>
{/if}

<div class="page-content" class:has-submenu={submenu !== null}>
	<enhanced:img
		class="aspect-auto w-full"
		alt="SV 08 Ludweiler Wandgraffiti"
		src="$lib/assets/header.webp"
		sizes="min(1500px, 100vw)"
	/>

	{#if data.landingPage?.headline_widgets?.length}
		<section class="m-auto -mt-10 mb-10 flex max-w-screen-xl flex-wrap justify-center gap-5 px-5">
			{#each data.landingPage.headline_widgets as widget}
				<FupaWidget widgetId={widget.widget_id}></FupaWidget>
			{/each}
		</section>
	{/if}

	<section class="my-5 px-4">
		<div class="flex flex-wrap items-center justify-center gap-4" aria-label="Partner">
			{#if data?.supporter?.items}
				{#each data?.supporter?.items as item}
					<SocialMediaLink title={item.title} href={item?.link} icon={item?.image} />
				{/each}
			{/if}
		</div>
	</section>

	{#if data.news}
		<section class="mb-10 flex-auto px-4 md:container md:mx-auto">
			<h2 id="news">Aktuelles</h2>
			<PostColumns posts={data.news.data} meta={data.news?.meta} />
		</section>
	{/if}

	{#if data.newspaper.data}
		<section class="mb-10 flex-auto px-4 md:container md:mx-auto">
			<h2 id="newspaper">Stadionheft</h2>
			<div class="mb-5">
				<div class="news columns-1 gap-4 md:columns-2">
					{#each data.newspaper.data as newspaper}
						<div class="mb-4 break-inside-avoid">
							<NewspaperTile
								title={newspaper.title}
								headerImage={newspaper.header_image}
								href={`${envPublic.PUBLIC_FRONTEND_STRAPI_HOST}${newspaper?.file?.url}`}
							></NewspaperTile>
						</div>
					{/each}
				</div>

				{#if data.newspaper?.meta && data.newspaper?.meta?.pagination && data.newspaper?.meta?.pagination.pageCount > 1}
					<div class="my-6 flex flex-auto justify-center px-4 md:container md:mx-auto">
						<!-- TODO replace with anchor -->
						<Button type="button" variant="raised" onclick={() => goto('./newspaper')}
							>Zu allen Ausgaben</Button
						>
					</div>
				{/if}
			</div>
		</section>
	{/if}

	<section class="mb-10 flex-auto px-4 md:container md:mx-auto">
		{#if data?.landingPage?.Vereinsspielplan}
			<h2 id={data.landingPage.Vereinsspielplan.title.trim().replace(' ', '-')}>
				{data.landingPage.Vereinsspielplan.title}
			</h2>

			{#if data.landingPage.Vereinsspielplan.type && data.landingPage.Vereinsspielplan.type !== 'old'}
				<FussballDeWidget2024
					widgetId={data.landingPage.Vereinsspielplan.widgetid}
					widgetType={data.landingPage.Vereinsspielplan.type}
					title={data.landingPage.Vereinsspielplan.title}
				/>
			{:else}
				{#key data.landingPage.Vereinsspielplan.widgetid}
					<FussballDeWidget widgetId={data.landingPage.Vereinsspielplan.widgetid} />
				{/key}
			{/if}
		{/if}
	</section>
</div>

<style lang="scss">
	.submenu {
		height: var(--submenu-height);
	}

	.page-content {
		&.has-submenu {
			margin-top: var(--submenu-height);
		}
		&.has-submenu :target:before {
			content: '';
			display: block;
			height: 145px;
			margin: -145px 0 0;
		}
	}
</style>
