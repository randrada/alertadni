import { useState, useRef, useEffect } from 'react';
import { Shield, Globe, ChevronDown, Lock } from 'lucide-react';
import { LANGUAGES, t } from '@/lib/i18n';
import type { LangCode } from '@/lib/types';

type Props = {
  lang: LangCode;
  onLangChange: (lang: LangCode) => void;
  onAdminClick: () => void;
  isAdmin: boolean;
  onSignOut: () => void;
};

export function Header({ lang, onLangChange, onAdminClick, isAdmin, onSignOut }: Props) {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 shadow-md shadow-primary-600/20">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 leading-tight">
                {t(lang, 'siteTitle')}
              </h1>
              <p className="text-xs text-neutral-500 hidden sm:block leading-tight">
                {t(lang, 'siteSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <Globe className="w-4 h-4 text-neutral-500" />
                <span className="hidden sm:inline">{currentLang?.label}</span>
                <span className="sm:hidden uppercase">{currentLang?.code}</span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg ring-1 ring-neutral-200 overflow-hidden animate-slide-down">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLangChange(l.code);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        l.code === lang
                          ? 'bg-primary-50 text-primary-700 font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="uppercase text-xs font-mono w-6 text-neutral-400">{l.code}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin button */}
            {isAdmin ? (
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <Lock className="w-4 h-4 text-neutral-500" />
                <span className="hidden sm:inline">{t(lang, 'signOut')}</span>
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <Lock className="w-4 h-4 text-neutral-500" />
                <span className="hidden sm:inline">{t(lang, 'admin')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
