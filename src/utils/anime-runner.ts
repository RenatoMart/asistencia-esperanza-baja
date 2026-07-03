import { animate } from 'animejs';

export const runEntranceAnimation = (
	targetRef?: HTMLElement | null,
	delay = 0,
) => {
	if (!targetRef) return;
	animate(targetRef, {
		y: [50, 0],
		opacity: [0, 1],
		duration: 800,
		delay,
		ease: 'outExpo',
	});
};

export const runLoopAnimation = (targetRef?: HTMLElement | null) => {
	if (!targetRef) return;
	animate(targetRef, {
		rotate: [0, 10, 0],
		duration: 1500,
		ease: 'inOutQuad',
		loop: true,
	});
};

export const runHoverAnimation = (
	targetRef: HTMLElement | null,
	isEntering: boolean,
) => {
	if (!targetRef) return;
	animate(targetRef, {
		scale: isEntering ? 1.05 : 1,
		boxShadow: isEntering
			? '0 8px 24px rgba(0,0,0,0.15)'
			: '0 2px 12px rgba(0,0,0,0.08)',
		duration: 300,
		ease: 'outQuad',
	});
};

export function run404Animations(container: HTMLElement): () => void {
	const svgEl = container.querySelector<SVGSVGElement>('svg');
	const zeroEl = container.querySelector<Element>('#zero');

	if (!svgEl || !zeroEl) return () => {};

	const floatAnim = animate(svgEl, {
		y: [0, 10],
		loop: true,
		ease: 'inOutSine',
		direction: 'alternate',
		duration: 1300,
	});

	const zeroAnim = animate(zeroEl, {
		x: [0, 10],
		scale: [1, 1.35, 1],
		loop: true,
		ease: 'inOutSine',
		direction: 'alternate',
		duration: 2000,
	});

	return () => {
		floatAnim.pause();
		zeroAnim.pause();
	};
}
