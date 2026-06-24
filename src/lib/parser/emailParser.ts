import type { ParsedEmail, EmailAddress } from '../types';
import { getHeader, parseEmailAddress } from './normalizeHeaders';
import { decodeMimeWord } from './decodeMimeWord';
import { extractBodies } from './extractBodies';

/**
 * 解析原始邮件
 * 提取关键元数据和正文
 */
export function parseEmail(rawEmail: string): ParsedEmail {
  const warnings: string[] = [];

  // 提取基本 headers
  const messageId = getHeader(rawEmail, 'Message-ID');
  const inReplyTo = getHeader(rawEmail, 'In-Reply-To');
  const referencesRaw = getHeader(rawEmail, 'References');
  const fromRaw = getHeader(rawEmail, 'From');
  const toRaw = getHeader(rawEmail, 'To');
  const date = getHeader(rawEmail, 'Date');
  const subjectRaw = getHeader(rawEmail, 'Subject');

  // 解码 Subject
  const subject = decodeMimeWord(subjectRaw);

  // 解析 References 为数组
  const references = referencesRaw
    ? referencesRaw.split(/\s+/).filter(Boolean)
    : [];

  // 解析邮件地址
  const from = fromRaw ? parseEmailAddress(decodeMimeWord(fromRaw)) : undefined;
  const to = toRaw ? parseEmailAddress(decodeMimeWord(toRaw)) : undefined;

  // 提取正文
  const { textBody, htmlBody } = extractBodies(rawEmail);

  // 生成 warnings
  if (!messageId) {
    warnings.push('Missing Message-ID: reply threading will not work correctly');
  }

  if (!subject) {
    warnings.push('Missing Subject: reply subject will be empty');
  }

  if (!from && !to) {
    warnings.push('Missing From/To headers: cannot determine reply target');
  }

  if (!textBody && !htmlBody) {
    warnings.push('Could not extract email body content');
  }

  // 构建原始 headers map
  const rawHeaders: Record<string, string> = {};
  const headerSection = rawEmail.split(/\r?\n\r?\n/)[0] || '';
  const headerLines = headerSection.split(/\r?\n/);

  let currentHeader = '';
  for (const line of headerLines) {
    if (/^[ \t]/.test(line)) {
      // 折行，追加到当前 header
      if (currentHeader) {
        rawHeaders[currentHeader] += ' ' + line.trim();
      }
    } else if (/^[^:]+:/.test(line)) {
      // 新 header
      const colonIndex = line.indexOf(':');
      currentHeader = line.slice(0, colonIndex).toLowerCase();
      rawHeaders[currentHeader] = line.slice(colonIndex + 1).trim();
    }
  }

  return {
    messageId,
    inReplyTo,
    references,
    subject,
    from: from as EmailAddress | undefined,
    to: to as EmailAddress | undefined,
    date,
    textBody,
    htmlBody,
    rawHeaders,
    warnings
  };
}