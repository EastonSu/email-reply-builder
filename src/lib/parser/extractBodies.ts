import { decodeByTransferEncoding } from './decodeContent';

/**
 * 从某一 MIME 部分的起始处截取完整头部块与正文（直到下一个 boundary）。
 */
function extractMimePart(
  rawEmail: string,
  contentTypeToken: 'text/plain' | 'text/html'
): { headers: string; rawBody: string } | null {
  const escaped = contentTypeToken.replace('/', '\\/');
  const startRe = new RegExp(`(?:^|\\r?\\n)Content-Type:\\s*${escaped}`, 'im');
  const startMatch = rawEmail.match(startRe);
  if (!startMatch || startMatch.index === undefined) return null;

  const hdrStart = startMatch.index;
  const fromHeaders = rawEmail.slice(hdrStart);
  const headerEndMatch = fromHeaders.match(/\r?\n\r?\n/);
  if (!headerEndMatch || headerEndMatch.index === undefined) return null;

  const headers = fromHeaders.slice(0, headerEndMatch.index);
  const bodyStartGlobal = hdrStart + headerEndMatch.index + headerEndMatch[0].length;

  const rest = rawEmail.slice(bodyStartGlobal);
  const boundaryRel = rest.search(/\r?\n--[^\r\n]+/);
  const rawBody = (boundaryRel === -1 ? rest : rest.slice(0, boundaryRel)).trim();

  return { headers, rawBody };
}

function parsePartCharsetAndCte(headers: string): { charset: string; cte: string } {
  const charsetMatch = headers.match(/charset\s*=\s*["']?([^"';\s\r\n]+)["']?/i);
  const cteMatch = headers.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i);
  return {
    charset: charsetMatch?.[1]?.trim() || 'utf-8',
    cte: cteMatch?.[1]?.trim() || '8bit'
  };
}

/**
 * 提取邮件正文
 * 优先提取 text/plain，然后 text/html
 */
export function extractBodies(rawEmail: string): { textBody?: string; htmlBody?: string } {
  const result: { textBody?: string; htmlBody?: string } = {};

  const plainPart = extractMimePart(rawEmail, 'text/plain');
  if (plainPart) {
    const { charset, cte } = parsePartCharsetAndCte(plainPart.headers);
    const decoded = decodeByTransferEncoding(plainPart.rawBody, cte, charset).trim();
    if (decoded) result.textBody = decoded;
  }

  const htmlPart = extractMimePart(rawEmail, 'text/html');
  if (htmlPart) {
    const { charset, cte } = parsePartCharsetAndCte(htmlPart.headers);
    const decoded = decodeByTransferEncoding(htmlPart.rawBody, cte, charset).trim();
    if (decoded) result.htmlBody = decoded;
  }

  // 非 multipart 邮件：读取 header block 之后的内容
  if (!result.textBody && !result.htmlBody) {
    const splitIndex = rawEmail.search(/\r?\n\r?\n/);
    if (splitIndex !== -1) {
      const rawBody = rawEmail.slice(splitIndex).replace(/^\r?\n\r?\n/, '').trim();
      result.textBody = rawBody;
    }
  }

  return result;
}
