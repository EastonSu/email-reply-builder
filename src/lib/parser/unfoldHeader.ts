/**
 * Header Unfold - 处理多行折叠的邮件头
 * RFC 5322: 折行以空格或 tab 开头
 */
export function unfoldHeader(rawValue: string): string {
  return rawValue.replace(/\r?\n[ \t]+/g, ' ').trim();
}