# Security and Publication Policy

## Credential Rules

Never commit:

- `.env` files
- API keys, passwords, access tokens, refresh tokens, or session cookies
- Private keys, certificates, browser profiles, or authentication exports
- Personal account configuration

Committed examples must use placeholders such as `<your_api_key_here>`.

## Skill Review

Before publishing a Skill:

1. Scan file names for credential, token, cookie, account, and auth artifacts.
2. Scan text for common secret formats and assigned credential values.
3. Remove caches, compiled files, backups, logs, and generated results.
4. Check absolute paths and personal identifiers.
5. Confirm examples use placeholders or environment variables.

Some Skills legitimately contain credential-handling code or public client
identifiers. That code is acceptable only when no real user credential or
private account data is embedded.

## Repository Boundary

Private workspace directories are ignored recursively and represented only by
`.gitkeep` files. Publishing a new file from one of these directories requires
an explicit review and deliberate exception.
