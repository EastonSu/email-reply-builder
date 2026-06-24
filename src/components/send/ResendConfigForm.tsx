import type { ResendConfig, ParsedEmail, EmailAttachment } from '../../lib/types';
import type { Translations } from '../../lib/i18n';
import AttachmentPicker from './AttachmentPicker';

interface ResendConfigFormProps {
  config: ResendConfig;
  parsedEmail?: ParsedEmail | null;
  attachments: EmailAttachment[];
  onAttachmentsChange: (attachments: EmailAttachment[]) => void;
  onChange: (config: ResendConfig) => void;
  onSend: () => void;
  isSending?: boolean;
  disabled?: boolean;
  t: Translations;
}

export default function ResendConfigForm({
  config,
  parsedEmail,
  attachments,
  onAttachmentsChange,
  onChange,
  onSend,
  isSending = false,
  disabled = false,
  t
}: ResendConfigFormProps) {
  const handleChange = (field: keyof ResendConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  // Reply To 字段：优先使用用户输入，如果为空则使用解析结果
  const replyToValue = config.replyToEmail || parsedEmail?.from?.email || '';
  const replyToSourceHint = parsedEmail?.from?.email
    ? t.replyToSourceHint
    : t.replyToPlaceholderHint;

  // Subject 字段：优先使用用户输入，如果为空则使用 ensureRePrefix 处理的主题
  // 直接从 parsedEmail.subject 计算，避免双重 Re: 前缀
  const subjectValue = config.subject || (parsedEmail?.subject ? `Re: ${parsedEmail.subject.replace(/^Re:\s*/i, '')}` : '');
  const subjectHint = parsedEmail?.subject
    ? t.subjectSourceHint
    : t.subjectPlaceholderHint;

  // Sender Email 字段：优先使用用户输入，如果为空则使用解析结果
  const fromEmailValue = config.fromEmail || parsedEmail?.to?.email || '';
  const senderEmailHint = parsedEmail?.to?.email
    ? t.senderEmailHint
    : t.mustVerifiedDomain;

  // Sender Name 字段：优先使用用户输入，如果为空则使用解析结果
  const fromNameValue = config.fromName || parsedEmail?.to?.name || '';

  const sendDisabled = Boolean(disabled || isSending);

  return (
    <div className="resend-config-form">
      <div className="config-fields">
        <div className="field">
          <label htmlFor="subject">{t.replySubject} *</label>
          <input
            id="subject"
            type="text"
            value={subjectValue}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder={t.subjectPlaceholder}
            className={parsedEmail?.subject ? 'auto-filled' : ''}
            aria-required="true"
          />
          <p className="field-hint">{subjectHint}</p>
        </div>

        <div className="field">
          <label htmlFor="replyToEmail">{t.replyToTarget} *</label>
          <input
            id="replyToEmail"
            type="email"
            value={replyToValue}
            onChange={(e) => handleChange('replyToEmail', e.target.value)}
            placeholder={t.replyToPlaceholder}
            className={parsedEmail?.from?.email ? 'auto-filled' : ''}
            aria-required="true"
          />
          <p className="field-hint">{replyToSourceHint}</p>
        </div>

        <div className="field">
          <label htmlFor="apiKey">{t.resendApiKey} *</label>
          <input
            id="apiKey"
            type="password"
            value={config.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            placeholder={t.apiKeyPlaceholder}
            autoComplete="off"
            aria-required="true"
          />
          <p className="field-hint">{t.apiKeyHint}</p>
        </div>

        <div className="field">
          <label htmlFor="fromEmail">{t.senderEmail} *</label>
          <input
            id="fromEmail"
            type="email"
            value={fromEmailValue}
            onChange={(e) => handleChange('fromEmail', e.target.value)}
            placeholder={t.senderEmailPlaceholder}
            className={parsedEmail?.to?.email ? 'auto-filled' : ''}
            aria-required="true"
          />
          <p className="field-hint">{senderEmailHint}</p>
        </div>

        <div className="field">
          <label htmlFor="fromName">{t.senderName}</label>
          <input
            id="fromName"
            type="text"
            value={fromNameValue}
            onChange={(e) => handleChange('fromName', e.target.value)}
            placeholder={t.senderNamePlaceholder}
          />
        </div>

        <AttachmentPicker
          attachments={attachments}
          onChange={onAttachmentsChange}
          disabled={disabled}
          t={t}
        />
      </div>

      <button
        type="button"
        className="send-btn"
        onClick={onSend}
        disabled={sendDisabled}
        aria-busy={isSending ? true : undefined}
      >
        {isSending ? t.sending : t.sendReply}
      </button>
    </div>
  );
}