import { GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessagePart {
  partId: string;
  mimeType: string;
  filename: string;
  headers: GmailMessageHeader[];
  body: {
    size: number;
    data?: string;
  };
  parts?: GmailMessagePart[];
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId?: string;
  internalDate?: string;
  payload?: {
    partId: string;
    mimeType: string;
    filename: string;
    headers: GmailMessageHeader[];
    body: {
      size: number;
      data?: string;
    };
    parts?: GmailMessagePart[];
  };
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  bodyText?: string;
  isRead?: boolean;
}

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

const GMAIL_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels'
];

let cachedAccessToken: string | null = null;

export const getGmailAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setGmailAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const googleGmailSignIn = async (): Promise<{ user: FirebaseUser; accessToken: string }> => {
  try {
    const provider = new GoogleAuthProvider();
    GMAIL_SCOPES.forEach((scope) => provider.addScope(scope));
    
    // Prompt account selector
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve OAuth access token from Google sign-in.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Gmail Sign-In Error:', error);
    throw error;
  }
};

/**
 * Decodes base64url encoded string from Gmail API
 */
function decodeBase64Url(str: string): string {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return jsonPayload;
  } catch {
    try {
      return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    } catch {
      return str;
    }
  }
}

/**
 * Extracts header value from Gmail message headers
 */
function getHeader(headers: GmailMessageHeader[] | undefined, name: string): string {
  if (!headers) return '';
  const match = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return match ? match.value : '';
}

/**
 * Extracts plain text or HTML body from message parts
 */
function extractBody(payload: GmailMessage['payload']): string {
  if (!payload) return '';
  
  if (payload.body && payload.body.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts && payload.parts.length > 0) {
    // Try to find text/html or text/plain
    const htmlPart = payload.parts.find((p) => p.mimeType === 'text/html');
    if (htmlPart && htmlPart.body && htmlPart.body.data) {
      return decodeBase64Url(htmlPart.body.data);
    }

    const textPart = payload.parts.find((p) => p.mimeType === 'text/plain');
    if (textPart && textPart.body && textPart.body.data) {
      return decodeBase64Url(textPart.body.data);
    }

    // Check nested parts
    for (const part of payload.parts) {
      if (part.parts) {
        const nestedBody = extractBody({ ...payload, parts: part.parts });
        if (nestedBody) return nestedBody;
      }
    }
  }

  return '';
}

/**
 * Fetches current user profile details
 */
export async function getGmailProfile(accessToken: string): Promise<GmailProfile> {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Failed to fetch Gmail profile: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Fetches list of Gmail messages for a query
 */
export async function listGmailMessages(
  accessToken: string,
  query = 'label:INBOX',
  maxResults = 20
): Promise<GmailMessage[]> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gmail API Error (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.messages || data.messages.length === 0) {
    return [];
  }

  // Fetch full detail for each message in parallel (batch limit 15)
  const detailPromises = data.messages.slice(0, 15).map(async (item: { id: string }) => {
    try {
      const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!msgRes.ok) return null;
      const msgData: GmailMessage = await msgRes.json();
      
      const headers = msgData.payload?.headers || [];
      msgData.subject = getHeader(headers, 'Subject') || '(No Subject)';
      msgData.from = getHeader(headers, 'From') || 'Unknown Sender';
      msgData.to = getHeader(headers, 'To');
      msgData.date = getHeader(headers, 'Date');
      msgData.bodyText = extractBody(msgData.payload);
      msgData.isRead = !msgData.labelIds?.includes('UNREAD');
      
      return msgData;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(detailPromises);
  return results.filter((m): m is GmailMessage => m !== null);
}

/**
 * Sends an email using Gmail API
 */
export async function sendGmailMessage(
  accessToken: string,
  params: {
    to: string;
    subject: string;
    body: string;
    inReplyTo?: string;
    threadId?: string;
  }
): Promise<any> {
  const { to, subject, body, inReplyTo, threadId } = params;

  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`
  ];

  if (inReplyTo) {
    emailLines.push(`In-Reply-To: ${inReplyTo}`);
    emailLines.push(`References: ${inReplyTo}`);
  }

  emailLines.push('');
  emailLines.push(body);

  const rawString = emailLines.join('\r\n');
  const encodedRaw = btoa(unescape(encodeURIComponent(rawString)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const payload: any = { raw: encodedRaw };
  if (threadId) {
    payload.threadId = threadId;
  }

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to send email: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Trashes a message
 */
export async function trashGmailMessage(accessToken: string, messageId: string): Promise<void> {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to trash email: ${res.statusText}`);
  }
}

/**
 * Modifies message labels (e.g. mark as read/unread or star)
 */
export async function modifyGmailMessageLabels(
  accessToken: string,
  messageId: string,
  addLabelIds: string[] = [],
  removeLabelIds: string[] = []
): Promise<void> {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ addLabelIds, removeLabelIds })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to modify email labels: ${res.statusText}`);
  }
}
