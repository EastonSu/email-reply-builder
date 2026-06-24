import { normalizeCharsetLabel } from './decodeContent';

function binaryStringToUint8Array(binary: string): Uint8Array {
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i) & 0xff;
  }
  return out;
}

function decodeBytes(bytes: Uint8Array, charset: string): string {
  const label = normalizeCharsetLabel(charset);
  try {
    return new TextDecoder(label, { fatal: false }).decode(bytes);
  } catch {
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  }
}

/**
 * MIME Word 解码
 * 支持 UTF-8 Base64 (B) 和 Quoted-Printable (Q) 编码；B 编码按 charset 用字节解码，避免中文乱码。
 */
export function decodeMimeWord(value: string): string {
  const mimeWordRegex = /=\?([^?]+)\?([BbQq])\?([^?]+)\?=/g;
  return value.replace(mimeWordRegex, (_, charset: string, encoding: string, raw: string) => {
    if (encoding.toUpperCase() === 'B') {
      try {
        const binary = atob(raw);
        const bytes = binaryStringToUint8Array(binary);
        return decodeBytes(bytes, charset);
      } catch {
        return raw;
      }
    }

    // Quoted-Printable 编码
    const normalized = raw.replace(/_/g, ' ').replace(/=([0-9A-F]{2})/gi, '%$1');
    try {
      return decodeURIComponent(normalized);
    } catch {
      return raw;
    }
  });
}
