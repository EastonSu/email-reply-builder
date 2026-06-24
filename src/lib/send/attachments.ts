/**
 * 邮件附件：浏览器内读取本地文件，供 Resend API 使用（content 为 Base64）
 */
export interface EmailAttachment {
  id: string;
  filename: string;
  contentBase64: string;
  sizeBytes: number;
  mimeType?: string;
}

/** 所有附件合计上限（Resend 单封邮件约 10MB，预留正文空间） */
export const MAX_ATTACHMENT_TOTAL_BYTES = 9 * 1024 * 1024;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function totalAttachmentBytes(attachments: EmailAttachment[]): number {
  return attachments.reduce((sum, a) => sum + a.sizeBytes, 0);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Failed to read file'));
        return;
      }
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * 将用户选择的本地文件转为附件对象
 */
export async function filesToAttachments(files: FileList | File[]): Promise<EmailAttachment[]> {
  const list = Array.from(files);
  const results: EmailAttachment[] = [];

  for (const file of list) {
    const contentBase64 = await fileToBase64(file);
    results.push({
      id: crypto.randomUUID(),
      filename: file.name,
      contentBase64,
      sizeBytes: file.size,
      mimeType: file.type || undefined
    });
  }

  return results;
}

/**
 * Resend API 附件字段
 */
export function toResendAttachments(
  attachments: EmailAttachment[]
): Array<{ filename: string; content: string }> {
  return attachments.map(a => ({
    filename: a.filename,
    content: a.contentBase64
  }));
}
