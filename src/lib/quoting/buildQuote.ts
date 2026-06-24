/**
 * HTML 转义
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * 构建 HTML 引用块 (Gmail 风格)
 */
export function buildHtmlQuote(
  fromRaw: string,
  date: string,
  bodyText: string
): string {
  const quotedBody = escapeHtml(bodyText || '(原邮件内容解析失败，请手动粘贴)')
    .replace(/\r?\n/g, '<br>');

  return `
<div class="gmail_quote">
  <div dir="ltr" class="gmail_attr">${escapeHtml(date)}, ${escapeHtml(fromRaw)}:</div>
  <blockquote class="gmail_quote" style="margin:0 0 0 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">
    ${quotedBody}
  </blockquote>
</div>`.trim();
}

/**
 * 构建 Text 引用块 (传统邮件风格)
 */
export function buildTextQuote(
  fromRaw: string,
  date: string,
  bodyText: string
): string {
  const header = `On ${date}, ${fromRaw} wrote:`;
  const quotedBody = (bodyText || '(原邮件内容解析失败)')
    .split(/\r?\n/)
    .map(line => `> ${line}`)
    .join('\n');

  return `${header}\n${quotedBody}`;
}