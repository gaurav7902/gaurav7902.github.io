# gaurav7902.github.io

Personal portfolio, live at <https://thegorav.xyz>. Plain HTML, CSS and ES
modules: no build step.

## Run locally

The site uses ES modules and `fetch`, so open it through a local server
(double-clicking `index.html` won't work):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Structure

```
index.html            page markup
styles.css            all styling (theme = CSS variables, see :root / [data-theme])
contributions.md      open-source contributions, parsed by the site
data/projects.js      projects + group projects (edit this to add a project)
data/github.json      GitHub snapshot, refreshed weekly by a workflow
js/main.js            entry point
js/ui.js              theme, progress bar, nav, scroll-spy, reveal, toast
js/effects.js         typewriter, cursor glow, card spotlight + tilt
js/projects.js        project cards + filter chips
js/contributions.js   reads contributions.md
js/github.js          live GitHub stats (snapshot first, then the API)
js/palette.js         Ctrl/Cmd+K command palette
scripts/sync-github.mjs, .github/workflows/sync-github.yml
```

## Everyday edits

- **Add a project:** add an object to `PROJECTS` in `data/projects.js`
  (the fields are documented at the top). Set `featured: true` to show it in
  the default view and `homepage` for a live-demo button.
- **Add a contribution:** add a `- <url>` line under a heading in
  `contributions.md`. New headings become new filter chips.
- **Refresh GitHub numbers now:** run the "Sync GitHub data" workflow, or
  `node scripts/sync-github.mjs`.
- **Resume:** put your PDF at `resume.pdf` in the repo root.
