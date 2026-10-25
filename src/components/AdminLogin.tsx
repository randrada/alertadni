import { useState } from 'react';
import { Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { t } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import type { LangCode } from '@/lib/types';

type Props = {
  lang: LangCode;
  onSuccess: () => void;
  onBack: () => void;
};

export function AdminLogin({ lang, onSuccess, onBack }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      onSuccess();
    } catch {
      setError(t(lang, 'loginError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(lang, 'backToDirectory')}
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8 animate-scale-in">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 shadow-md shadow-primary-600/20 mb-4">
              <Lock className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">{t(lang, 'adminLogin')}</h2>
            <p className="text-sm text-neutral-500 mt-1 text-center">{t(lang, 'loginPrompt')}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm mb-4 animate-slide-down">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t(lang, 'email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(lang, 'emailPlaceholder')}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t(lang, 'passwordPlaceholder')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t(lang, 'passwordPlaceholder')}
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t(lang, 'loading') : t(lang, 'signIn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
