import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Directory } from '@/components/Directory';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminPanel } from '@/components/AdminPanel';
import { supabase } from '@/lib/supabase';
import type { LangCode, CategoryWithContacts } from '@/lib/types';

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
      (async () => {
        setIsAdmin(!!session);
        if (!session && view === 'admin-panel') {
          setView('directory');
        }
      })();
    });

    return () => listener.subscription.unsubscribe();
  }, [view]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [{ data: cats, error: catError }, { data: cons, error: conError }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('contacts').select('*').order('sort_order'),
      ]);

      if (catError || conError) throw new Error('Failed to load');

      const grouped: CategoryWithContacts[] = (cats || []).map((cat: any) => ({
        ...cat,
        contacts: (cons || []).filter((c: any) => c.category_id === cat.id),
      }));

      setData(grouped);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
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
