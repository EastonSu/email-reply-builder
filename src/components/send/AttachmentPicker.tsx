import { useRef, useState } from 'react';
import type { EmailAttachment } from '../../lib/types';
import {
  filesToAttachments,
  formatFileSize,
  totalAttachmentBytes,
  MAX_ATTACHMENT_TOTAL_BYTES
} from '../../lib/send/attachments';
import type { Translations } from '../../lib/i18n';

interface AttachmentPickerProps {
  attachments: EmailAttachment[];
  onChange: (attachments: EmailAttachment[]) => void;
  disabled?: boolean;
  t: Translations;
}

export default function AttachmentPicker({
  attachments,
  onChange,
  disabled = false,
  t
}: AttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [readError, setReadError] = useState<string | null>(null);

  const totalBytes = totalAttachmentBytes(attachments);
  const overLimit = totalBytes > MAX_ATTACHMENT_TOTAL_BYTES;

  const handlePickFiles = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) return;

    setReadError(null);
    try {
      const added = await filesToAttachments(files);
      onChange([...attachments, ...added]);
    } catch (err) {
      setReadError(err instanceof Error ? err.message : t.attachmentReadFailed);
    } finally {
      e.target.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onChange(attachments.filter(a => a.id !== id));
  };

  return (
    <div className="attachment-picker field">
      <label>{t.attachments}</label>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="attachment-input-hidden"
        onChange={handleFileChange}
        disabled={disabled}
        aria-hidden
        tabIndex={-1}
      />
      <button
        type="button"
        className="attachment-add-btn"
        onClick={handlePickFiles}
        disabled={disabled}
      >
        {t.addAttachments}
      </button>
      <p className="field-hint">
        {t.attachmentHint.replace(
          '{max}',
          formatFileSize(MAX_ATTACHMENT_TOTAL_BYTES)
        )}
      </p>

      {attachments.length > 0 && (
        <ul className="attachment-list" aria-label={t.attachments}>
          {attachments.map(a => (
            <li key={a.id} className="attachment-item">
              <span className="attachment-name" title={a.filename}>
                {a.filename}
              </span>
              <span className="attachment-size">{formatFileSize(a.sizeBytes)}</span>
              <button
                type="button"
                className="attachment-remove-btn"
                onClick={() => handleRemove(a.id)}
                disabled={disabled}
                aria-label={`${t.removeAttachment}: ${a.filename}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {attachments.length > 0 && (
        <p className={`attachment-total ${overLimit ? 'over-limit' : ''}`}>
          {t.attachmentTotal}: {formatFileSize(totalBytes)}
          {overLimit && ` — ${t.attachmentOverLimit}`}
        </p>
      )}

      {readError && <p className="attachment-error">{readError}</p>}
    </div>
  );
}
