# Contributing

Thanks for considering a contribution to Email Reply Builder.

## Development

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm test -- --run
npm run build
```

## Pull Requests

- Keep changes focused and easy to review.
- Add or update tests when changing parser, quoting, validation, or send payload behavior.
- Do not commit `.env`, real API keys, private email content, screenshots containing personal data, or local IDE/MCP configuration.
- Update README files when user-facing behavior changes.

## Issues

Bug reports are most useful when they include:

- Expected behavior
- Actual behavior
- Steps to reproduce
- A redacted raw email sample when parser behavior is involved
