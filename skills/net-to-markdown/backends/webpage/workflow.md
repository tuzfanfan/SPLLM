# Workflow Notes

## Goal

Convert a webpage URL into clean Markdown that is easy to save into notes, feed into an LLM, or continue editing.

## Default behavior

- Fetch the page with a normal desktop browser user agent
- Extract the main article body first
- Fall back to common content containers when article extraction is weak
- Remove obvious clutter such as nav, footer, forms, scripts, and sidebars
- Convert HTML into Markdown
- Optionally remove links and images
- Optionally prepend metadata and a page structure map

## Browser-session fallback

Use the WebBridge path when the page content only appears after a real browser render or login session.

Good browser-session cases:

- WeChat public articles
- Logged-in dashboards and internal tools
- Client-rendered pages where direct fetch returns blank or shell HTML
- Pages where the user wants the rendered content from their current browser context

The browser-session path:

- Opens the page in the user's real Chrome session through Kimi WebBridge
- Waits for the page to render
- Pulls the rendered content container HTML
- Reuses the same Markdown cleanup pipeline as the direct-fetch script

## Automatic routing

Use the auto-router when you want one command to make the first routing decision.

The auto-router order:

- Try direct fetch first
- Score the result for obvious shell-page or blank-output failure
- Retry through a headless browser render when direct fetch is weak
- If both fail, tell the operator to use the real-browser-session path

## Good fits

- News articles
- Blog posts
- Documentation pages
- Long-form writeups
- Research or reference pages that need Markdown cleanup

## Known limits

- Heavily client-rendered pages may need a real browser render step first
- Logged-in pages and anti-bot pages may need browser automation instead of direct HTTP fetch
- The heading outline depends on the page having meaningful heading structure
- The browser-session path depends on Kimi WebBridge being installed, running, and extension-connected
