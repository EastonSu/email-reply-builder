import type { EmailAttachment } from './send/attachments';

/**
 * ParsedEmail - 解析后的邮件结构
 */
export interface ParsedEmail {
  messageId: string;
  inReplyTo: string;
  references: string[];
  subject: string;
  from?: EmailAddress;
  to?: EmailAddress;
  date?: string;
  textBody?: string;
  htmlBody?: string;
  rawHeaders: Record<string, string>;
  warnings: string[];
}

/**
 * EmailAddress - 邮件地址结构
 */
export interface EmailAddress {
  name?: string;
  email: string;
  raw: string;
}

/**
 * ReplyContext - 回复上下文
 */
export interface ReplyContext {
  replySubject: string;
  finalInReplyTo: string;
  finalReferences: string[];
  replyToEmail: string;
  quotedHtml: string;
  quotedText: string;
}

/**
 * ResendConfig - Resend 发送配置
 */
export interface ResendConfig {
  apiKey: string;
  fromName?: string;
  fromEmail: string;
  replyToEmail: string; // 回复目标邮箱，自动填充但可修改
  subject: string; // 邮件标题，自动填充 Re: 前缀但可修改
}

/**
 * SendRequest - 发送请求
 */
export interface SendRequest {
  rawEmail: string;
  replyBody: string;
  quoteMode: 'html' | 'text';
  resend: ResendConfig;
}

/**
 * SendResult - 发送结果
 */
export interface SendResult {
  success: boolean;
  provider: 'resend';
  emailId?: string;
  error?: string;
}

export type { EmailAttachment };

/**
 * AppState - 应用状态
 */
export interface AppState {
  rawEmail: string;
  parsedEmail: ParsedEmail | null;
  replyBody: string;
  quoteMode: 'html' | 'text';
  resendConfig: ResendConfig;
  attachments: EmailAttachment[];
  sendResult: SendResult | null;
  isParsing: boolean;
  isSending: boolean;
  parseError: string | null;
}