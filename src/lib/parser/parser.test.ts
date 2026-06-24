import { describe, it, expect } from 'vitest';
import { parseEmail } from './emailParser';
import { decodeMimeWord } from './decodeMimeWord';
import { unfoldHeader } from './unfoldHeader';
import { buildReplyContext } from '../send/buildReplyContext';
import { sampleEmail1, sampleEmail2, sampleEmail3 } from '../../fixtures/sample-emails';

describe('decodeMimeWord', () => {
  it('decodes UTF-8 Base64 encoded subject', () => {
    const input = '=?UTF-8?B?UmU6IOWFs+S6jiBBZHN0ZXJyYSDova/mloflj5HluIPkuI7or4TmtYvlkIjkvZw=?=';
    const result = decodeMimeWord(input);
    expect(result).toContain('Re:');
    expect(result).toContain('Adsterra');
    expect(result).toContain('关于');
  });

  it('returns original if not MIME encoded', () => {
    const input = 'Hello World';
    expect(decodeMimeWord(input)).toBe('Hello World');
  });
});

describe('unfoldHeader', () => {
  it('unfolds multi-line header', () => {
    const input = 'value\r\n  continuation';
    expect(unfoldHeader(input)).toBe('value continuation');
  });
});

describe('parseEmail', () => {
  it('parses multipart email with base64 encoding', () => {
    const result = parseEmail(sampleEmail1);
    expect(result.messageId).toBe('<CAMnzOzuC4KHnO4mTB9OSQtpEerEM0E8b0z34C=7Diw+JF0kTJQ@mail.gmail.com>');
    expect(result.inReplyTo).toBeTruthy();
    expect(result.references.length).toBeGreaterThan(0);
    expect(result.from?.email).toBe('marketing_cn@adsterra.com');
    expect(result.to?.email).toBe('contact@eastondev.com');
    expect(result.textBody).toContain('Eason');
    expect(result.textBody).toContain('感谢您的详细回复');
  });

  it('parses simple plain text email', () => {
    const result = parseEmail(sampleEmail2);
    expect(result.messageId).toBe('<simple123@example.com>');
    expect(result.subject).toBe('Hello World');
    expect(result.textBody).toContain('simple plain text email');
  });

  it('generates warning for missing Message-ID', () => {
    const result = parseEmail(sampleEmail3);
    expect(result.messageId).toBe('');
    expect(result.warnings).toContain('Missing Message-ID: reply threading will not work correctly');
  });
});

describe('buildReplyContext', () => {
  it('builds correct reply subject with Re prefix', () => {
    const parsed = parseEmail(sampleEmail2);
    const context = buildReplyContext(parsed);
    expect(context.replySubject).toBe('Re: Hello World');
  });

  it('does not duplicate Re prefix', () => {
    const parsed = parseEmail(sampleEmail1);
    const context = buildReplyContext(parsed);
    expect(context.replySubject).toMatch(/^Re:/);
    expect(context.replySubject).not.toMatch(/^Re: Re:/);
  });

  it('builds references chain', () => {
    const parsed = parseEmail(sampleEmail1);
    const context = buildReplyContext(parsed);
    expect(context.finalReferences).toContain(parsed.messageId);
    expect(context.finalInReplyTo).toBe(parsed.messageId);
  });

  it('extracts reply target email', () => {
    const parsed = parseEmail(sampleEmail1);
    const context = buildReplyContext(parsed);
    expect(context.replyToEmail).toBe('marketing_cn@adsterra.com');
  });
});