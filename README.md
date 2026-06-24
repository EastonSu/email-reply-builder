# Email Reply Builder

Email Reply Builder helps you reply from your custom domain email while keeping the original email thread and conversation history.

It is designed for users who receive custom-domain emails through Cloudflare Email Routing, read them in a personal inbox like Gmail, and want to reply from the same custom email address through Resend without losing the Gmail conversation thread.

This is the open-source version of the Email Reply Builder from Easton Tools.

- Live tool: [Email Reply Builder](https://tools.eastondev.com/email-reply-builder/)
- More tools: [Easton Tools](https://tools.eastondev.com/)
- Blog and build notes: [Easton Dev Blog](https://eastondev.com)
- Chinese documentation: [README_CN.md](./README_CN.md)

## Why This Exists

Cloudflare Email Routing is great for receiving emails on a custom domain, but replying from that same custom email address can be awkward. A common workflow looks like this:

```text
contact@yourdomain.com -> Cloudflare Email Routing -> your Gmail inbox
```

Receiving works nicely. The problem appears when you reply. If you reply directly from Gmail, the reply may come from your Gmail address. If you send with Resend, Gmail and other clients may show the message as a new email instead of keeping it in the original conversation.

Email Reply Builder solves this small but annoying gap. It parses the original raw email, extracts threading headers such as `Message-ID`, `In-Reply-To`, and `References`, then builds a Resend email payload that preserves the same thread.

## Use Cases

- Reply from a custom domain email after using Cloudflare Email Routing.
- Keep Gmail conversation history when replying through Resend.
- Send same-thread replies from `contact@yourdomain.com`, `support@yourdomain.com`, or another custom address.
- Extract `Message-ID`, `In-Reply-To`, and `References` from raw emails.
- Build a lightweight custom-domain email reply workflow without setting up a full mailbox provider.

## Features

- **Raw email parser** - Extract sender, recipient, subject, date, `Message-ID`, `In-Reply-To`, and `References`.
- **Thread-aware Resend replies** - Generate headers that help Gmail keep replies in the same conversation.
- **Custom-domain workflow** - Designed for Cloudflare Email Routing + Gmail + Resend users.
- **UTF-8 safe decoding** - Decode Base64 and quoted-printable bodies with charset support.
- **Local attachments** - Attach local files, encoded as Base64, with an approximate 9 MB total limit.
- **Bilingual UI** - English and Chinese interface strings.

## Quick Start

Requires Node.js 22.12.0 or newer.

```bash
git clone https://github.com/EastonSu/email-reply-builder.git
cd email-reply-builder
npm install
npm run dev
```

Open the local URL printed by Astro, usually `http://localhost:4321`.

## How It Works

1. Receive an email through Cloudflare Email Routing in Gmail or another inbox.
2. Open the original email in Gmail and choose **Show original**.
3. Copy the full raw email source.
4. Paste it into Email Reply Builder and parse it.
5. Write your reply, confirm the sender address, and enter your Resend API key.
6. Send the reply through Resend with the proper threading headers.

In local development, the browser calls your local Astro route:

```text
Browser -> http://localhost:4321/api/send -> Resend API
```

Your Resend API key is sent to the local `/api/send` route only for the request to Resend. Do not commit real keys to `.env`, and do not use a public `PUBLIC_RESEND_API_KEY` in production builds.

### Optional Local Key Prefill

You can copy `.env.example` to `.env` and set:

```bash
PUBLIC_RESEND_API_KEY=re_xxx
```

This is only for local development. Vite exposes `PUBLIC_` variables to browser JavaScript, so the value can appear in client bundles.

## Scripts

```bash
npm run dev       # Start the local dev server
npm test -- --run # Run unit tests once
npm run build     # Build the server and client bundles
npm run preview   # Preview the production build
```

## Deployment

This project uses Astro server output because `/api/send` proxies requests to Resend. Deploy it to a Node-capable host such as Vercel, Netlify with a Node runtime, or a self-hosted Node server.

For public deployments, review the API route first. Add rate limiting, request-size limits, timeout handling, and logging rules appropriate for your host.

## Project Structure

```text
src/
  pages/          Astro pages and API route
  components/     React UI components
  lib/parser/     Raw email parsing
  lib/quoting/    Reply quote generation
  lib/send/       Resend payload and attachment helpers
  lib/validation/ Client-side validation
  styles/         Application CSS
```

## Privacy

- Raw email parsing happens in the browser.
- The API key is kept in React state and is not written to `localStorage`.
- When sending, the API key and email payload are sent to the `/api/send` route of the running instance so it can call Resend.
- The official Easton Tools hosted version does not store your API key or email content.

See [SECURITY.md](./SECURITY.md) for security reporting and key-handling guidance.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT License. See [LICENSE](./LICENSE).
