'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface FormConfig {
  title?: string;
  fields?: {
    name?: { label: string; placeholder: string };
    email?: { label: string; placeholder: string };
    message?: { label: string; placeholder: string };
  };
}

interface ContactFormProps {
  formConfig?: FormConfig;
}

// Determine environment and use appropriate keys
const isDevelopment = process.env.NODE_ENV === 'development';
const RECAPTCHA_SITE_KEY = isDevelopment
  ? (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_DEV || '6LfAs14rAAAAAEKeirT_vVKEeor4tmnKLewzslo0')
  : (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_PROD || '6Le9sl4rAAAAAOVg6GP2QBu8vAyohoupagzkJ4Yy');

// Logging utility
const log = (message: string, data?: any) => {
  if (isDevelopment) {
    console.log(`[ContactForm] ${message}`, data || '');
  }
};

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, options: { sitekey: string }) => number;
      getResponse: (widgetId: number) => string;
      reset: (widgetId: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

export default function ContactForm({ formConfig }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (pathname === '/contact') {
      const loadRecaptcha = () => {
        log('Loading reCAPTCHA...');
        
        // Don't load if already loaded
        if (window.grecaptcha || scriptRef.current) {
          log('reCAPTCHA already loaded');
          return;
        }

        // Set up the callback for when reCAPTCHA is ready
        window.onRecaptchaLoad = () => {
          log('reCAPTCHA loaded, attempting to render');
          
          // Only render if we haven't already rendered and the container exists
          if (recaptchaContainerRef.current && window.grecaptcha && widgetIdRef.current === null) {
            try {
              widgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
                sitekey: RECAPTCHA_SITE_KEY
              });
              log('reCAPTCHA rendered successfully', { widgetId: widgetIdRef.current });
            } catch (error) {
              console.error('Error rendering reCAPTCHA:', error);
              log('Error rendering reCAPTCHA', error);
            }
          }
        };

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        scriptRef.current = script;
        log('reCAPTCHA script added to document');
      };

      loadRecaptcha();
      return cleanupRecaptcha;
    }
  }, [pathname]);

  const cleanupRecaptcha = () => {
    log('Cleaning up reCAPTCHA');
    
    // Remove reCAPTCHA badge and iframes
    const recaptchaElements = document.querySelectorAll('.grecaptcha-badge, iframe[src*="recaptcha"]');
    recaptchaElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    // Remove reCAPTCHA script
    if (scriptRef.current?.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
    }
    scriptRef.current = null;
    widgetIdRef.current = null;
    window.grecaptcha = undefined;
    window.onRecaptchaLoad = undefined;
    log('reCAPTCHA cleanup complete');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    log(`Form field updated: ${name}`, { length: value.length });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    log('Form submission started');

    if (!window.grecaptcha || widgetIdRef.current === null) {
      const error = 'reCAPTCHA not loaded. Please try again.';
      log('reCAPTCHA not loaded');
      setError(error);
      return;
    }

    const token = window.grecaptcha.getResponse(widgetIdRef.current);
    if (!token) {
      const error = 'Please complete the reCAPTCHA verification.';
      log('reCAPTCHA not completed');
      setError(error);
      return;
    }

    setLoading(true);
    log('Form submission in progress');

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('message', formData.message);
      form.append('g-recaptcha-response', token);

      const response = await fetch('/contact-form-handler.php', {
        method: 'POST',
        body: form,
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        log('Server response received', { 
          status: response.status,
          success: data.success,
          environment: data.environment
        });
      } else {
        const text = await response.text();
        log('Unexpected response format', { text });
        throw new Error('Server returned an invalid response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      window.grecaptcha.reset(widgetIdRef.current);
      log('Form submitted successfully');
    } catch (err) {
      console.error('Form submission error:', err);
      log('Form submission failed', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      if (window.grecaptcha && widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#1f7285] rounded-lg md:border-l" style={{borderLeft: '1px solid rgb(41, 149, 174)', borderLeftWidth: '0px'}}>
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">
        {formConfig?.title || 'Send Us a Message'}
      </h2>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Thank you for your message! We'll get back to you soon.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {!success && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-white mb-1">
                {formConfig?.fields?.name?.label || 'Name'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#333333] placeholder-gray-400 ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder={formConfig?.fields?.name?.placeholder || 'Your name'}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-1">
                {formConfig?.fields?.email?.label || 'Email'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#333333] placeholder-gray-400 ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder={formConfig?.fields?.email?.placeholder || 'your.email@example.com'}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-white mb-1">
                {formConfig?.fields?.message?.label || 'Message'}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
                rows={4}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#333333] placeholder-gray-400 ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder={formConfig?.fields?.message?.placeholder || 'Your message'}
              />
            </div>
            <div ref={recaptchaContainerRef} className="mb-4"></div>
          </>
        )}
        <button
          type="submit"
          disabled={loading || success}
          className={`inline-flex items-center justify-center bg-[#ffe03b] text-black font-bold rounded-full transition-colors shadow-sm mx-auto ${
            loading || success
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:bg-yellow-300'
          }`}
          style={{boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '6px 18px'}}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : success ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Message Sent
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
} 