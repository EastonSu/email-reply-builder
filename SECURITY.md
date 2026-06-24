# Security Policy

## Supported Versions

Security fixes are handled on the `main` branch.

## Reporting a Vulnerability

Please do not open a public issue for vulnerabilities involving API keys, email content, or the send proxy.

Report security concerns through the contact channel on https://eastondev.com.

## API Key Guidance

- Do not commit `.env` files with real Resend API keys.
- Treat `PUBLIC_RESEND_API_KEY` as browser-visible. It is only suitable for local development.
- Rotate any key that may have been committed, pasted into a public issue, or used in a public deployment by mistake.
- Review logs for your deployment platform and make sure request bodies and `Authorization` values are not stored.

## Public Deployment Guidance

The `/api/send` route proxies user-provided payloads to Resend. Before exposing a fork publicly, add protections that fit your host:

- Request body size limits
- Rate limiting
- Upstream request timeouts
- Server-side payload validation
- Log redaction for API keys and email content
