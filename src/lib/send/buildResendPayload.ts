import type { ResendConfig, ReplyContext, ParsedEmail } from '../types';
import type { EmailAttachment } from './attachments';
import { toResendAttachments } from './attachments';
import { escapeHtml } from '../quoting/buildQuote';

/**
 * 组装 Resend 发送 payload
 */
export function buildResendPayload(
  parsedEmail: ParsedEmail,
  replyContext: ReplyContext,
  replyBody: string,
  quoteMode: 'html' | 'text',
  config: ResendConfig,
  attachments: EmailAttachment[] = []
): {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  headers: {
    'In-Reply-To': string;
    'References': string;
  };
  attachments?: Array<{ filename: string; content: string }>;
} {
  // 构建发件人地址
  const from = config.fromName
    ? `${config.fromName} <${config.fromEmail}>`
    : config.fromEmail;

  // 回复目标：优先使用用户输入的 replyToEmail
  const to = config.replyToEmail || replyContext.replyToEmail;

  // 邮件标题：优先使用用户输入的 subject
  const subject = config.subject || replyContext.replySubject;

  // 构建回复内容
  const safeReply = escapeHtml(replyBody).replace(/\r?\n/g, '<br>');
  const quotedContent = quoteMode === 'html'
    ? replyContext.quotedHtml
    : replyContext.quotedText;

  const html = `<p>${safeReply}</p><br>${quotedContent}`;

  // 构建纯文本版本
  const text = `${replyBody}\n\n${quotedContent}`;

  const resendAttachments = toResendAttachments(attachments);

  return {
    from,
    to,
    subject,
    html,
    text,
    headers: {
      'In-Reply-To': replyContext.finalInReplyTo,
      'References': replyContext.finalReferences.join(' ')
    },
    ...(resendAttachments.length > 0 ? { attachments: resendAttachments } : {})
  };
}