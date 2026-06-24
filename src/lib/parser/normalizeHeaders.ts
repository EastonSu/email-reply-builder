import { unfoldHeader } from './unfoldHeader';

/**
 * 获取指定邮件头
 * 支持多行折叠的头字段
 */
export function getHeader(rawEmail: string, headerName: string): string {
  // 处理大小写不敏感匹配
  const escaped = headerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reg = new RegExp(`^${escaped}:([\\s\\S]*?)(?:\\r?\\n[^ \\t]|$)`, 'mi');
  const match = rawEmail.match(reg);

  if (!match) return '';
  return unfoldHeader(match[1]);
}

/**
 * 解析邮件地址
 * 格式: "Name <email@example.com>" 或 "email@example.com"
 */
export function parseEmailAddress(raw: string): { name?: string; email: string; raw: string } | null {
  const trimmed = raw.trim();

  // 匹配 Name <email> 格式
  const nameEmailMatch = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  if (nameEmailMatch) {
    return {
      name: nameEmailMatch[1].trim(),
      email: nameEmailMatch[2].trim(),
      raw: trimmed
    };
  }

  // 匹配纯邮箱地址
  const emailMatch = trimmed.match(/([^\s<>]+@[^\s<>]+)/);
  if (emailMatch) {
    return {
      email: emailMatch[1].trim(),
      raw: trimmed
    };
  }

  return null;
}