<script lang="ts">
	import Uploader from "$lib/components/functional/Uploader.svelte";
	import Tooltip from "$lib/components/visual/Tooltip.svelte";
	import { converters } from "$lib/converters";
	import { vertdLoaded } from "$lib/store/index.svelte";
	import clsx from "clsx";
	import { AudioLines, BookText, Check, Film, Image } from "lucide-svelte";
	import { m } from "$lib/paraglide/messages";
	import { OverlayScrollbarsComponent } from "overlayscrollbars-svelte";
	import { browser } from "$app/environment";
	import "overlayscrollbars/overlayscrollbars.css";
	import { onMount } from "svelte";
	import type { WorkerStatus } from "$lib/converters/converter.svelte";
	import { sanitize } from "$lib/store/index.svelte";
	import { DISABLE_ALL_EXTERNAL_REQUESTS } from "$lib/util/consts";

	const getSupportedFormats = (name: string) =>
		converters
			.find((c) => c.name === name)
			?.supportedFormats.map(
				(f) =>
					`${f.name}${f.fromSupported && f.toSupported ? "" : "*"}`,
			)
			.join(", ") || "none";

	const worker: {
		[key: string]: {
			formats: string;
			icon: typeof Image;
			title: string;
			status: WorkerStatus;
		};
	} = $derived.by(() => {
		const output: {
			[key: string]: {
				formats: string;
				icon: typeof Image;
				title: string;
				status: WorkerStatus;
			};
		} = {
			Images: {
				formats: getSupportedFormats("imagemagick"),
				icon: Image,
				title: m["upload.cards.images"](),
				status:
					converters.find((c) => c.name === "imagemagick")?.status ||
					"not-ready",
			},
			Audio: {
				formats: getSupportedFormats("ffmpeg"),
				icon: AudioLines,
				title: m["upload.cards.audio"](),
				status:
					converters.find((c) => c.name === "ffmpeg")?.status ||
					"not-ready",
			},
			Documents: {
				formats: getSupportedFormats("pandoc"),
				icon: BookText,
				title: m["upload.cards.documents"](),
				status:
					converters.find((c) => c.name === "pandoc")?.status ||
					"not-ready",
			},
		};

		if (!DISABLE_ALL_EXTERNAL_REQUESTS) {
			output.Video = {
				formats: getSupportedFormats("vertd"),
				icon: Film,
				title: m["upload.cards.video"](),
				status: $vertdLoaded === true ? "ready" : "not-ready",
			};
		}

		return output;
	});

	const getTooltip = (format: string) => {
		const converter = converters.find((c) =>
			c.supportedFormats.some((sf) => sf.name === format),
		);

		const formatInfo = converter?.supportedFormats.find(
			(sf) => sf.name === format,
		);

		if (formatInfo) {
			const direction = formatInfo.fromSupported
				? m["upload.tooltip.direction_input"]()
				: m["upload.tooltip.direction_output"]();
			return m["upload.tooltip.partial_support"]({ direction });
		}
		return "";
	};

	const getStatusText = (status: WorkerStatus) => {
		switch (status) {
			case "downloading":
				return m["upload.cards.status.downloading"]();
			case "ready":
				return m["upload.cards.status.ready"]();
			default:
				return m["upload.cards.status.not_ready"]();
		}
	};

	const cardAccents: Record<string, { bg: string; text: string; glow: string }> = {
		Images: { bg: "bg-accent-blue", text: "text-black", glow: "hsla(210, 90%, 48%, 0.25)" },
		Audio: { bg: "bg-accent-purple", text: "text-black", glow: "hsla(264, 75%, 48%, 0.25)" },
		Documents: { bg: "bg-accent-green", text: "text-black", glow: "hsla(145, 55%, 38%, 0.25)" },
		Video: { bg: "bg-accent-red", text: "text-black", glow: "hsla(348, 80%, 48%, 0.25)" },
	};

	let scrollContainers: HTMLElement[] = $state([]);
	// svelte-ignore state_referenced_locally
	let showBlur = $state(Array(Object.keys(worker).length).fill(false));

	onMount(() => {
		const handleResize = () => {
			for (let i = 0; i < scrollContainers.length; i++) {
				const container = scrollContainers[i];
				if (!container) return;
				showBlur[i] = container.scrollHeight > container.clientHeight;
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	});
</script>

<div class="max-w-6xl w-full mx-auto px-6 md:px-8">
	<!-- Hero Section -->
	<div class="flex items-center justify-center pb-10 md:py-10">
		<div
			class="flex items-center h-auto gap-10 md:gap-16 md:flex-row flex-col w-full"
		>
			<!-- Heading + subtitle -->
			<div class="flex-1 w-full text-center md:text-left">
				<h1
					class="text-4xl px-8 md:p-0 md:text-[3.75rem] flex-wrap tracking-tight leading-tight md:leading-[1.15] mb-5"
				>
					{m["upload.title"]()}
				</h1>
				<p
					class="font-normal px-4 md:p-0 text-lg md:text-xl text-muted leading-relaxed mb-8 md:mb-0"
				>
					{m["upload.subtitle"]()}
				</p>
			</div>

			<!-- Upload zone -->
			<div class="flex-1 w-full h-72">
				<Uploader class="w-full h-full" />
			</div>
		</div>
	</div>

	<!-- Divider -->
	<div class="section-divider"></div>

	<!-- Supported formats section -->
	<div class="mt-10 md:mt-14">
		<div class="text-center mb-8">
			<h2 class="text-3xl md:text-4xl tracking-tight">
				{m["upload.cards.title"]()}
			</h2>
			<p class="text-muted font-normal mt-2 text-base">
				Convert images, audio, documents &amp; video — all on your device
			</p>
		</div>

		<div class="flex gap-4 md:flex-row flex-col">
			{#if browser}
				{#each Object.entries(worker) as [key, s], i}
					{@const Icon = s.icon}
					{@const accent = cardAccents[key] ?? cardAccents.Images}
					<div class="feature-card w-full flex flex-col gap-4">
						<!-- Card header -->
						<div class="flex items-center gap-3">
							<div
								class={clsx(
									"icon-chip w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0",
									accent.bg,
									accent.text,
								)}
							>
								<Icon size={18} />
							</div>
							<span class="text-base font-semibold">{s.title}</span>
							<span
								class={clsx(
									"ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full",
									s.status === "ready"
										? "bg-accent-green/20 text-accent-green-alt dynadark:text-accent-green"
										: s.status === "downloading"
											? "bg-accent-blue/20 text-accent-blue-alt dynadark:text-accent-blue"
											: "bg-panel-highlight text-muted",
								)}
							>
								{getStatusText(s.status)}
							</span>
						</div>

						<!-- Card body -->
						<div class="card-formats flex-grow relative">
							<OverlayScrollbarsComponent
								options={{
									scrollbars: {
										autoHide: "move",
										autoHideDelay: 1500,
									},
								}}
								defer
							>
								<div
									class="flex flex-col gap-3 h-[11rem] relative"
									bind:this={scrollContainers[i]}
								>
									{#if key === "Video"}
										<p class="flex items-center gap-2 text-sm font-normal text-muted">
											<Check size={15} class="text-accent-green-alt flex-shrink-0" />
											<Tooltip
												text={m["upload.tooltip.video_server_processing"]()}
											>
												<span class="text-accent">
													<a
														href="https://github.com/VERT-sh/VERT/blob/main/docs/VIDEO_CONVERSION.md"
														target="_blank"
														rel="noopener noreferrer"
													>
														{m["upload.cards.video_server_processing"]()}
													</a>
													<span class="text-red-400 -ml-0.5">*</span>
												</span>
											</Tooltip>
										</p>
									{:else}
										<p class="flex items-center gap-2 text-sm font-normal text-muted">
											<Check size={15} class="text-accent-green-alt flex-shrink-0" />
											{m["upload.cards.local_supported"]()}
										</p>
									{/if}
									<p class="text-sm font-normal text-muted">
										{@html sanitize(m["upload.cards.status.text"]({
											status: getStatusText(s.status),
										}))}
									</p>
									<div class="flex flex-col gap-2">
										<p class="text-xs font-semibold text-muted uppercase tracking-wide">
											{m["upload.cards.supported_formats"]()}
										</p>
										<p class="flex flex-wrap leading-snug gap-x-0.5">
											{#each s.formats.split(", ") as format, index}
												{@const isPartial = format.endsWith("*")}
												{@const formatName = isPartial
													? format.slice(0, -1)
													: format}
												<span
													class="text-xs font-normal text-muted flex items-center relative"
												>
													{#if isPartial}
														<Tooltip text={getTooltip(formatName)}>
															{formatName}<span class="text-accent-red-alt">*</span>
														</Tooltip>
													{:else}
														{formatName}
													{/if}
													{#if index < s.formats.split(", ").length - 1}
														<span>,&nbsp;</span>
													{/if}
												</span>
											{/each}
										</p>
									</div>
								</div>
							</OverlayScrollbarsComponent>
							{#if showBlur[i]}
								<div
									class="absolute left-0 bottom-0 w-full h-10 pointer-events-none"
									style="background: linear-gradient(to top, var(--bg-panel), transparent 100%);"
								></div>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.section-divider {
		@apply w-full h-px bg-separator;
	}

	.feature-card {
		@apply bg-panel rounded-2xl p-5 border border-separator;
		box-shadow: var(--shadow-panel);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.feature-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-elevated);
	}

	.icon-chip {
		transition: transform 0.25s ease;
	}

	.feature-card:hover .icon-chip {
		transform: scale(1.1);
	}

	.card-formats {
		@apply flex flex-col text-center justify-between;
	}
</style>
