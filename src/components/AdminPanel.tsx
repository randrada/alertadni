import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, AlertCircle, ChevronDown, ChevronRight,
  Mail, Phone, Globe, ArrowLeft, Check, Search, BadgeCheck,
} from 'lucide-react';
import { t, localizedText } from '@/lib/i18n';
import { getIcon } from '@/lib/icons';
import { supabase } from '@/lib/supabase';
import type { LangCode, Category, Contact, LocalizedText } from '@/lib/types';

type Props = {
  lang: LangCode;
  onBack: () => void;
};

type ContactFormData = {
  id?: string;
  category_id: string;
  name: LocalizedText;
  email: string;
  phone: string;
  website: string;
  description: LocalizedText;
  sort_order: number;
};

type CategoryFormData = {
  id?: string;
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  sort_order: number;
};

const emptyLocalized: LocalizedText = { es: '', gl: '', ca: '', eu: '' };

export function AdminPanel({ lang, onBack }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactsByCategory, setContactsByCategory] = useState<Record<string, Contact[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const [editingContact, setEditingContact] = useState<ContactFormData | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'contact' | 'category'; id: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: cats }, { data: cons }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('contacts').select('*').order('sort_order'),
      ]);
      setCategories(cats || []);
      const grouped: Record<string, Contact[]> = {};
      (cons || []).forEach((c: Contact) => {
        if (!grouped[c.category_id]) grouped[c.category_id] = [];
        grouped[c.category_id].push(c);
      });
      setContactsByCategory(grouped);
    } catch {
      showToast(t(lang, 'errorLoading'), 'error');
    } finally {
      setLoading(false);
    }
  }, [lang, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function toggleCat(id: string) {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startEditContact(contact: Contact, categoryId: string) {
    setEditingContact({
      id: contact.id,
      category_id: categoryId,
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      website: contact.website || '',
      description: contact.description,
      sort_order: contact.sort_order,
    });
  }

  function startNewContact(categoryId: string) {
    setEditingContact({
      category_id: categoryId,
      name: { ...emptyLocalized },
      email: '',
      phone: '',
      website: '',
      description: { ...emptyLocalized },
      sort_order: (contactsByCategory[categoryId]?.length || 0) + 1,
    });
  }

  function startEditCategory(cat: Category) {
    setEditingCategory({
      id: cat.id,
      key: cat.key,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      sort_order: cat.sort_order,
    });
  }

  function startNewCategory() {
    setEditingCategory({
      key: '',
      name: { ...emptyLocalized },
      description: { ...emptyLocalized },
      icon: 'shield',
      sort_order: categories.length + 1,
    });
  }

  async function saveContact() {
    if (!editingContact) return;
    if (!editingContact.name.es) {
      showToast(t(lang, 'requiredField'), 'error');
      return;
    }
    try {
      const payload = {
        category_id: editingContact.category_id,
        name: editingContact.name,
        email: editingContact.email || null,
        phone: editingContact.phone || null,
        website: editingContact.website || null,
        description: editingContact.description,
        sort_order: editingContact.sort_order,
      };
      if (editingContact.id) {
        const { error } = await supabase.from('contacts').update(payload).eq('id', editingContact.id);
        if (error) throw error;
        showToast(t(lang, 'updated'));
      } else {
        const { error } = await supabase.from('contacts').insert(payload);
        if (error) throw error;
        showToast(t(lang, 'created'));
      }
      setEditingContact(null);
      loadData();
    } catch {
      showToast(t(lang, 'errorSaving'), 'error');
    }
  }

  async function saveCategory() {
    if (!editingCategory) return;
    if (!editingCategory.name.es || !editingCategory.key) {
      showToast(t(lang, 'requiredField'), 'error');
      return;
    }
    try {
      const payload = {
        key: editingCategory.key,
        name: editingCategory.name,
        description: editingCategory.description,
        icon: editingCategory.icon || 'shield',
        sort_order: editingCategory.sort_order,
      };
      if (editingCategory.id) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editingCategory.id);
        if (error) throw error;
        showToast(t(lang, 'updated'));
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
        showToast(t(lang, 'created'));
      }
      setEditingCategory(null);
      loadData();
    } catch {
      showToast(t(lang, 'errorSaving'), 'error');
    }
  }

  async function toggleVerified(contact: Contact) {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ verified: !contact.verified })
        .eq('id', contact.id);
      if (error) throw error;
      showToast(t(lang, 'updated'));
      loadData();
    } catch {
      showToast(t(lang, 'errorSaving'), 'error');
    }
  }

  async function deleteContact(id: string) {
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      showToast(t(lang, 'deleted'));
      setConfirmDelete(null);
      loadData();
    } catch {
      showToast(t(lang, 'errorDeleting'), 'error');
    }
  }

  async function deleteCategory(id: string) {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      showToast(t(lang, 'deleted'));
      setConfirmDelete(null);
      loadData();
    } catch {
      showToast(t(lang, 'errorDeleting'), 'error');
    }
  }

  const filteredCategories = search.trim()
    ? categories.filter((c) => {
        const q = search.toLowerCase();
        return (
          localizedText(c.name, lang).toLowerCase().includes(q) ||
          c.key.toLowerCase().includes(q)
        );
      })
    : categories;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-down">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === 'success' ? 'bg-success-600 text-white' : 'bg-error-600 text-white'
          }`}>
            <Check className="w-4 h-4" />
            {toast.msg}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t(lang, 'backToDirectory')}
            </button>
            <span className="text-neutral-300">/</span>
            <h2 className="text-lg font-bold text-neutral-900">{t(lang, 'adminPanel')}</h2>
          </div>
          <button
            onClick={startNewCategory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t(lang, 'addCategory')}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(lang, 'searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCategories.map((cat) => {
              const Icon = getIcon(cat.icon);
              const expanded = expandedCats.has(cat.id);
              const contacts = contactsByCategory[cat.id] || [];
              return (
                <div key={cat.id} className="rounded-xl bg-white border border-neutral-200 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 p-4">
                    <button
                      onClick={() => toggleCat(cat.id)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {localizedText(cat.name, lang)}
                      </h3>
                      <p className="text-xs text-neutral-400 font-mono">{cat.key}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-xs">
                      {contacts.length} {t(lang, 'contactsCount')}
                    </span>
                    <button
                      onClick={() => startNewContact(cat.id)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      title={t(lang, 'addContact')}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startEditCategory(cat)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      title={t(lang, 'edit')}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ type: 'category', id: cat.id, name: localizedText(cat.name, lang) })}
                      className="p-2 rounded-lg text-neutral-400 hover:text-error-600 hover:bg-error-50 transition-colors"
                      title={t(lang, 'delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {expanded && (
                    <div className="border-t border-neutral-100">
                      {contacts.length === 0 ? (
                        <div className="p-6 text-center text-sm text-neutral-400">{t(lang, 'noContacts')}</div>
                      ) : (
                        <div className="divide-y divide-neutral-100">
                          {contacts.map((contact) => (
                            <div key={contact.id} className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors group">
                              <button
                                onClick={() => toggleVerified(contact)}
                                className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                                title={contact.verified ? t(lang, 'markUnverified') : t(lang, 'markVerified')}
                              >
                                {contact.verified ? (
                                  <BadgeCheck className="w-4 h-4 text-success-500" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-neutral-300 hover:border-success-400 transition-colors" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900">{localizedText(contact.name, lang)}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {contact.email && (
                                    <span className="flex items-center gap-1 text-xs text-neutral-500">
                                      <Mail className="w-3 h-3" /> {contact.email}
                                    </span>
                                  )}
                                  {contact.phone && (
                                    <span className="flex items-center gap-1 text-xs text-neutral-500">
                                      <Phone className="w-3 h-3" /> {contact.phone}
                                    </span>
                                  )}
                                  {contact.website && (
                                    <span className="flex items-center gap-1 text-xs text-neutral-500">
                                      <Globe className="w-3 h-3" /> {contact.website}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => startEditContact(contact, cat.id)}
                                className="p-2 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ type: 'contact', id: contact.id, name: localizedText(contact.name, lang) })}
                                className="p-2 rounded-lg text-neutral-400 hover:text-error-600 hover:bg-error-50 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact edit modal */}
      {editingContact && (
        <Modal onClose={() => setEditingContact(null)} title={editingContact.id ? t(lang, 'editContact') : t(lang, 'addContact')}>
          <div className="space-y-4">
            <LocalizedInput
              label={t(lang, 'name')}
              value={editingContact.name}
              onChange={(v) => setEditingContact({ ...editingContact, name: v })}
              lang={lang}
              required
            />
            <LocalizedInput
              label={t(lang, 'description')}
              value={editingContact.description}
              onChange={(v) => setEditingContact({ ...editingContact, description: v })}
              lang={lang}
              textarea
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label={t(lang, 'email')}>
                <input
                  type="email"
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </Field>
              <Field label={t(lang, 'phone')}>
                <input
                  type="text"
                  value={editingContact.phone}
                  onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </Field>
              <Field label={t(lang, 'website')}>
                <input
                  type="url"
                  value={editingContact.website}
                  onChange={(e) => setEditingContact({ ...editingContact, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </Field>
            </div>
            <Field label={t(lang, 'category')}>
              <select
                value={editingContact.category_id}
                onChange={(e) => setEditingContact({ ...editingContact, category_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{localizedText(c.name, lang)}</option>
                ))}
              </select>
            </Field>
            <Field label={t(lang, 'sortOrder')}>
              <input
                type="number"
                value={editingContact.sort_order}
                onChange={(e) => setEditingContact({ ...editingContact, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
            <ModalActions onSave={saveContact} onCancel={() => setEditingContact(null)} lang={lang} />
          </div>
        </Modal>
      )}

      {/* Category edit modal */}
      {editingCategory && (
        <Modal onClose={() => setEditingCategory(null)} title={editingCategory.id ? t(lang, 'editCategory') : t(lang, 'addCategory')}>
          <div className="space-y-4">
            <Field label={`${t(lang, 'name')} (key)`}>
              <input
                type="text"
                value={editingCategory.key}
                onChange={(e) => setEditingCategory({ ...editingCategory, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="financial"
                disabled={!!editingCategory.id}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-50 disabled:text-neutral-400"
              />
            </Field>
            <LocalizedInput
              label={t(lang, 'name')}
              value={editingCategory.name}
              onChange={(v) => setEditingCategory({ ...editingCategory, name: v })}
              lang={lang}
              required
            />
            <LocalizedInput
              label={t(lang, 'description')}
              value={editingCategory.description}
              onChange={(v) => setEditingCategory({ ...editingCategory, description: v })}
              lang={lang}
              textarea
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label={t(lang, 'icon')}>
                <input
                  type="text"
                  value={editingCategory.icon}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  placeholder={t(lang, 'iconPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </Field>
              <Field label={t(lang, 'sortOrder')}>
                <input
                  type="number"
                  value={editingCategory.sort_order}
                  onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </Field>
            </div>
            <p className="text-xs text-neutral-400">
              {t(lang, 'icon')}: landmark, phone, shield, file-text, lock, building2
            </p>
            <ModalActions onSave={saveCategory} onCancel={() => setEditingCategory(null)} lang={lang} />
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)} title={t(lang, 'confirmDelete')} small>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-error-50 flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-error-500" />
              </div>
              <p className="text-sm text-neutral-700">
                {confirmDelete.type === 'category'
                  ? t(lang, 'confirmDeleteCategory')
                  : t(lang, 'confirmDeleteContact')}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                {t(lang, 'cancel')}
              </button>
              <button
                onClick={() => {
                  if (confirmDelete.type === 'contact') deleteContact(confirmDelete.id);
                  else deleteCategory(confirmDelete.id);
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-error-600 hover:bg-error-700 transition-colors"
              >
                {t(lang, 'delete')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
  title,
  small,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  small?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${small ? 'max-w-md' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in`}
      >
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white rounded-t-2xl">
          <h3 className="text-base font-bold text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function LocalizedInput({
  label,
  value,
  onChange,
  lang,
  textarea,
  required,
}: {
  label: string;
  value: LocalizedText;
  onChange: (v: LocalizedText) => void;
  lang: LangCode;
  textarea?: boolean;
  required?: boolean;
}) {
  const fields: { code: keyof LocalizedText; labelKey: string }[] = [
    { code: 'es', labelKey: 'nameEs' },
    { code: 'gl', labelKey: 'nameGl' },
    { code: 'ca', labelKey: 'nameCa' },
    { code: 'eu', labelKey: 'nameEu' },
  ];

  // Use description labels if textarea
  const descFields: { code: keyof LocalizedText; labelKey: string }[] = [
    { code: 'es', labelKey: 'descEs' },
    { code: 'gl', labelKey: 'descGl' },
    { code: 'ca', labelKey: 'descCa' },
    { code: 'eu', labelKey: 'descEu' },
  ];

  const activeFields = textarea ? descFields : fields;

  return (
    <div>
      <label className="block text-xs font-medium text-neutral-600 mb-1.5">
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {activeFields.map((f) => (
          <div key={f.code}>
            <span className="text-[10px] uppercase font-mono text-neutral-400">{f.code}</span>
            {textarea ? (
              <textarea
                value={value[f.code]}
                onChange={(e) => onChange({ ...value, [f.code]: e.target.value })}
                rows={2}
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
              />
            ) : (
              <input
                type="text"
                value={value[f.code]}
                onChange={(e) => onChange({ ...value, [f.code]: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModalActions({ onSave, onCancel, lang }: { onSave: () => void; onCancel: () => void; lang: LangCode }) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
      >
        {t(lang, 'cancel')}
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
      >
        {t(lang, 'save')}
      </button>
    </div>
  );
}
