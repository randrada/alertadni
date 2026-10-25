export type LangCode = 'es' | 'gl' | 'ca' | 'eu';

export type LocalizedText = {
  es: string;
  gl: string;
  ca: string;
  eu: string;
};

export type Category = {
  id: string;
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Contact = {
  id: string;
  category_id: string;
  name: LocalizedText;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: LocalizedText;
  sort_order: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryWithContacts = Category & {
  contacts: Contact[];
};
