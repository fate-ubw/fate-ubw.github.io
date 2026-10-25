# Xuanwang Zhang — personal homepage

A local static academic homepage with Notion-style typography and spacing.

## Preview

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4321. After editing content, run `npm run build` and refresh the browser.

## Edit content

- `content/about.md`: biography in Markdown.
- `content/data/site.json`: publications, authors, venues, descriptions and links.
- `public/images/`: portrait and paper figures. Each figure uses its paper ID as the filename.
- `content/posts/`: blog posts, one Markdown file per article.

Blog filenames use lowercase ASCII slugs, such as `retrieval-notes.md`. Begin each post with JSON metadata between `---` lines:

```markdown
---
{"title":"Article title","date":"2026-10-25","category":"Research","tags":["Agents"],"draft":true}
---

Write the article in Markdown here.
```

Change `draft` to `false` when ready to show the article. Categories are generated from published posts. No sample articles are published.

## Build

`npm run build` generates `dist/`, which can be hosted on GitHub Pages. All local links support deployment under a repository subpath. No remote repository or deployment is configured yet.

The `research/` folder contains private collection notes and is excluded from Git and the generated site.

## Conference logos and GitHub stars

Conference logos are stored locally under `public/images/conferences/`, sourced from each conference official website.

Repository star counts are fetched from the public GitHub REST API when a visitor opens the site. Counts are cached in the visitor browser for 10 minutes and refreshed while the page is visible. Counts below 10 are hidden; the Code link remains available. Failed API requests hide the count rather than show a placeholder number. No token is needed or embedded.
