import { useState, useCallback } from 'react';
import type { AppState, ResendConfig } from '../../lib/types';
import { parseEmail, sendViaResendBrowser, validateSendRequest, ensureRePrefix } from '../../lib';
import { en, zh, type Lang } from '../../lib/i18n';
import RawEmailInput from '../input/RawEmailInput';
import ParsedMetaPanel from '../preview/ParsedMetaPanel';
import ReplyComposer from '../composer/ReplyComposer';
import ResendConfigForm from '../send/ResendConfigForm';
import SendResultPanel from '../send/SendResultPanel';

/** 从环境变量读取预置的 Resend API Key（仅 PUBLIC_ 变量会暴露给客户端） */
function readEnvResendApiKey(): string {
  const v = import.meta.env.PUBLIC_RESEND_API_KEY;
  return typeof v === 'string' ? v.trim() : '';
}

function createInitialState(): AppState {
  return {
    rawEmail: '',
    parsedEmail: null,
    replyBody: '',
    quoteMode: 'html',
    resendConfig: {
      apiKey: readEnvResendApiKey(),
      fromName: '',
      fromEmail: '',
      replyToEmail: '',
      subject: ''
    },
    attachments: [],
    sendResult: null,
    isParsing: false,
    isSending: false,
    parseError: null
  };
}

export default function ReplyBuilderApp() {
  const [state, setState] = useState<AppState>(() => createInitialState());
  const [lang, setLang] = useState<Lang>('en');

  const t = lang === 'en' ? en : zh;

  // 解析邮件
  const parseRawEmail = useCallback((rawEmail: string) => {
    if (!rawEmail.trim()) {
      setState(prev => ({
        ...prev,
        parsedEmail: null,
        parseError: null
      }));
      return;
    }

    setState(prev => ({ ...prev, isParsing: true, parseError: null }));

    try {
      const parsed = parseEmail(rawEmail);

      // 自动填充发送配置：
      // 原邮件 To → Sender (fromEmail, fromName)
      // 原邮件 From → Reply Target (replyToEmail)
      // 原邮件 Subject → Re: Subject（使用 ensureRePrefix 避免双重前缀）
      const replySubject = ensureRePrefix(parsed.subject || '');

      setState(prev => ({
        ...prev,
        parsedEmail: parsed,
        isParsing: false,
        resendConfig: {
          apiKey: prev.resendConfig.apiKey, // 保持用户已输入的 apiKey
          fromEmail: prev.resendConfig.fromEmail || parsed.to?.email || '',
          fromName: prev.resendConfig.fromName || parsed.to?.name || '',
          replyToEmail: prev.resendConfig.replyToEmail || parsed.from?.email || '',
          subject: prev.resendConfig.subject || replySubject
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        parsedEmail: null,
        isParsing: false,
        parseError: error instanceof Error ? error.message : 'Parse failed'
      }));
    }
  }, []);

  const handleRawEmailChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, rawEmail: value }));
  }, []);

  const handleParseClick = useCallback(() => {
    parseRawEmail(state.rawEmail);
  }, [state.rawEmail, parseRawEmail]);

  const handleReplyBodyChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, replyBody: value }));
  }, []);

  const handleQuoteModeChange = useCallback((mode: 'html' | 'text') => {
    setState(prev => ({ ...prev, quoteMode: mode }));
  }, []);

  const handleResendConfigChange = useCallback((config: ResendConfig) => {
    setState(prev => ({ ...prev, resendConfig: config }));
  }, []);

  const handleAttachmentsChange = useCallback((attachments: AppState['attachments']) => {
    setState(prev => ({ ...prev, attachments }));
  }, []);

  const handleSend = useCallback(async () => {
    if (!state.parsedEmail) {
      setState(prev => ({
        ...prev,
        sendResult: {
          success: false,
          provider: 'resend',
          error: 'No parsed email data'
        }
      }));
      return;
    }

    // 确保使用正确的值（fallback 到 parsedEmail 的值）
    const finalConfig: ResendConfig = {
      apiKey: state.resendConfig.apiKey,
      fromEmail: state.resendConfig.fromEmail || state.parsedEmail.to?.email || '',
      fromName: state.resendConfig.fromName || state.parsedEmail.to?.name || '',
      replyToEmail: state.resendConfig.replyToEmail || state.parsedEmail.from?.email || '',
      subject: state.resendConfig.subject || (state.parsedEmail.subject ? `Re: ${state.parsedEmail.subject}` : '')
    };

    const { canSend, errors } = validateSendRequest(
      state.parsedEmail,
      state.replyBody,
      finalConfig,
      state.attachments
    );

    if (!canSend) {
      setState(prev => ({
        ...prev,
        sendResult: {
          success: false,
          provider: 'resend',
          error: errors.map(e => e.message).join('; ')
        }
      }));
      return;
    }

    setState(prev => ({ ...prev, isSending: true, sendResult: null }));

    const result = await sendViaResendBrowser(
      state.parsedEmail,
      state.replyBody,
      state.quoteMode,
      finalConfig,
      state.attachments
    );

    setState(prev => ({
      ...prev,
      isSending: false,
      sendResult: result
    }));
  }, [state.parsedEmail, state.replyBody, state.quoteMode, state.resendConfig, state.attachments]);

  const handleClear = useCallback(() => {
    setState(createInitialState());
  }, []);

  // 语言切换
  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  }, []);

  return (
    <div className="app-container">
      <nav className="site-nav" aria-label="Easton Tools">
        <a className="brand-link" href="https://tools.eastondev.com/" target="_blank" rel="noreferrer">
          <img className="brand-mark" src="/assets/brand/easton-tools-mark.png" alt="" aria-hidden="true" />
          <span>Easton Tools</span>
        </a>
        <div className="nav-links" aria-label="Primary">
          <a href="https://tools.eastondev.com/" target="_blank" rel="noreferrer">Tools</a>
          <a href="https://eastondev.com" target="_blank" rel="noreferrer">Blog</a>
        </div>
        <div className="nav-actions">
          <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
            {lang === 'en' ? 'ZH' : 'EN'}
          </button>
          <a className="nav-cta" href="https://tools.eastondev.com/" target="_blank" rel="noreferrer">
            Explore Tools
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <span className="hero-badge">Email</span>
        <div className="hero-top">
          <h1>{t.title}</h1>
        </div>
        <p className="hero-desc">{t.heroDesc}</p>
        <p className="hero-note">{t.heroNote}</p>
        <a className="hero-cta" href="#input-heading">Build a reply</a>
      </header>

      {/* Main Tool Area */}
      <main className="main-grid">
        {/* Input Section */}
        <section className="input-section" aria-labelledby="input-heading">
          <h2 id="input-heading">{t.rawEmailTitle}</h2>
          <RawEmailInput
            value={state.rawEmail}
            onChange={handleRawEmailChange}
            onParse={handleParseClick}
            onClear={handleClear}
            isLoading={state.isParsing}
            t={t}
          />
        </section>

        {/* Preview Section */}
        <section className="preview-section" aria-labelledby="preview-heading">
          <h2 id="preview-heading">{t.parsedMetaTitle}</h2>
          <ParsedMetaPanel
            parsedEmail={state.parsedEmail}
            isLoading={state.isParsing}
            error={state.parseError}
            t={t}
          />
        </section>

        {/* Composer Section */}
        <section className="composer-section" aria-labelledby="composer-heading">
          <h2 id="composer-heading">{t.replyTitle}</h2>
          <ReplyComposer
            replyBody={state.replyBody}
            quoteMode={state.quoteMode}
            onReplyBodyChange={handleReplyBodyChange}
            onQuoteModeChange={handleQuoteModeChange}
            quotedContent={state.parsedEmail?.textBody || ''}
            t={t}
          />
        </section>

        {/* Send Settings Section */}
        <section className="send-section" aria-labelledby="send-heading">
          <h2 id="send-heading">{t.sendConfigTitle}</h2>
          <ResendConfigForm
            config={state.resendConfig}
            parsedEmail={state.parsedEmail}
            attachments={state.attachments}
            onAttachmentsChange={handleAttachmentsChange}
            onChange={handleResendConfigChange}
            onSend={handleSend}
            isSending={state.isSending}
            disabled={Boolean(!state.parsedEmail || !state.replyBody.trim())}
            t={t}
          />
          <SendResultPanel result={state.sendResult} t={t} />
        </section>
      </main>

      {/* How to Use */}
      <section className="how-to-use" aria-labelledby="howto-heading">
        <h2 id="howto-heading">{t.howToUseTitle}</h2>
        <div className="steps-grid">
          <article className="step">
            <h3>{t.step1}</h3>
            <p>{t.step1Desc}</p>
          </article>
          <article className="step">
            <h3>{t.step2}</h3>
            <p>{t.step2Desc}</p>
          </article>
          <article className="step">
            <h3>{t.step3}</h3>
            <p>{t.step3Desc}</p>
          </article>
          <article className="step">
            <h3>{t.step4}</h3>
            <p>{t.step4Desc}</p>
          </article>
        </div>
      </section>

      {/* Use Cases & Pain Points */}
      <section className="use-cases" aria-labelledby="cases-heading">
        <h2 id="cases-heading">{t.useCasesTitle}</h2>
        <div className="cases-grid">
          <article className="case-item">
            <h3>{t.painPoint1Title}</h3>
            <p>{t.painPoint1Desc}</p>
          </article>
          <article className="case-item">
            <h3>{t.painPoint2Title}</h3>
            <p>{t.painPoint2Desc}</p>
          </article>
          <article className="case-item">
            <h3>{t.painPoint3Title}</h3>
            <p>{t.painPoint3Desc}</p>
          </article>
          <article className="case-item">
            <h3>{t.painPoint4Title}</h3>
            <p>{t.painPoint4Desc}</p>
          </article>
        </div>
      </section>
    </div>
  );
}
