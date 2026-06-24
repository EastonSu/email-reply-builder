import type { SendResult } from '../../lib/types';
import type { Translations } from '../../lib/i18n';

interface SendResultPanelProps {
  result: SendResult | null;
  t: Translations;
}

export default function SendResultPanel({ result, t }: SendResultPanelProps) {
  if (!result) {
    return null;
  }

  return (
    <div
      className={`send-result-panel ${result.success ? 'success' : 'error'}`}
      role="alert"
      aria-live="polite"
    >
      <h3>{t.sendResult}</h3>

      {result.success ? (
        <div className="success-content">
          <p className="status">{t.sendSuccess}</p>
          <p className="email-id">
            {t.resendId}: <code>{result.emailId}</code>
          </p>
        </div>
      ) : (
        <div className="error-content">
          <p className="status">{t.sendFailed}</p>
          <p className="error-message">{result.error}</p>
        </div>
      )}
    </div>
  );
}