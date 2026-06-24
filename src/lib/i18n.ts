export const en = {
  // Hero
  title: 'Email Reply Builder',
  heroDesc: 'Reply from your own custom domain and keep the full conversation history intact.',
  heroNote: 'Paste the original email, write your reply, and send it through Resend with the right thread headers.',

  // Input
  rawEmailTitle: 'Raw Email',
  rawEmailPlaceholder: 'Paste the raw email source here...',
  inputHint: 'Copy from Gmail "Show original" or Outlook "View Source"',
  parse: 'Parse',
  clear: 'Clear',

  // Preview
  parsedMetaTitle: 'Parsed Metadata',
  parsedMetaEmpty: 'Paste raw email to see parsed metadata',
  parsing: 'Analyzing email structure...',
  parsed: 'Parsed',
  hasWarnings: 'Has warnings',

  // Meta fields
  messageId: 'Message-ID',
  inReplyTo: 'In-Reply-To',
  references: 'References',
  subject: 'Subject',
  date: 'Date',
  missing: '(missing)',
  none: '(none)',

  // Mapping
  fromToReplyTo: 'From → Reply-To',
  toToSender: 'To → Sender',
  replyToHint: 'Reply will be sent to original sender',
  senderHint: 'You will send from this address',

  // Warnings
  warningsTitle: 'Warnings',

  // Composer
  replyTitle: 'Your Reply',
  replyPlaceholder: 'Write your reply here...',
  quoteMode: 'Quote Mode:',
  htmlMode: 'HTML (Gmail style)',
  textMode: 'Text (Traditional)',
  quotedPreview: 'Original Email Preview',

  // Send Config
  sendConfigTitle: 'Send Configuration',
  replySubject: 'Reply Subject',
  subjectPlaceholder: 'Re: Original Subject',
  subjectPlaceholderHint: 'Enter reply subject',
  subjectSourceHint: 'Auto-filled with Re: prefix from original Subject',
  replyToTarget: 'Reply To (Target)',
  replyToPlaceholder: 'recipient@example.com',
  replyToPlaceholderHint: 'Enter the email address to reply to',
  replyToSourceHint: 'Auto-filled from original From',
  replyToTargetHint: 'Your reply will be sent to this address',
  resendApiKey: 'Resend API Key',
  apiKeyPlaceholder: 're_xxxxxxxx',
  apiKeyHint: 'Never stored. Lost on page refresh.',
  senderEmail: 'Sender Email (Your address)',
  senderEmailHint: 'Auto-filled from original To',
  senderEmailPlaceholder: 'you@yourdomain.com',
  senderName: 'Sender Name',
  senderNamePlaceholder: 'Your Name',
  attachments: 'Attachments',
  addAttachments: 'Choose files…',
  attachmentHint: 'Optional. Total attachments up to {max} (Resend limit ~10MB per email).',
  attachmentTotal: 'Total size',
  attachmentOverLimit: 'exceeds limit',
  removeAttachment: 'Remove',
  attachmentReadFailed: 'Failed to read file',

  // Buttons
  sendReply: 'Send Reply',
  sending: 'Sending...',

  // Result
  sendResult: 'Send Result',
  sendSuccess: 'Email sent successfully',
  sendFailed: 'Send failed',
  resendId: 'Resend ID',

  // How to Use
  howToUseTitle: 'How to Use',
  step1: '1. Get Raw Email',
  step1Desc: 'Open the email in Gmail, click "Show original" (three dots menu), copy all content',
  step2: '2. Paste & Parse',
  step2Desc: 'Paste into the input box. The tool will automatically extract Message-ID, threading headers, and sender info',
  step3: '3. Write Reply',
  step3Desc: 'Type your reply content. Original email will be quoted below automatically',
  step4: '4. Configure & Send',
  step4Desc: 'Enter your Resend API Key. Sender email is auto-filled from original To field. Click send',

  // Errors
  missingMessageId: 'Missing Message-ID: reply threading will not work',
  missingFrom: 'Cannot determine reply target (missing From header)',
  missingApiKey: 'Resend API Key is required',
  missingSenderEmail: 'Sender email address is required',
  missingReplyToEmail: 'Reply target email is required',
  missingReplyBody: 'Reply content is required',
  invalidEmail: 'Invalid email format',
  waitingForParsed: '(waiting for parsed email)',
  mustVerifiedDomain: 'Must be from a verified Resend domain',

  // Use Cases
  useCasesTitle: 'Use Cases & Pain Points',
  painPoint1Title: 'Lost Email Thread',
  painPoint1Desc: 'When using Resend API to reply, emails often appear as separate threads in Gmail. ReplyBuilder automatically adds correct In-Reply-To and References headers to keep your reply in the original conversation thread.',
  painPoint2Title: 'Manual Header Extraction',
  painPoint2Desc: 'Copying Message-ID, finding sender email, building reference chain — all tedious manual work. ReplyBuilder parses raw email in one click and fills all fields automatically.',
  painPoint3Title: 'Custom Domain Reply',
  painPoint3Desc: 'Using Cloudflare Email Routing + Resend? You receive emails at your domain but reply through Resend. ReplyBuilder makes this workflow seamless: paste received email, write reply, send.',
  painPoint4Title: 'Quick Business Reply',
  painPoint4Desc: 'Received an inquiry on your SaaS contact email? Paste the raw email, write a quick response, and send directly. No need to log into Gmail or configure complex email clients.',
};

export const zh = {
  // Hero
  title: 'Email Reply Builder',
  heroDesc: '粘贴原始邮件，撰写回复，通过 Resend 直接发送',
  heroNote: '无后端转发，不存储内容，API Key 仅存于当前浏览器会话',

  // Input
  rawEmailTitle: '原始邮件',
  rawEmailPlaceholder: '在此粘贴原始邮件内容...',
  inputHint: '从 Gmail「显示原始邮件」或 Outlook「查看源文件」复制',
  parse: '解析',
  clear: '清空',

  // Preview
  parsedMetaTitle: '解析结果',
  parsedMetaEmpty: '粘贴原始邮件后显示解析结果',
  parsing: '正在解析邮件结构...',
  parsed: '已解析',
  hasWarnings: '有警告',

  // Meta fields
  messageId: 'Message-ID',
  inReplyTo: 'In-Reply-To',
  references: 'References',
  subject: '主题',
  date: '日期',
  missing: '(缺失)',
  none: '(无)',

  // Mapping
  fromToReplyTo: 'From → 回复目标',
  toToSender: 'To → 发件人',
  replyToHint: '回复将发送给原邮件发送者',
  senderHint: '你将使用此地址发送回复',

  // Warnings
  warningsTitle: '警告',

  // Composer
  replyTitle: '你的回复',
  replyPlaceholder: '在此撰写回复内容...',
  quoteMode: '引用模式：',
  htmlMode: 'HTML（Gmail 风格）',
  textMode: '纯文本（传统风格）',
  quotedPreview: '原邮件预览',

  // Send Config
  sendConfigTitle: '发送配置',
  replySubject: '回复主题',
  subjectPlaceholder: 'Re: 原邮件主题',
  subjectPlaceholderHint: '输入回复邮件主题',
  subjectSourceHint: '自动填充：Re: + 原邮件主题',
  replyToTarget: '回复目标邮箱',
  replyToPlaceholder: 'recipient@example.com',
  replyToPlaceholderHint: '输入回复目标邮箱地址',
  replyToSourceHint: '自动填充：原邮件 From',
  replyToTargetHint: '回复将发送到此地址',
  resendApiKey: 'Resend API Key',
  apiKeyPlaceholder: 're_xxxxxxxx',
  apiKeyHint: '不保存，刷新页面后清空',
  senderEmail: '发件邮箱（你的地址）',
  senderEmailHint: '自动填充：原邮件 To',
  senderEmailPlaceholder: 'you@yourdomain.com',
  senderName: '发件人姓名',
  senderNamePlaceholder: '你的名字',
  attachments: '附件',
  addAttachments: '选择本地文件…',
  attachmentHint: '可选。附件合计不超过 {max}（Resend 单封邮件约 10MB）。',
  attachmentTotal: '合计大小',
  attachmentOverLimit: '超出限制',
  removeAttachment: '移除',
  attachmentReadFailed: '读取文件失败',

  // Buttons
  sendReply: '发送回复',
  sending: '发送中...',

  // Result
  sendResult: '发送结果',
  sendSuccess: '邮件发送成功',
  sendFailed: '发送失败',
  resendId: 'Resend ID',

  // How to Use
  howToUseTitle: '使用说明',
  step1: '1. 获取原始邮件',
  step1Desc: '在 Gmail 中打开邮件，点击「显示原始邮件」（三点菜单），复制全部内容',
  step2: '2. 粘贴解析',
  step2Desc: '粘贴到输入框，自动提取 Message-ID、线程头、发件人信息',
  step3: '3. 撰写回复',
  step3Desc: '输入回复内容，原邮件会自动引用在下方',
  step4: '4. 配置发送',
  step4Desc: '输入 Resend API Key，发件邮箱自动填充，点击发送',

  // Errors
  missingMessageId: '缺少 Message-ID：回复无法进入原线程',
  missingFrom: '无法确定回复目标（缺少 From 头）',
  missingApiKey: '需要 Resend API Key',
  missingSenderEmail: '需要发件邮箱地址',
  missingReplyToEmail: '需要回复目标邮箱地址',
  missingReplyBody: '需要回复内容',
  invalidEmail: '邮箱格式无效',
  waitingForParsed: '(等待解析邮件)',
  mustVerifiedDomain: '必须是 Resend 已验证域名的邮箱',

  // Use Cases
  useCasesTitle: '使用场景与痛点',
  painPoint1Title: '邮件线程丢失',
  painPoint1Desc: '使用 Resend API 发送回复时，邮件在 Gmail 中常显示为独立新邮件。ReplyBuilder 自动添加正确的 In-Reply-To 和 References 头，让回复进入原对话线程。',
  painPoint2Title: '手动提取头信息',
  painPoint2Desc: '复制 Message-ID、查找发件人邮箱、构建 References 链 — 这些繁琐操作一键完成。粘贴原始邮件，自动解析填充所有字段。',
  painPoint3Title: '自定义域名回复',
  painPoint3Desc: '使用 Cloudflare Email Routing + Resend？收到域名邮件后需要通过 Resend 回复。ReplyBuilder 让这个流程无缝衔接：粘贴收到的邮件，写回复，发送。',
  painPoint4Title: '快速商务回复',
  painPoint4Desc: 'SaaS 联系邮箱收到询盘？粘贴原始邮件，快速撰写回复，直接发送。无需登录 Gmail 或配置复杂的邮件客户端。',
};

export type Lang = 'en' | 'zh';
export type Translations = typeof en;
