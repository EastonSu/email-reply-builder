// 示例邮件 1: multipart/alternative + base64
export const sampleEmail1 = `Message-ID: <CAMnzOzuC4KHnO4mTB9OSQtpEerEM0E8b0z34C=7Diw+JF0kTJQ@mail.gmail.com>
In-Reply-To: <0100019d5616ad51-d2d0e5a9-cae1-407a-9387-4bb0169c7124-000000@email.amazonses.com>
References: <0100019d5616ad51-d2d0e5a9-cae1-407a-9387-4bb0169c7124-000000@email.amazonses.com>
From: Marketing CN <marketing_cn@adsterra.com>
Date: Tue, 7 Apr 2026 22:40:28 +0800
Subject: =?UTF-8?B?UmU6IOWFs+S6jiBBZHN0ZXJyYSDova/mloflj5HluIPkuI7or4TmtYvlkIjkvZw=?=
To: Easton <contact@eastondev.com>
Content-Type: multipart/alternative; boundary="0000000000007b55c4064edfc4c6"

--0000000000007b55c4064edfc4c6
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: base64

RWFzb27ogIHluIjlpb3vvIwNCg0K5oSf6LCi5oKo55qE6K+m57uG5Zue5aSN77yBDQoNCuWcqOay
n+mAmuWFt+S9k+eahOWQiOS9nOaWueahiOS5i+WJje+8jOaIkeaDs+i3n+aCqOWFiOehruiupOS4
gOS4i+aWueahiDLvvJrmlofnq6AgKyDpop3lpJbmm53lhYnvvIjpppbpobXmiJbkvqfovrnmoI/m
jqjojZDkvY3vvIkg4oCU4oCUDQo0MDDnvo7lhYPmoaPkvY3kuK3nmoTmlofnq6DmmK/otZ7liqno
r4TmtYvmlofnq6DvvIjljp/liJvlhoXlrrnvvIxTRU8g5LyY5YyW77yM5rC45LmF5L+d55WZ77yJ

--0000000000007b55c4064edfc4c6--`;

// 示例邮件 2: 简单纯文本
export const sampleEmail2 = `Message-ID: <simple123@example.com>
From: John Doe <john@example.com>
To: Jane <jane@example.com>
Subject: Hello World
Date: Mon, 1 Jan 2026 10:00:00 +0000

This is a simple plain text email body.
It has multiple lines.
`;

// 示例邮件 3: 无 Message-ID (测试错误处理)
export const sampleEmail3 = `From: test@example.com
To: recipient@example.com
Subject: Test without Message-ID
Date: Mon, 1 Jan 2026 10:00:00 +0000

Body content without Message-ID header.`;