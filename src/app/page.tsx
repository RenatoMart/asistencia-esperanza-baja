/* eslint-disable max-len */
'use client';

import { useEffect, useRef } from 'react';
import {
	runEntranceAnimation,
	runHoverAnimation,
	runLoopAnimation,
} from '../utils/anime-runner';

export default function Home() {
	const titleRef = useRef<HTMLHeadingElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const spinnerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Entry animations
		if (titleRef.current) {
			runEntranceAnimation(titleRef.current, 100);
		}
		if (boxRef.current) {
			runEntranceAnimation(boxRef.current, 300);
		}
		if (spinnerRef.current) {
			runLoopAnimation(spinnerRef.current);
		}
	}, []);


	return (
		<main className='flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-8 text-white'>
			<div className='flex w-full max-w-2xl flex-col items-center gap-12'>
				<h1
					ref={titleRef}
					className='transform-gpu text-center text-4xl font-bold tracking-tight opacity-0 sm:text-6xl'
				>
					High Performance <span className='text-blue-500'>Next.js</span>
				</h1>

				<div
					ref={boxRef}
					className='flex w-full transform-gpu flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-[#111] p-8 opacity-0 will-change-transform'
					onMouseEnter={() => runHoverAnimation(boxRef.current, true)}
					onMouseLeave={() => runHoverAnimation(boxRef.current, false)}
				>
					<h2 className='text-2xl font-semibold'>Anime.js GPU Accelerated</h2>
					<p className='text-center text-gray-400'>
						Strict 60FPS architecture. Hover over this card to see smooth
						composited animations using scale and box-shadow without triggering
						layouts.
					</p>

					<div
						ref={spinnerRef}
						className='h-12 w-12 transform-gpu rounded-lg border-2 border-blue-500 bg-blue-500/20 will-change-transform'
					/>
				</div>
			</div>
		</main>
	);
}
