import type { ParsedEmail } from '../../lib/types';
import type { Translations } from '../../lib/i18n';

interface ParsedMetaPanelProps {
  parsedEmail: ParsedEmail | null;
  isLoading: boolean;
  error: string | null;
  t: Translations;
}

export default function ParsedMetaPanel({
  parsedEmail,
  isLoading,
  error,
  t
}: ParsedMetaPanelProps) {
  if (isLoading) {
    return (
      <div className="parsed-meta-panel loading" aria-live="polite">
        <p>{t.parsing}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="parsed-meta-panel error" aria-live="polite">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!parsedEmail) {
    return (
      <div className="parsed-meta-panel empty">
        <p>{t.parsedMetaEmpty}</p>
      </div>
    );
  }

  const statusLabel = parsedEmail.warnings.length > 0 ? `⚠️ ${t.hasWarnings}` : `✅ ${t.parsed}`;

  return (
    <div className="parsed-meta-panel">
      <span className="status-label">{statusLabel}</span>

      <dl className="meta-grid">
        <div className="meta-item">
          <dt>{t.messageId}</dt>
          <dd><code>{parsedEmail.messageId || t.missing}</code></dd>
        </div>

        <div className="meta-item">
          <dt>{t.inReplyTo}</dt>
          <dd><code>{parsedEmail.inReplyTo || t.none}</code></dd>
        </div>

        <div className="meta-item">
          <dt>{t.references}</dt>
          <dd><code>{parsedEmail.references.length > 0
            ? parsedEmail.references.slice(0, 2).join(' ') + (parsedEmail.references.length > 2 ? '...' : '')
            : t.none}</code></dd>
        </div>

        <div className="meta-item">
          <dt>{t.subject}</dt>
          <dd>{parsedEmail.subject || t.missing}</dd>
        </div>

        <div className="meta-item mapping-highlight">
          <dt>{t.fromToReplyTo}</dt>
          <dd>
            <span className="mapping-value">
              {parsedEmail.from?.raw || t.missing}
              <span className="mapping-arrow">→</span>
              <span className="mapping-target">{parsedEmail.from?.email || t.missing}</span>
            </span>
            <p className="mapping-hint">{t.replyToHint}</p>
          </dd>
        </div>

        <div className="meta-item mapping-highlight">
          <dt>{t.toToSender}</dt>
          <dd>
            <span className="mapping-value">
              {parsedEmail.to?.raw || t.missing}
              <span className="mapping-arrow">→</span>
              <span className="mapping-target">{parsedEmail.to?.email || t.missing}</span>
            </span>
            <p className="mapping-hint">{t.senderHint}</p>
          </dd>
        </div>

        <div className="meta-item">
          <dt>{t.date}</dt>
          <dd>{parsedEmail.date || t.missing}</dd>
        </div>
      </dl>

      {parsedEmail.warnings.length > 0 && (
        <div className="warnings-section" role="alert">
          <h3>{t.warningsTitle}</h3>
          <ul>
            {parsedEmail.warnings.map((w, i) => (
              <li key={i} className="warning-item">{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}