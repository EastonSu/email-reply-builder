import type { Translations } from '../../lib/i18n';

interface RawEmailInputProps {
  value?: string;
  onChange: (value: string) => void;
  onParse: () => void;
  onClear: () => void;
  isLoading?: boolean;
  t: Translations;
}

export default function RawEmailInput({
  value = '',
  onChange,
  onParse,
  onClear,
  isLoading = false,
  t
}: RawEmailInputProps) {
  const parseDisabled = Boolean(!value.trim() || isLoading);

  return (
    <div className="raw-email-input">
      <div className="input-actions">
        <button
          type="button"
          className="btn-parse"
          onClick={onParse}
          disabled={parseDisabled}
        >
          {isLoading ? t.parsing : t.parse}
        </button>
        <button
          type="button"
          className="btn-clear"
          onClick={onClear}
        >
          {t.clear}
        </button>
      </div>

      <textarea
        className="raw-email-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.rawEmailPlaceholder}
        rows={12}
        spellCheck={false}
        aria-label="Raw email content"
      />

      {isLoading && (
        <div className="loading-indicator" aria-live="polite">
          {t.parsing}
        </div>
      )}

      <p className="input-hint">{t.inputHint}</p>
    </div>
  );
}