import { useState, useMemo } from 'react';
import { Search, Mail, Phone, Globe, ChevronDown, X, AlertCircle, FileWarning, ShieldCheck, ShieldX, Landmark, Lock, Gamepad2, CreditCard, ArrowRight, BadgeCheck, HelpCircle } from 'lucide-react';
import { t, localizedText } from '@/lib/i18n';
import { getIcon } from '@/lib/icons';
import type { LangCode, CategoryWithContacts, Contact } from '@/lib/types';

type Props = {
  lang: LangCode;
  data: CategoryWithContacts[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
};

export function Directory({ lang, data, loading, error, onRetry }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(data.map((c) => c.key))
  );

  const visibleData = useMemo(
    () => data.filter((c) => c.key !== 'aepd'),
    [data]
  );

  const totalContacts = useMemo(
    () => visibleData.reduce((sum, c) => sum + c.contacts.length, 0),
    [visibleData]
  );

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = visibleData;

    if (activeCategory) {
      result = result.filter((c) => c.key === activeCategory);
    }

    if (!q) return result;

    return result
      .map((cat) => {
        const catName = localizedText(cat.name, lang).toLowerCase();
        const catDesc = localizedText(cat.description, lang).toLowerCase();
        const categoryMatch = catName.includes(q) || catDesc.includes(q);

        const matchingContacts = cat.contacts.filter((contact) => {
          const name = localizedText(contact.name, lang).toLowerCase();
          const desc = localizedText(contact.description, lang).toLowerCase();
          const email = (contact.email || '').toLowerCase();
          const phone = (contact.phone || '').toLowerCase();
          const website = (contact.website || '').toLowerCase();
          return (
            name.includes(q) ||
            desc.includes(q) ||
            email.includes(q) ||
            phone.includes(q) ||
            website.includes(q)
          );
        });

        if (categoryMatch) {
          return cat;
        }
        if (matchingContacts.length > 0) {
          return { ...cat, contacts: matchingContacts };
        }
        return null;
      })
      .filter((c): c is CategoryWithContacts => c !== null);
  }, [data, search, activeCategory, lang]);

  const filteredCount = filteredData.reduce((sum, c) => sum + c.contacts.length, 0);

  function toggleCategory(key: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="mt-4 text-neutral-500 text-sm">{t(lang, 'loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="w-12 h-12 text-error-400" />
        <p className="mt-4 text-neutral-700 font-medium">{t(lang, 'errorLoading')}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          {t(lang, 'retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro section */}
      <section className="mb-8 animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 p-6 sm:p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <FileWarning className="w-5 h-5 text-warning-300" />
              <span className="text-warning-200 text-sm font-medium uppercase tracking-wide">
                {t(lang, 'quickGuide')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              {t(lang, 'introTitle')}
            </h2>
            <p className="text-primary-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t(lang, 'introText')}
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Stat icon={<Landmark className="w-4 h-4" />} value={visibleData.length} label={t(lang, 'totalCategories')} />
              <Stat icon={<ShieldCheck className="w-4 h-4" />} value={totalContacts} label={t(lang, 'totalContacts')} />
            </div>
          </div>
        </div>
      </section>

      {/* Steps guide */}
      <section className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
        <StepCard num="1" icon={<Landmark className="w-5 h-5" />} title={t(lang, 'step1')} text={t(lang, 'step1Text')} />
        <StepCard num="2" icon={<ShieldCheck className="w-5 h-5" />} title={t(lang, 'step2')} text={t(lang, 'step2Text')} />
        <StepCard num="3" icon={<Lock className="w-5 h-5" />} title={t(lang, 'step3')} text={t(lang, 'step3Text')} />
      </section>

      {/* Info cards: gaming alert + gaming self-exclusion + financial products */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <InfoCard
          icon={<Gamepad2 className="w-5 h-5" />}
          title={t(lang, 'gamingCardTitle')}
          text={t(lang, 'gamingCardText')}
          actionLabel={t(lang, 'gamingCardAction')}
          href="https://www.ordenacionjuego.es/participantes-juego/juego-autorizado/alerta-suplantacion-identidad"
          accent="accent"
        />
        <InfoCard
          icon={<ShieldX className="w-5 h-5" />}
          title={t(lang, 'gamingCardTitle2')}
          text={t(lang, 'gamingCardText2')}
          actionLabel={t(lang, 'gamingCardAction2')}
          href="https://www.ordenacionjuego.es/participantes-juego/juego-seguro/rgiaj"
          accent="accent"
        />
        <InfoCard
          icon={<CreditCard className="w-5 h-5" />}
          title={t(lang, 'financialCardTitle')}
          text={t(lang, 'financialCardText')}
          actionLabel={t(lang, 'financialCardAction')}
          href="https://www.bde.es/cirbe"
          accent="primary"
        />
      </section>

      {/* Search bar */}
      <div className="sticky top-16 z-30 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(lang, 'searchPlaceholder')}
            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white border border-neutral-200 shadow-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill
          active={activeCategory === null}
          onClick={() => setActiveCategory(null)}
          label={t(lang, 'allCategories')}
          count={totalContacts}
        />
        {visibleData.map((cat) => {
          const Icon = getIcon(cat.icon);
          return (
            <FilterPill
              key={cat.key}
              active={activeCategory === cat.key}
              onClick={() =>
                setActiveCategory(activeCategory === cat.key ? null : cat.key)
              }
              label={localizedText(cat.name, lang)}
              count={cat.contacts.length}
              icon={<Icon className="w-4 h-4" />}
            />
          );
        })}
      </div>

      {/* Results count */}
      {(search || activeCategory) && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-500">
            {t(lang, 'showing')} <span className="font-semibold text-neutral-700">{filteredCount}</span> {t(lang, 'results')}
          </p>
          {(search || activeCategory) && (
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory(null);
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              {t(lang, 'clearFilters')}
            </button>
          )}
        </div>
      )}

      {/* No results */}
      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-12 h-12 text-neutral-300" />
          <p className="mt-4 text-neutral-700 font-medium">{t(lang, 'noResults')}</p>
          <p className="mt-1 text-sm text-neutral-500">{t(lang, 'noResultsDesc')}</p>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {filteredData.map((cat) => {
          const Icon = getIcon(cat.icon);
          const expanded = expandedCategories.has(cat.key) || !!search;
          return (
            <div
              key={cat.key}
              className="rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-slide-up"
            >
              <button
                onClick={() => toggleCategory(cat.key)}
                className="w-full flex items-center gap-4 p-5 hover:bg-neutral-50 transition-colors text-left"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex-shrink-0">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-neutral-900">
                    {localizedText(cat.name, lang)}
                  </h3>
                  <p className="text-sm text-neutral-500 truncate">
                    {localizedText(cat.description, lang)}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
                    {cat.contacts.length} {cat.contacts.length === 1 ? t(lang, 'contactCount') : t(lang, 'contactsCount')}
                  </span>
                  <ChevronDown
                    className={"w-5 h-5 text-neutral-400 transition-transform " + (expanded ? 'rotate-180' : '')}
                  />
                </div>
              </button>

              {expanded && (
                <div className="border-t border-neutral-100">
                  {cat.contacts.length === 0 ? (
                    <div className="p-8 text-center text-sm text-neutral-400">
                      {t(lang, 'noContacts')}
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100">
                      {cat.contacts.map((contact) => (
                        <ContactRow key={contact.id} contact={contact} lang={lang} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
      <span className="text-primary-200">{icon}</span>
      <span className="text-white font-semibold text-sm">{value}</span>
      <span className="text-primary-200 text-sm">{label}</span>
    </div>
  );
}

function StepCard({
  num,
  icon,
  title,
  text,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white border border-neutral-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600">
          {icon}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-neutral-900 mb-1">{title}</h4>
      <p className="text-xs text-neutral-500 leading-relaxed">{text}</p>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: React.ReactNode;
}) {
  const activeClass = active
    ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20'
    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50';
  const badgeClass = active ? 'bg-white/20' : 'bg-neutral-100 text-neutral-500';
  return (
    <button
      onClick={onClick}
      className={"flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all " + activeClass}
    >
      {icon}
      <span>{label}</span>
      <span className={"px-1.5 py-0.5 rounded-full text-xs " + badgeClass}>
        {count}
      </span>
    </button>
  );
}

function ContactRow({ contact, lang }: { contact: Contact; lang: LangCode }) {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-neutral-50 transition-colors animate-fade-in">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
          {localizedText(contact.name, lang)}
          {contact.verified ? (
            <BadgeCheck className="w-4 h-4 text-success-500 flex-shrink-0" />
          ) : (
            <HelpCircle className="w-4 h-4 text-neutral-300 flex-shrink-0" />
          )}
        </h4>
        <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
          {localizedText(contact.description, lang)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
        {contact.email && (
          <ContactChip
            icon={<Mail className="w-3.5 h-3.5" />}
            value={contact.email}
            type="email"
            copied={copied === 'email'}
            onCopy={() => copyToClipboard(contact.email!, 'email')}
            lang={lang}
            primary
          />
        )}
        {contact.phone && (
          <ContactChip
            icon={<Phone className="w-3.5 h-3.5" />}
            value={contact.phone}
            type="phone"
            copied={copied === 'phone'}
            onCopy={() => copyToClipboard(contact.phone!, 'phone')}
            lang={lang}
          />
        )}
        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium hover:bg-primary-100 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {t(lang, 'visitWebsite')}
          </a>
        )}
      </div>
    </div>
  );
}

function ContactChip({
  icon,
  value,
  type,
  copied,
  onCopy,
  lang,
  primary,
}: {
  icon: React.ReactNode;
  value: string;
  type: string;
  copied: boolean;
  onCopy: () => void;
  lang: LangCode;
  primary?: boolean;
}) {
  const chipClass = primary
    ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200';
  return (
    <button
      onClick={onCopy}
      title={copied ? t(lang, 'copied') : t(lang, 'copy')}
      className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors group " + chipClass}
    >
      {icon}
      <span className="font-mono">{value}</span>
      <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors">
        {copied ? '✓' : ''}
      </span>
    </button>
  );
}

function InfoCard({
  icon,
  title,
  text,
  actionLabel,
  href,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  actionLabel: string;
  href: string;
  accent: 'primary' | 'accent';
}) {
  const bg = accent === 'primary'
    ? 'from-primary-50 to-primary-100/50 border-primary-200'
    : 'from-accent-50 to-accent-100/50 border-accent-200';
  const iconBg = accent === 'primary'
    ? 'bg-primary-100 text-primary-700'
    : 'bg-accent-100 text-accent-700';
  const linkColor = accent === 'primary'
    ? 'text-primary-700 hover:text-primary-800'
    : 'text-accent-700 hover:text-accent-800';
  return (
    <div className={"p-5 rounded-2xl bg-gradient-to-br border " + bg}>
      <div className="flex items-start gap-3">
        <div className={"flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 " + iconBg}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-neutral-900 mb-1">{title}</h3>
          <p className="text-xs text-neutral-600 leading-relaxed mb-3">{text}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={"inline-flex items-center gap-1 text-xs font-semibold transition-colors " + linkColor}
          >
            {actionLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
