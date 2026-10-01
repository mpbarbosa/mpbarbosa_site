# Formspree AJAX (CDN) for the contact form

The site is static HTML5 with no bundler and no backend. The contact form needed a real submission target without adding server infrastructure.

We chose Formspree's AJAX CDN integration (`@formspree/ajax@1` via unpkg) over the two alternatives: Basic HTML (sets `action` to the Formspree endpoint, no JS) would redirect the user away to Formspree's domain on submit — breaking the single-page feel. The React SDK requires a bundler and React, neither of which this site uses.

The CDN approach keeps the user on the page, shows inline field-level errors via `data-fs-error`, disables the submit button during submission via `data-fs-submit-btn`, and degrades gracefully — the form's `action` attribute points to the live Formspree endpoint so submissions still work if the CDN script fails to load. The endpoint is `https://formspree.io/f/xrevgvda`; submissions arrive at `mpbarbosa@gmail.com`. The PT and EN pages each carry their own `data-fs-success` message in the correct language.
