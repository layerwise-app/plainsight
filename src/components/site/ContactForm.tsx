import { useEffect, useRef, useState } from 'react';
import { type ContactErrors, type ContactField, LIMITS, readContactInput, validateContact } from '~/lib/contact';
import { submitContact } from '~/lib/contact.functions';
import { cn, prefersReducedMotion } from '~/lib/utils';
import { portfolio } from '~/portfolio.config';

type State =
  | { status: 'idle' | 'sending' }
  | { status: 'sent'; name: string }
  | { status: 'error'; message: string };

const fields: { name: ContactField; label: string; type: string; autoComplete: string }[] = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'message', label: 'What are you making?', type: 'textarea', autoComplete: 'off' }
];

export function ContactForm() {
  const [state, setState] = useState<State>({ status: 'idle' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const doneRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // Until the page is interactive, a click would reload it and lose the message.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const found = validateContact(readContactInput(data));
    setErrors(found);
    const first = (Object.keys(found) as ContactField[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setState({ status: 'sending' });
    try {
      const result = await submitContact({ data: Object.fromEntries(data) });
      if (result.ok) {
        setState({ status: 'sent', name: result.name });
        requestAnimationFrame(() => {
          doneRef.current?.focus({ preventScroll: true });
          doneRef.current?.scrollIntoView({
            block: 'center',
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
        });
      } else if ('errors' in result) {
        setErrors(result.errors);
        setState({ status: 'idle' });
      } else {
        setState({ status: 'error', message: result.error });
      }
    } catch {
      setState({
        status: 'error',
        message: `The message didn’t go through. Please try again, or write to ${portfolio.email}.`
      });
    }
  }

  if (state.status === 'sent') {
    return (
      <div ref={doneRef} tabIndex={-1} role='status' className='text-statement outline-none'>
        <p>Thank you, {state.name}.</p>
        <p className='text-muted'>We read every message and reply within two working days.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} method='post' onSubmit={onSubmit} noValidate className='flex flex-col gap-y-8'>
      {fields.map((field) => {
        const error = errors[field.name];
        const id = `contact-${field.name}`;
        const control = cn(
          'mt-2 block w-full rounded-none border-0 border-b bg-transparent px-0 pb-2.5 text-prose outline-none transition-colors placeholder:text-muted/60',
          'focus-visible:border-ink focus-visible:outline-none',
          error ? 'border-[#a3271f]' : 'border-line hover:border-muted'
        );
        return (
          <div key={field.name}>
            <label htmlFor={id} className='text-caption text-muted'>
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={id}
                name={field.name}
                rows={6}
                maxLength={LIMITS.message}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={cn(control, 'min-h-40 resize-y')}
              />
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                maxLength={field.name === 'email' ? LIMITS.email : LIMITS.name}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={control}
              />
            )}
            {error ? (
              <p id={`${id}-error`} className='mt-2 text-caption text-[#a3271f]'>
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      {/* People never see this field; bots fill it in, and those messages are dropped. */}
      <div aria-hidden='true' className='absolute -left-[9999px] h-px w-px overflow-hidden'>
        <label htmlFor='contact-website'>Website</label>
        <input id='contact-website' name='website' type='text' tabIndex={-1} autoComplete='off' />
      </div>

      <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
        <button
          type='submit'
          disabled={!ready || state.status === 'sending'}
          className='bg-ink px-5 py-3 text-ui text-paper transition-opacity hover:opacity-85 disabled:cursor-progress aria-busy:opacity-60'
          aria-busy={state.status === 'sending' || undefined}
        >
          {state.status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p aria-live='polite' className='text-caption text-[#a3271f]'>
          {state.status === 'error' ? state.message : ''}
        </p>
      </div>
    </form>
  );
}
