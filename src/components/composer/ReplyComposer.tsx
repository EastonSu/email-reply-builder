import type { Translations } from '../../lib/i18n';

interface ReplyComposerProps {
  replyBody: string;
  quoteMode: 'html' | 'text';
  onReplyBodyChange: (value: string) => void;
  onQuoteModeChange: (mode: 'html' | 'text') => void;
  quotedContent: string;
  t: Translations;
}

export default function ReplyComposer({
  replyBody,
  quoteMode,
  onReplyBodyChange,
  onQuoteModeChange,
  quotedContent,
  t
}: ReplyComposerProps) {
  return (
    <div className="reply-composer">
      <div className="quote-mode-toggle" role="radiogroup" aria-label="Quote mode selection">
        <span>{t.quoteMode}</span>
        <button
          type="button"
          className={`mode-btn ${quoteMode === 'html' ? 'active' : ''}`}
          onClick={() => onQuoteModeChange('html')}
          role="radio"
          aria-checked={quoteMode === 'html'}
        >
          {t.htmlMode}
        </button>
        <button
          type="button"
          className={`mode-btn ${quoteMode === 'text' ? 'active' : ''}`}
          onClick={() => onQuoteModeChange('text')}
          role="radio"
          aria-checked={quoteMode === 'text'}
        >
          {t.textMode}
        </button>
      </div>

      <textarea
        className="reply-textarea"
        value={replyBody}
        onChange={(e) => onReplyBodyChange(e.target.value)}
        placeholder={t.replyPlaceholder}
        rows={8}
        aria-label="Reply content"
      />

      {quotedContent && (
        <aside className="quoted-preview">
          <h3>{t.quotedPreview}</h3>
          <pre className="quoted-content">{quotedContent}</pre>
        </aside>
      )}
    </div>
  );
}