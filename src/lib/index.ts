export { parseEmail } from './parser/emailParser';
export { decodeMimeWord } from './parser/decodeMimeWord';
export { unfoldHeader } from './parser/unfoldHeader';
export { getHeader, parseEmailAddress } from './parser/normalizeHeaders';
export { extractBodies } from './parser/extractBodies';
export { decodeQuotedPrintable, decodeBase64, decodeByTransferEncoding } from './parser/decodeContent';

export { buildHtmlQuote, buildTextQuote, escapeHtml } from './quoting/buildQuote';

export { buildReplyContext, ensureRePrefix } from './send/buildReplyContext';
export { buildResendPayload } from './send/buildResendPayload';
export { sendViaResendBrowser } from './send/sendViaResendBrowser';
export {
  filesToAttachments,
  formatFileSize,
  totalAttachmentBytes,
  MAX_ATTACHMENT_TOTAL_BYTES,
  type EmailAttachment
} from './send/attachments';

export {
  validateParsedEmail,
  validateResendConfig,
  validateReplyBody,
  validateAttachments,
  validateSendRequest,
  type ValidationError
} from './validation/validateSendRequest';

export * from './types';