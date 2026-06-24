import type { ReplyContext, ParsedEmail } from '../types';
import { buildHtmlQuote, buildTextQuote } from '../quoting/buildQuote';

/**
 * 确保 Subject 有 Re: 前缀
 */
export function ensureRePrefix(subject: string): string {
  if (/^\s*re:/i.test(subject)) return subject;
  return `Re: ${subject}`;
}

/**
 * 构建回复上下文
 * 生成发送所需的线程字段和引用内容
 */
export function buildReplyContext(parsedEmail: ParsedEmail): ReplyContext {
  const { messageId, inReplyTo, references, subject, from, date, textBody } = parsedEmail;

  // 生成回复 Subject
  const replySubject = ensureRePrefix(subject || '');

  // 构建线程字段
  const finalInReplyTo = messageId || inReplyTo;

  // References: 原有 references + 当前 message-id
  const finalReferences = references.length > 0
    ? [...references, messageId]
    : messageId ? [messageId] : [];

  // 回复目标邮箱
  const replyToEmail = from?.email || '';

  // 引用内容
  const fromRaw = from?.raw || '';
  const dateStr = date || '';
  const bodyForQuote = textBody || '';

  const quotedHtml = buildHtmlQuote(fromRaw, dateStr, bodyForQuote);
  const quotedText = buildTextQuote(fromRaw, dateStr, bodyForQuote);

  return {
    replySubject,
    finalInReplyTo,
    finalReferences,
    replyToEmail,
    quotedHtml,
    quotedText
  };
}