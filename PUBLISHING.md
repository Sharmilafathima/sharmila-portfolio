# Publishing and future updates

GitHub account: Sharmilafathima. Repository: sharmila-portfolio.

The GitHub Actions workflow in `.github/workflows/pages.yml` checks the JavaScript and publishes the contents of `dist` to GitHub Pages after changes are committed to `main`. In the repository’s Settings → Pages, the publishing source must be GitHub Actions.

## Edit your portfolio

- `dist/index.html`: headings, About, capabilities, and tool names/logos.
- `dist/portfolio-data.js`: project cards, contact links, portrait and résumé paths.
- `dist/project-details.js`: full project visuals grouped by matching project ID.
- `dist/assets/`: portrait, résumé, and locally stored project images.
- `dist/styles.css` and `dist/refinements.css`: layout, colors, spacing, and animation.

To add a project, add its cover and metadata to `projects` in `portfolio-data.js`, and its full image sequence to the matching ID in `project-details.js`. Update the visible All work count in `index.html`. Commit the changed files and any new images to `main`; the publishing workflow updates the live site.

For local preview, run `node server.mjs` from the repository folder and open http://127.0.0.1:4173/. No package installation or build is needed. The site uses relative asset paths, so it supports a GitHub Pages project URL.

Only the portfolio source and intended public assets belong in the GitHub repository. Local hosting identity, editing notes, and layout-check pages are not required for GitHub Pages.
