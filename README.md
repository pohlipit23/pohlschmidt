# My personal website project

This is the repository for the website pohlschmidt.de

After two decades of leading digital growth and revolutionizing online travel with brands like Microsoft, Qatar Airways, TUI, and Opodo, I’m moving towards new, exciting ventures. With technologies like AI, NDC, 5G, and robotics reshaping the industry, I’m thrilled to explore fresh opportunities to drive innovative digital experiences.

## Development

Styling uses Tailwind CSS, compiled ahead of time into the static `tailwind.css` (no runtime CDN script). After changing Tailwind classes in `index.html` or `main.js`, rebuild it with:

`npx tailwindcss@3.4.17 --content "./index.html,./main.js" -o tailwind.css --minify`
