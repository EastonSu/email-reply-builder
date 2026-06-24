import type { ParsedEmail, ResendConfig, EmailAttachment } from '../types';
import {
  MAX_ATTACHMENT_TOTAL_BYTES,
  totalAttachmentBytes,
  formatFileSize
} from '../send/attachments';

export type ValidationError = {
  field: string;
  level: 'error' | 'warning';
  message: string;
};

/**
 * 校验解析后的邮件数据
 */
export function validateParsedEmail(parsedEmail: ParsedEmail | null): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!parsedEmail) {
    errors.push({
      field: 'rawEmail',
      level: 'error',
      message: 'Please paste raw email content'
    });
    return errors;
  }

  if (!parsedEmail.messageId) {
    errors.push({
      field: 'messageId',
      level: 'error',
      message: 'Missing Message-ID: reply threading will not work'
    });
  }

  if (!parsedEmail.from?.email) {
    errors.push({
      field: 'to',
      level: 'error',
      message: 'Cannot determine reply target (missing From header)'
    });
  }

  if (!parsedEmail.textBody && !parsedEmail.htmlBody) {
    errors.push({
      field: 'body',
      level: 'warning',
      message: 'Could not extract original email body'
    });
  }

  // 添加解析 warnings
  for (const w of parsedEmail.warnings) {
    errors.push({
      field: 'parser',
      level: 'warning',
      message: w
    });
  }

  return errors;
}

/**
 * 校验 Resend 发送配置
 */
export function validateResendConfig(config: ResendConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!config.apiKey) {
    errors.push({
      field: 'apiKey',
      level: 'error',
      message: 'Resend API Key is required'
    });
  }

  if (!config.fromEmail) {
    errors.push({
      field: 'fromEmail',
      level: 'error',
      message: 'Sender email address is required'
    });
  } else if (!isValidEmail(config.fromEmail)) {
    errors.push({
      field: 'fromEmail',
      level: 'error',
      message: 'Invalid sender email format'
    });
  }

  if (!config.replyToEmail) {
    errors.push({
      field: 'replyToEmail',
      level: 'error',
      message: 'Reply target email is required'
    });
  } else if (!isValidEmail(config.replyToEmail)) {
    errors.push({
      field: 'replyToEmail',
      level: 'error',
      message: 'Invalid reply target email format'
    });
  }

  if (!config.subject) {
    errors.push({
      field: 'subject',
      level: 'error',
      message: 'Reply subject is required'
    });
  }

  return errors;
}

/**
 * 校验回复正文
 */
export function validateReplyBody(replyBody: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!replyBody.trim()) {
    errors.push({
      field: 'replyBody',
      level: 'error',
      message: 'Reply content is required'
    });
  }

  return errors;
}

/**
 * 校验附件总大小
 */
export function validateAttachments(attachments: EmailAttachment[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const total = totalAttachmentBytes(attachments);

  if (total > MAX_ATTACHMENT_TOTAL_BYTES) {
    errors.push({
      field: 'attachments',
      level: 'error',
      message: `Attachments exceed limit (${formatFileSize(total)} / ${formatFileSize(MAX_ATTACHMENT_TOTAL_BYTES)} max)`
    });
  }

  for (const a of attachments) {
    if (!a.filename.trim()) {
      errors.push({
        field: 'attachments',
        level: 'error',
        message: 'Attachment must have a filename'
      });
    }
  }

  return errors;
}

/**
 * 综合校验发送请求
 */
export function validateSendRequest(
  parsedEmail: ParsedEmail | null,
  replyBody: string,
  config: ResendConfig,
  attachments: EmailAttachment[] = []
): { canSend: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [
    ...validateParsedEmail(parsedEmail),
    ...validateReplyBody(replyBody),
    ...validateResendConfig(config),
    ...validateAttachments(attachments)
  ];

  const hasErrors = errors.some(e => e.level === 'error');

  return {
    canSend: !hasErrors,
    errors
  };
}

/**
 * 验证邮箱格式
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}