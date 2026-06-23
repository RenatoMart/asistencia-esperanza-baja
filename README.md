# Next.js + TypeScript + Anime.js (60FPS Architecture) 🚀

This is a high-performance boilerplate template for building modern web applications using **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Anime.js (v4)**.

Designed with strict Web Vitals and 60FPS animation principles in mind.

## 🌟 Key Features

- **Strict 60FPS Animations**: Only animates GPU-accelerated properties (`transform` and `opacity`) using Anime.js v4.
- **Main Thread Protection**: Follows architectural best practices to prevent blocking the main thread.
- **Hydration Safe**: Configured to prevent React hydration errors gracefully, even with browser extensions.
- **Tailwind Strict Mode**: Avoids `transition-all` and costly repaints by strictly transitioning necessary properties.
- **Pre-configured Folder Structure**: Includes `components/ui`, `components/layout`, `hooks`, `types`, and `lib` directories.

## 📁 Project Structure

```bash
src/
├── app/             # Next.js App Router (pages, layout, globals.css)
├── components/      
│   ├── layout/      # Layout components (Header, Footer, etc.)
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Shared utilities and configurations
├── types/           # Global TypeScript definitions
└── utils/           
    └── anime-runner.ts # Anime.js animation wrappers
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The main page includes a test component showcasing a strictly composed 60FPS GPU-accelerated animation using Anime.js.

## 🛠️ Performance Directives

If you intend to use this template, please adhere to these rendering and animation rules:

- **Reflows vs Repaints**: NEVER animate layout properties like `width`, `height`, `top`, `left`, `margin`, or `padding`. Always use `transform` (`scale`, `translate`) and `opacity`.
- **GPU Acceleration**: Make use of Tailwind's `transform-gpu` and `will-change-*` utility classes for frequently animated elements.
- **Code-Splitting**: Load heavy components dynamically via `next/dynamic` or `React.lazy()` to protect the main thread and achieve a fast LCP (Largest Contentful Paint).

## 📄 License

MIT License. Feel free to use this boilerplate for your projects!