/**
 * Normalize MIME charset label for TextDecoder (IANA / WHATWG).
 */
export function normalizeCharsetLabel(charset: string): string {
  const c = charset.trim().replace(/^["']|["']$/g, '').toLowerCase();
  if (!c) return 'utf-8';
  if (c === 'utf8') return 'utf-8';
  return c;
}

function decodeWithTextDecoder(bytes: Uint8Array, charset: string): string {
  const label = normalizeCharsetLabel(charset);
  try {
    return new TextDecoder(label, { fatal: false }).decode(bytes);
  } catch {
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  }
}

function binaryStringToUint8Array(binary: string): Uint8Array {
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i) & 0xff;
  }
  return out;
}

/**
 * Quoted-Printable → raw bytes (before charset decoding).
 */
export function quotedPrintableToBytes(input: string): Uint8Array {
  const normalized = input.replace(/=\r?\n/g, '');
  const bytes: number[] = [];
  let i = 0;
  while (i < normalized.length) {
    if (normalized[i] === '=' && i + 2 < normalized.length) {
      const hex = normalized.slice(i + 1, i + 3);
      if (/^[0-9A-F]{2}$/i.test(hex)) {
        bytes.push(parseInt(hex, 16));
        i += 3;
        continue;
      }
    }
    bytes.push(normalized.charCodeAt(i) & 0xff);
    i++;
  }
  return new Uint8Array(bytes);
}

/**
 * Quoted-Printable 解码（按 charset 解释字节序列，默认 UTF-8）
 */
export function decodeQuotedPrintable(input: string, charset = 'utf-8'): string {
  const bytes = quotedPrintableToBytes(input);
  return decodeWithTextDecoder(bytes, charset);
}

/**
 * Base64 解码（按 charset 解释字节序列，默认 UTF-8）
 * 邮件正文常用 UTF-8；不可再用 atob 结果直接当 Unicode 字符串（会乱码）。
 */
export function decodeBase64(input: string, charset = 'utf-8'): string {
  try {
    const cleaned = input.replace(/\s+/g, '');
    const binary = atob(cleaned);
    const bytes = binaryStringToUint8Array(binary);
    return decodeWithTextDecoder(bytes, charset);
  } catch {
    return '';
  }
}

/**
 * 根据 Content-Transfer-Encoding 解码；charset 来自 Content-Type，缺省 utf-8。
 */
export function decodeByTransferEncoding(
  rawBody: string,
  contentTransferEncoding: string,
  charset = 'utf-8'
): string {
  const normalizedEncoding = (contentTransferEncoding || '').toLowerCase();

  if (normalizedEncoding.includes('base64')) {
    return decodeBase64(rawBody, charset);
  }

  if (normalizedEncoding.includes('quoted-printable')) {
    return decodeQuotedPrintable(rawBody, charset);
  }

  // 7bit / 8bit / binary / 未标注：粘贴进编辑器的正文通常已是正确 Unicode，直接返回
  return rawBody;
}
