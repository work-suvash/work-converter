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
	import { inview } from "$lib/actions/inview";

	const getSupportedFormats = (name: string) =>
		converters
			.find((c) => c.name === name)
			?.supportedFormats.map(
				(f) => `${f.name}${f.fromSupported && f.toSupported ? "" : "*"}`,
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
				status: converters.find((c) => c.name === "imagemagick")?.status || "not-ready",
			},
			Audio: {
				formats: getSupportedFormats("ffmpeg"),
				icon: AudioLines,
				title: m["upload.cards.audio"](),
				status: converters.find((c) => c.name === "ffmpeg")?.status || "not-ready",
			},
			Documents: {
				formats: getSupportedFormats("pandoc"),
				icon: BookText,
				title: m["upload.cards.documents"](),
				status: converters.find((c) => c.name === "pandoc")?.status || "not-ready",
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
		const formatInfo = converter?.supportedFormats.find((sf) => sf.name === format);
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
			case "downloading": return m["upload.cards.status.downloading"]();
			case "ready": return m["upload.cards.status.ready"]();
			default: return m["upload.cards.status.not_ready"]();
		}
	};

	const cardTheme: Record<string, {
		iconBg: string;
		iconColor: string;
		glowColor: string;
		borderColor: string;
		tagBg: string;
		tagText: string;
		topBar: string;
	}> = {
		Images: {
			iconBg: "hsla(210, 90%, 56%, 0.12)",
			iconColor: "hsl(210, 90%, 52%)",
			glowColor: "hsla(210, 90%, 56%, 0.07)",
			borderColor: "hsla(210, 90%, 56%, 0.18)",
			tagBg: "hsla(210, 90%, 56%, 0.1)",
			tagText: "hsl(210, 90%, 40%)",
			topBar: "hsl(210, 90%, 56%)",
		},
		Audio: {
			iconBg: "hsla(264, 75%, 60%, 0.12)",
			iconColor: "hsl(264, 75%, 52%)",
			glowColor: "hsla(264, 75%, 60%, 0.07)",
			borderColor: "hsla(264, 75%, 60%, 0.18)",
			tagBg: "hsla(264, 75%, 60%, 0.1)",
			tagText: "hsl(264, 75%, 40%)",
			topBar: "hsl(264, 75%, 60%)",
		},
		Documents: {
			iconBg: "hsla(145, 55%, 44%, 0.12)",
			iconColor: "hsl(145, 55%, 36%)",
			glowColor: "hsla(145, 55%, 44%, 0.07)",
			borderColor: "hsla(145, 55%, 44%, 0.18)",
			tagBg: "hsla(145, 55%, 44%, 0.1)",
			tagText: "hsl(145, 55%, 30%)",
			topBar: "hsl(145, 55%, 44%)",
		},
		Video: {
			iconBg: "hsla(348, 80%, 58%, 0.12)",
			iconColor: "hsl(348, 80%, 50%)",
			glowColor: "hsla(348, 80%, 58%, 0.07)",
			borderColor: "hsla(348, 80%, 58%, 0.18)",
			tagBg: "hsla(348, 80%, 58%, 0.1)",
			tagText: "hsl(348, 80%, 38%)",
			topBar: "hsl(348, 80%, 58%)",
		},
	};
</script>

<div class="max-w-6xl w-full mx-auto px-6 md:px-8">
	<!-- Hero Section -->
	<div class="flex items-center justify-center pb-10 md:py-10">
		<div class="flex items-center h-auto gap-10 md:gap-16 md:flex-row flex-col w-full">
			<!-- Heading + subtitle -->
			<div class="flex-1 w-full text-center md:text-left">
				<h1
					use:inview={{ delay: 0 }}
					class="text-4xl px-8 md:p-0 md:text-[3.75rem] flex-wrap tracking-tight leading-tight md:leading-[1.15] mb-5"
				>
					{m["upload.title"]()}
				</h1>
				<p
					use:inview={{ delay: 80 }}
					class="font-normal px-4 md:p-0 text-lg md:text-xl text-muted leading-relaxed mb-8 md:mb-0"
				>
					{m["upload.subtitle"]()}
				</p>
			</div>
			<!-- Upload zone -->
			<div use:inview={{ delay: 140 }} class="flex-1 w-full h-72">
				<Uploader class="w-full h-full" />
			</div>
		</div>
	</div>

	<!-- Divider -->
	<div class="w-full h-px bg-separator"></div>

	<!-- Supported formats section -->
	<div class="mt-14 md:mt-20 pb-16">

		<!-- Section heading -->
		<div use:inview class="text-center mb-12">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-panel border border-separator mb-4">
				<span class="w-1.5 h-1.5 rounded-full bg-accent-green"></span>
				<span class="text-xs font-medium text-muted tracking-wide uppercase">All formats supported</span>
			</div>
			<h2 class="text-3xl md:text-4xl tracking-tight mb-3">
				{m["upload.cards.title"]()}
			</h2>
			<p class="text-muted font-normal text-base max-w-md mx-auto leading-relaxed">
				Convert images, audio, documents &amp; video — processed entirely on your device
			</p>
		</div>

		<!-- Cards grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
			{#if browser}
				{#each Object.entries(worker) as [key, s], i}
					{@const Icon = s.icon}
					{@const theme = cardTheme[key] ?? cardTheme.Images}
					{@const formatList = s.formats.split(", ")}

					<div
						use:inview={{ delay: i * 70 }}
						class="support-card flex flex-col"
						style="--card-glow: {theme.glowColor}; --card-border: {theme.borderColor}; --card-top: {theme.topBar};"
					>
						<!-- Colored top bar -->
						<div class="card-top-bar"></div>

						<div class="p-5 flex flex-col gap-4 flex-1">
							<!-- Header row -->
							<div class="flex items-start justify-between gap-3">
								<div class="flex items-center gap-3">
									<!-- Icon -->
									<div
										class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
										style="background: {theme.iconBg}; color: {theme.iconColor};"
									>
										<Icon size={20} />
									</div>
									<div>
										<p class="font-semibold text-sm leading-tight">{s.title}</p>
										<p class="text-xs font-normal mt-0.5" style="color: {theme.iconColor}">
											{#if key === "Video"}
												Server processing
											{:else}
												Local · On-device
											{/if}
										</p>
									</div>
								</div>

								<!-- Status pill -->
								<span class={clsx(
									"flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-0.5",
									s.status === "ready"
										? "bg-accent-green/15 text-accent-green-alt dynadark:text-accent-green"
										: s.status === "downloading"
											? "bg-accent-blue/15 text-accent-blue-alt dynadark:text-accent-blue"
											: "bg-panel-highlight text-muted"
								)}>
									<span class={clsx(
										"w-1.5 h-1.5 rounded-full",
										s.status === "ready" ? "bg-accent-green" : s.status === "downloading" ? "bg-accent-blue" : "bg-muted"
									)}></span>
									{getStatusText(s.status)}
								</span>
							</div>

							<!-- Divider -->
							<div class="w-full h-px bg-separator"></div>

							<!-- Format count + tags -->
							<div class="flex flex-col gap-2 flex-1">
								<p class="text-xs font-semibold text-muted uppercase tracking-wider">
									{formatList.length} formats
								</p>

								<div class="format-scroll relative">
									<OverlayScrollbarsComponent
										options={{ scrollbars: { autoHide: "move", autoHideDelay: 1200 } }}
										defer
									>
										<div class="flex flex-wrap gap-1 pb-1">
											{#each formatList as format}
												{@const isPartial = format.endsWith("*")}
												{@const name = isPartial ? format.slice(0, -1) : format}
												{#if isPartial}
													<Tooltip text={getTooltip(name)}>
														<span
															class="format-tag partial"
															style="background: {theme.tagBg}; color: {theme.tagText};"
														>{name}<span class="text-accent-red-alt">*</span></span>
													</Tooltip>
												{:else}
													<span
														class="format-tag"
														style="background: {theme.tagBg}; color: {theme.tagText};"
													>{name}</span>
												{/if}
											{/each}
										</div>
									</OverlayScrollbarsComponent>
									<div class="format-fade" style="--fade-color: var(--bg-panel);"></div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Bottom note -->
		<p use:inview class="text-center text-xs font-normal text-muted mt-6">
			<span class="text-accent-red-alt">*</span> partial support — input or output only
		</p>
	</div>
</div>

<style lang="postcss">
	.support-card {
		@apply rounded-2xl border overflow-hidden;
		background: var(--bg-panel);
		border-color: var(--card-border);
		box-shadow: 0 0 0 1px var(--card-border), 0 2px 12px var(--card-glow);
		transition: transform 0.22s ease, box-shadow 0.22s ease;
	}

	.support-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 0 0 1px var(--card-border), 0 8px 28px var(--card-glow);
	}

	.card-top-bar {
		height: 3px;
		background: var(--card-top);
		opacity: 0.85;
		flex-shrink: 0;
	}

	.format-scroll {
		height: 9rem;
		position: relative;
		overflow: hidden;
	}

	.format-fade {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2.5rem;
		pointer-events: none;
		background: linear-gradient(to top, var(--bg-panel) 20%, transparent 100%);
	}

	.format-tag {
		display: inline-flex;
		align-items: center;
		font-size: 0.65rem;
		font-weight: 500;
		padding: 0.15rem 0.45rem;
		border-radius: 0.35rem;
		white-space: nowrap;
		line-height: 1.6;
		opacity: 0.9;
		transition: opacity 0.15s ease;
	}

	.format-tag:hover {
		opacity: 1;
	}

	.format-tag.partial {
		cursor: help;
	}
</style>
