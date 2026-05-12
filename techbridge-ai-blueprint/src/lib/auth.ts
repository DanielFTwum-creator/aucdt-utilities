// IndexedDB-based auth — replaces Firebase Google Sign-In

const DB_NAME = 'tuc-blueprint-auth';
const STORE = 'users';
const SESSION_KEY = 'tuc-blueprint-session';

export interface LocalUser {
  uid: string;       // UUID generated at registration
  name: string;
  email: string;
  passwordHash: string;
  registeredAt: number;
}

export interface SessionUser {
  uid: string;
  name: string;
  email: string;
}

async function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: 'uid' });
      store.createIndex('email', 'email', { unique: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function registerUser(name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const db = await openDb();
  const hash = await hashPassword(password);
  const uid = crypto.randomUUID();
  const user: LocalUser = { uid, name, email: email.toLowerCase(), passwordHash: hash, registeredAt: Date.now() };

  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).add(user);
    req.onsuccess = () => {
      saveSession({ uid, name, email: email.toLowerCase() });
      resolve({ ok: true });
    };
    req.onerror = () => resolve({ ok: false, error: 'Email already registered.' });
  });
}

export async function loginUser(email: string, password: string): Promise<{ ok: boolean; user?: SessionUser; error?: string }> {
  const db = await openDb();
  const hash = await hashPassword(password);

  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).index('email').get(email.toLowerCase());
    req.onsuccess = () => {
      const user: LocalUser | undefined = req.result;
      if (!user) return resolve({ ok: false, error: 'No account found for this email.' });
      if (user.passwordHash !== hash) return resolve({ ok: false, error: 'Incorrect password.' });
      const session: SessionUser = { uid: user.uid, name: user.name, email: user.email };
      saveSession(session);
      resolve({ ok: true, user: session });
    };
    req.onerror = () => resolve({ ok: false, error: 'Login failed. Please try again.' });
  });
}

function saveSession(user: SessionUser) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch { /* private mode */ }
}

export function getSession(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
}

export async function sendHelpdeskNotification(user: SessionUser): Promise<void> {
  const payload = {
    applicantId: user.uid,
    fullName: user.name,
    receiverEmailId: 'helpdesk@techbridge.edu.gh',
    senderEmailId: 'info@techbridge.edu.gh',
    subject: 'New Blueprint User Registration',
    message: `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:20px;">
      <h2 style="color:#1a365d;">New Blueprint Registration</h2>
      <p>A new user has registered on the TechBridge AI Blueprint system.</p>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;font-weight:bold;color:#4a5568;">Name</td><td style="padding:8px;">${user.name}</td></tr>
        <tr style="background:#f7fafc;"><td style="padding:8px;font-weight:bold;color:#4a5568;">Email</td><td style="padding:8px;">${user.email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#4a5568;">User ID</td><td style="padding:8px;font-family:monospace;font-size:12px;">${user.uid}</td></tr>
        <tr style="background:#f7fafc;"><td style="padding:8px;font-weight:bold;color:#4a5568;">Registered</td><td style="padding:8px;">${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })} (Ghana)</td></tr>
      </table>
      <p style="margin-top:20px;color:#718096;font-size:13px;">This is an automated notification from the TUC ICT Platform.</p>
    </body></html>`
  };

  try {
    await fetch('https://portal.aucdt.edu.gh/aucdt-dev/sendMail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-fatal — registration succeeds even if email fails
  }
}
