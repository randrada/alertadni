import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Directory } from '@/components/Directory';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminPanel } from '@/components/AdminPanel';
import { publicSupabase, supabase } from '@/lib/supabase';
import type { Category, CategoryWithContacts, Contact, LangCode } from '@/lib/types';

type View = 'directory' | 'admin-login' | 'admin-panel';

function App() {
  const [lang, setLang] = useState<LangCode>(() => {
    const saved = localStorage.getItem('lang') as LangCode | null;
    return saved || 'es';
  });
  const [view, setView] = useState<View>('directory');
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState<CategoryWithContacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
      if (!session) {
        setView((currentView) => currentView === 'admin-panel' ? 'directory' : currentView);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    let lastError: unknown;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const [{ data: cats, error: catError }, { data: cons, error: conError }] = await Promise.all([
          publicSupabase.from('categories').select('*').order('sort_order'),
          publicSupabase.from('contacts').select('*').order('sort_order'),
        ]);

        if (catError || conError) throw catError || conError;

        const categories = (cats || []) as Category[];
        const contacts = (cons || []) as Contact[];
        const grouped: CategoryWithContacts[] = categories.map((cat) => ({
          ...cat,
          contacts: contacts.filter((contact) => contact.category_id === cat.id),
        }));

        setData(grouped);
        setLoading(false);
        return;
      } catch (cause) {
        lastError = cause;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
        }
      }
    }

    console.error('Directory data load failed', lastError);
    setError(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setView('directory');
  }

  function handleAdminClick() {
    if (isAdmin) {
      setView('admin-panel');
    } else {
      setView('admin-login');
    }
  }

  if (view === 'admin-login' && !isAdmin) {
    return (
      <>
        <Header
          lang={lang}
          onLangChange={setLang}
          onAdminClick={handleAdminClick}
          isAdmin={false}
          onSignOut={handleSignOut}
        />
        <AdminLogin
          lang={lang}
          onSuccess={() => setView('admin-panel')}
          onBack={() => setView('directory')}
        />
      </>
    );
  }

  if (view === 'admin-panel' && isAdmin) {
    return (
      <>
        <Header
          lang={lang}
          onLangChange={setLang}
          onAdminClick={handleAdminClick}
          isAdmin={true}
          onSignOut={handleSignOut}
        />
        <AdminPanel lang={lang} onBack={() => setView('directory')} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header
        lang={lang}
        onLangChange={setLang}
        onAdminClick={handleAdminClick}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
      />
      <Directory lang={lang} data={data} loading={loading} error={error} onRetry={loadData} />
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-neutral-400">
            AlertaDNI — {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
