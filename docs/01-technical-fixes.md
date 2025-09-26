# 01 — Technical Fixes

## AI Assistant Overlay Bug (Black Screen)

Symptoms: Opening AI assistant caused the main content area to appear black or obscured by an overlay.

Root causes confirmed:
- Full-screen overlay with high opacity covering primary content
- Z-index conflicts between header (`z-40`), overlay, and assistant drawer
- Mixed usage of `h-full` vs `h-screen` introducing stacking quirks on Windows

Fix applied:
- Overlay rewritten with Tailwind v4 syntax and lower z-index: `bg-black/10 z-30`
- Drawer height standardized to viewport: `h-screen`
- Drawer kept above overlay with `z-50`
- Transition uses `translate-x` to ensure GPU-friendly animation

Code reference: `apps/web/app/components/ui/FloatingAIAssistant.tsx`

```diff
- <div className="fixed inset-0 z-40 bg-black bg-opacity-20" />
+ <div className="fixed inset-0 z-30 bg-black/10" />

- <div className="fixed top-0 right-0 z-50 h-full w-96 ...">
+ <div className="fixed top-0 right-0 z-50 h-screen w-96 ...">
```

Verification checklist:
- Opening assistant keeps dashboard visible and interactive
- `Esc` closes drawer and removes overlay without flicker
- Keyboard focus remains trapped inside the drawer while open

## Performance Tweaks
- Avoid heavy gradients on large containers; keep in header only
- Use `transform` transitions for drawer for GPU acceleration
- Keep overlay minimal to reduce paint cost

## Windows Path Reliability
- All seed reads use `path.resolve(process.cwd(), '..', 'data', 'seeded')`
- Verified loads: 7 population records, 8 supplies; 15 docs indexed


