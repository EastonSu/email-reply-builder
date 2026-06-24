/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** 可选：构建/开发时注入，用于页面加载时预填 Resend API Key（会打进前端包，勿用于生产密钥泄露场景） */
  readonly PUBLIC_RESEND_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
