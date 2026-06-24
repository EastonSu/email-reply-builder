import type { SendResult, ParsedEmail, ResendConfig } from '../types';
import type { EmailAttachment } from './attachments';
import { buildResendPayload } from './buildResendPayload';
import { buildReplyContext } from './buildReplyContext';

/**
 * 通过本地 API 代理发送邮件到 Resend
 */
export async function sendViaResendBrowser(
  parsedEmail: ParsedEmail,
  replyBody: string,
  quoteMode: 'html' | 'text',
  config: ResendConfig,
  attachments: EmailAttachment[] = []
): Promise<SendResult> {
  // 构建回复上下文
  const replyContext = buildReplyContext(parsedEmail);

  // 组装 payload
  const payload = buildResendPayload(
    parsedEmail,
    replyContext,
    replyBody,
    quoteMode,
    config,
    attachments
  );

  try {
    // 通过本地 API 代理发送，避免 CORS
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: config.apiKey,
        payload
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        provider: 'resend',
        error: data.error || `HTTP ${response.status}`
      };
    }

    return {
      success: true,
      provider: 'resend',
      emailId: data.emailId
    };
  } catch (error) {
    return {
      success: false,
      provider: 'resend',
      error: error instanceof Error ? error.message : 'Unknown network error'
    };
  }
}