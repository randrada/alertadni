-- Remove AEPD category and its contacts
DELETE FROM contacts WHERE category_id = (SELECT id FROM categories WHERE key = 'aepd');
DELETE FROM categories WHERE key = 'aepd';
