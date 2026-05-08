'use client';
import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { isValidEmail } from '@/lib/email';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function LeadMagnetModal({ isOpen, onClose }: LeadMagnetModalProps) {
  const t = useTranslations('leadMagnet');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMsg(t('errorInvalidEmail'));
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/legit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDownloadUrl(data.downloadUrl);
      setStatus('success');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        >
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold">{t('title')}</DialogTitle>
            <button onClick={onClose} aria-label="Close" className="ml-4 text-muted-foreground">
              <X className="size-5" />
            </button>
          </div>
          <Description className="mt-2 text-sm text-muted-foreground">
            {t('description')}
          </Description>

          {status === 'success' ? (
            <div className="mt-6 text-center">
              <p className="font-semibold">{t('successTitle')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('successDescription')}</p>
              <a
                href={downloadUrl}
                download
                className="mt-4 inline-block rounded-xl bg-gtc-primary px-6 py-3 font-semibold text-black"
              >
                {t('downloadButton')}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="lead-email" className="sr-only">
                  Email
                </label>
                <input
                  id="lead-email"
                  type="email"
                  aria-label="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder={t('emailPlaceholder')}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gtc-primary"
                  required
                />
                {status === 'error' && (
                  <p role="alert" className="mt-1 text-sm text-destructive">
                    {errorMsg}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? t('submitting') : t('submit')}
              </Button>
            </form>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
