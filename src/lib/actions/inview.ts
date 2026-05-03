export interface InviewOptions {
	delay?: number;
	threshold?: number;
	rootMargin?: string;
}

export function inview(node: HTMLElement, options: InviewOptions = {}) {
	const { delay = 0, threshold = 0.08, rootMargin = '0px 0px -24px 0px' } = options;

	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReduced) {
		node.classList.add('in-view');
		return { destroy() {} };
	}

	node.style.setProperty('--reveal-delay', `${delay}ms`);
	node.classList.add('reveal');

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
					observer.unobserve(node);
				}
			});
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
