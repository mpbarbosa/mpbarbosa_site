# Separate /en/ page instead of JS-based language toggle

The site is Portuguese-first (pt-BR). To serve English-speaking Singularity investors without breaking the existing Portuguese experience, we added a dedicated `/en/index.html` rather than a single-page JS content-swap toggle.

A JS toggle (data-pt/data-en attributes, localStorage) was considered and rejected: it adds non-trivial state management to a site that currently has almost none, breaks when JS is disabled, and gives both languages the same URL — preventing SEO indexing of each language separately. A URL-parameter approach (?lang=en) shares the same drawbacks without the elegance.

The separate page at `/en/` gives each language its own canonical URL (better SEO for both PT and EN audiences), lets social media and Singularity links point directly to the English version, and keeps the Portuguese page unchanged. The trade-off is content duplication between `index.html` and `en/index.html`, accepted because the site has no build step and the content is small.
