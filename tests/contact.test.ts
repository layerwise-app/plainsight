import { describe, expect, it, vi } from 'vitest';
import {
  type ContactDeps,
  handleContact,
  LIMITS,
  ownerEmailBody,
  readContactInput,
  validateContact
} from '~/lib/contact';

const good = {
  name: 'Ada Berg',
  email: 'ada@example.com',
  message: 'We need a booking flow for a small ferry company.',
  website: ''
};

function fakeDb(existing = 0) {
  const saved: { name: string; email: string; message: string; senderKey: string }[] = [];
  const emailed: string[] = [];
  let count = existing;
  const deps: ContactDeps = {
    countRecent: async () => count,
    save: async (message) => {
      saved.push(message);
      count += 1;
      return `id-${saved.length}`;
    },
    markEmailed: async (id) => {
      emailed.push(id);
    }
  };
  return { deps, saved, emailed };
}

describe('readContactInput', () => {
  it('trims strings and ignores anything else', () => {
    expect(readContactInput({ name: '  Ada ', email: 5, message: null })).toEqual({
      name: 'Ada',
      email: '',
      message: '',
      website: ''
    });
    expect(readContactInput('nonsense').name).toBe('');
  });

  it('reads FormData', () => {
    const form = new FormData();
    form.set('name', 'Ada');
    form.set('website', 'spam.example');
    expect(readContactInput(form)).toMatchObject({ name: 'Ada', website: 'spam.example' });
  });
});

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(good)).toEqual({});
  });

  it('names each missing or wrong field', () => {
    const errors = validateContact({ name: '', email: 'not-an-email', message: 'hi', website: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name']);
  });

  it('enforces the length limits', () => {
    const errors = validateContact({
      ...good,
      name: 'a'.repeat(LIMITS.name + 1),
      message: 'a'.repeat(LIMITS.message + 1)
    });
    expect(errors.name).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });
});

describe('handleContact', () => {
  it('saves a valid message', async () => {
    const { deps, saved } = fakeDb();
    const result = await handleContact(good, 'sender', deps);
    expect(result).toEqual({ ok: true, name: 'Ada Berg' });
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ email: 'ada@example.com', senderKey: 'sender' });
  });

  it('pretends to succeed for bots but saves nothing', async () => {
    const { deps, saved } = fakeDb();
    const result = await handleContact({ ...good, website: 'https://spam.example' }, 'sender', deps);
    expect(result.ok).toBe(true);
    expect(saved).toHaveLength(0);
  });

  it('returns field errors without saving', async () => {
    const { deps, saved } = fakeDb();
    const result = await handleContact({ ...good, email: 'nope' }, 'sender', deps);
    expect(result).toMatchObject({ ok: false, errors: { email: expect.any(String) } });
    expect(saved).toHaveLength(0);
  });

  it('stops a sender after the limit', async () => {
    const { deps, saved } = fakeDb();
    for (let i = 0; i < LIMITS.perWindow; i++) {
      expect((await handleContact(good, 'sender', deps)).ok).toBe(true);
    }
    const blocked = await handleContact(good, 'sender', deps);
    expect(blocked).toMatchObject({ ok: false, error: expect.stringContaining('wait') });
    expect(saved).toHaveLength(LIMITS.perWindow);
  });

  it('counts only the last window', async () => {
    const countRecent = vi.fn(async () => 0);
    const now = new Date('2026-05-01T12:00:00Z');
    await handleContact(good, 'sender', { ...fakeDb().deps, countRecent, now: () => now });
    expect(countRecent).toHaveBeenCalledWith(
      'sender',
      new Date(now.getTime() - LIMITS.windowMinutes * 60_000)
    );
  });

  it('marks a message emailed when the owner is notified', async () => {
    const { deps, emailed } = fakeDb();
    const notify = vi.fn(async () => true);
    await handleContact(good, 'sender', { ...deps, notify });
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ id: 'id-1', name: 'Ada Berg' }));
    expect(emailed).toEqual(['id-1']);
  });

  it('still succeeds when the email fails', async () => {
    const { deps, saved, emailed } = fakeDb();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const notify = vi.fn(async () => {
      throw new Error('send_failed');
    });
    const result = await handleContact(good, 'sender', { ...deps, notify });
    expect(result.ok).toBe(true);
    expect(saved).toHaveLength(1);
    expect(emailed).toEqual([]);
    warn.mockRestore();
  });
});

describe('ownerEmailBody', () => {
  it('escapes HTML and keeps the subject on one line', () => {
    const body = ownerEmailBody({ name: 'Ada\n<b>', email: 'a@b.co', message: '<script>' }, 'Halden');
    expect(body.subject).not.toMatch(/[\r\n]/);
    expect(body.html).not.toContain('<script>');
    expect(body.html).toContain('&#60;script&#62;');
    expect(body.text).toContain('<script>');
  });
});
