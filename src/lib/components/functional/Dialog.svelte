<script lang="ts">
        import { duration, fade, fly } from "$lib/util/animation";
        import { removeDialog } from "$lib/store/DialogProvider";
        import { BanIcon, CheckIcon, InfoIcon, TriangleAlert } from "lucide-svelte";
        import { quintOut } from "svelte/easing";
        import type { Dialog as DialogType } from "$lib/store/DialogProvider";

        type Props = DialogType;

        const p: Props = $props();
        const id = $derived(p.id);
        const title = $derived(p.title);
        const message = $derived(p.message);
        const buttons = $derived(p.buttons);
        const type = $derived(p.type);
        const additional = $derived("additional" in p ? (p as any).additional : undefined);

        const colors = {
                success: "purple",
                error: "red",
                info: "blue",
                warning: "pink",
        };

        const Icons = {
                success: CheckIcon,
                error: BanIcon,
                info: InfoIcon,
                warning: TriangleAlert,
        };

        let color = $derived(colors[type]);
        let Icon = $derived(Icons[type]);
</script>

<div
        class="dialog-card flex flex-col items-center justify-between w-full max-w-sm p-5 gap-5 bg-panel rounded-2xl"
        style="border-left: 3px solid var(--accent-{color}-alt, var(--accent));"
        in:fly={{ duration, easing: quintOut, x: 0, y: 80 }}
        out:fade={{ duration, easing: quintOut }}
>
        <div class="flex justify-between w-full items-center gap-3">
                <div class="flex items-center gap-3">
                        <div class="rounded-xl bg-accent-{color} p-2 inline-flex w-9 h-9 items-center justify-center flex-shrink-0">
                                <Icon size="16" color="black" />
                        </div>
                        <p class="text-base font-semibold">{title}</p>
                </div>
        </div>

        <div class="flex flex-col gap-1 w-full">
                {#if typeof message === "string"}
                        <p class="text-sm font-normal text-muted whitespace-pre-wrap leading-relaxed">{message}</p>
                {:else}
                        {@const MessageComponent = message}
                        <div class="text-sm font-normal text-muted">
                                <MessageComponent {id} {title} {type} {buttons} {additional} />
                        </div>
                {/if}
        </div>

        <div class="flex flex-row items-center gap-3 w-full">
                {#each buttons as { text, action }, i}
                        <button
                                class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 {i === 1
                                        ? `bg-accent-${color} text-black hover:opacity-90`
                                        : 'bg-panel-highlight text-foreground hover:opacity-80'}"
                                onclick={() => {
                                        action();
                                        removeDialog(id);
                                }}
                        >
                                {text}
                        </button>
                {/each}
        </div>
</div>

<style lang="postcss">
        .dialog-card {
                box-shadow: var(--shadow-elevated);
        }
</style>
