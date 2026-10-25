/*
# Create fraud reporting directory schema

## Overview
Creates a directory of contacts (emails, phones, websites) for reporting
identity fraud / data breaches in Spain. Supports 4 languages: Spanish,
Galician, Catalan, Basque. Includes admin access for data management.

## New Tables

### categories
- `id` (uuid, PK)
- `key` (text, unique) — slug identifier e.g. "financial"
- `name` (jsonb) — multilingual name {es, gl, ca, eu}
- `description` (jsonb) — multilingual description
- `icon` (text) — lucide-react icon name
- `sort_order` (int, default 0)
- `created_at`, `updated_at` (timestamptz)

### contacts
- `id` (uuid, PK)
- `category_id` (uuid, FK -> categories ON DELETE CASCADE)
- `name` (jsonb) — multilingual contact name
- `email` (text, nullable)
- `phone` (text, nullable)
- `website` (text, nullable)
- `description` (jsonb) — multilingual description
- `sort_order` (int, default 0)
- `created_at`, `updated_at` (timestamptz)

## Security (RLS)
- Both tables: public SELECT (anon + authenticated) since the directory is public.
- Both tables: INSERT/UPDATE/DELETE restricted to authenticated users (admins).
- No user_id column needed — any authenticated user is an admin.

## Seed Data
Preloads Spanish categories and contacts across 6 categories:
1. Entidades financieras (banks)
2. Operadoras de telefonía e internet (telecom)
3. Fuerzas y cuerpos de seguridad (police)
4. Agencia Española de Protección de Datos (AEPD)
5. Instituto Nacional de Ciberseguridad (INCIBE)
6. Otros organismos públicos

All multilingual fields include es, gl, ca, eu translations.
*/

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name jsonb NOT NULL,
  description jsonb NOT NULL DEFAULT '{}',
  icon text NOT NULL DEFAULT 'shield',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_categories" ON categories;
CREATE POLICY "public_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- CONTACTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name jsonb NOT NULL,
  email text,
  phone text,
  website text,
  description jsonb NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_contacts" ON contacts;
CREATE POLICY "public_select_contacts" ON contacts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_contacts" ON contacts;
CREATE POLICY "admin_insert_contacts" ON contacts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_contacts" ON contacts;
CREATE POLICY "admin_update_contacts" ON contacts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_contacts" ON contacts;
CREATE POLICY "admin_delete_contacts" ON contacts FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_contacts_category_id ON contacts(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_contacts_sort_order ON contacts(sort_order);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS categories_updated_at ON categories;
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS contacts_updated_at ON contacts;
CREATE TRIGGER contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED DATA: CATEGORIES
-- ============================================================

INSERT INTO categories (key, name, description, icon, sort_order) VALUES
(
  'financial',
  '{"es":"Entidades financieras","gl":"Entidades financeiras","ca":"Entitats financeres","eu":"Erakunde finantzarioak"}',
  '{"es":"Bancos, cajas de ahorro y cooperativas de crédito para notificar suplantación de identidad.","gl":"Bancos, caixas de aforro e cooperativas de crédito para notificar suplantación de identidade.","ca":"Bancs, caixes destalvi i cooperatives de crèdit per notificar suplantació didentitat.","eu":"Bankuak, aurrezki kutxak eta kreditu kooperatibak identitate-uzurpena jakinarazteko."}',
  'landmark',
  1
),
(
  'telecom',
  '{"es":"Operadoras de telefonía e internet","gl":"Operadoras de telefonía e internet","ca":"Operadores de telefonia i internet","eu":"Telefono eta internet operadoreak"}',
  '{"es":"Compañías de telecomunicaciones para reportar suplantación o uso fraudulento de líneas.","gl":"Compañías de telecomunicacións para reportar suplantación ou uso fraudulento de liñas.","ca":"Companyies de telecomunicacions per reportar suplantació o ús fraudulència de línies.","eu":"Telekomunikazio konpainiak lerroen usurpazioa edo erabilera iruzurtia salatzeko."}',
  'phone',
  2
),
(
  'police',
  '{"es":"Fuerzas y cuerpos de seguridad","gl":"Forzas e corpos de seguridade","ca":"Forces i cossos de seguretat","eu":"Segurtasun indarrak eta gorputzak"}',
  '{"es":"Cuerpos policiales para denunciar delitos de suplantación de identidad y robo de datos.","gl":"Corpos policiais para denunciar delitos de suplantación de identidade e roubo de datos.","ca":"Cossos policials per denunciar delictes de suplantació didentitat i robatori de dades.","eu":"Identitate-uzurpena eta datu-lapurreta delituak salatzeko polizia gorputzak."}',
  'shield',
  3
),
(
  'aepd',
  '{"es":"Agencia Española de Protección de Datos","gl":"Axencia Española de Protección de Datos","ca":"Agència Espanyola de Protecció de Dades","eu":"Datu Babeserako Espainiako Agentzia"}',
  '{"es":"Organismo público para reclamar la protección de tus datos personales y presentar reclamaciones.","gl":"Organismo público para reclamar a protección dos teus datos persoais e presentar reclamacións.","ca":"Organisme públic per reclamar la protecció de les teves dades personals i presentar reclamacions.","eu":"Zure datu pertsonalen babesa aldarrikatzeko eta erreklamazioak aurkezteko erakunde publikoa."}',
  'file-text',
  4
),
(
  'incibe',
  '{"es":"Instituto Nacional de Ciberseguridad","gl":"Instituto Nacional de Ciberseguridade","ca":"Institut Nacional de Ciberseguretat","eu":"Zibersegurtasunerako Institutu Nazionala"}',
  '{"es":"INCIBE: ayuda y asesoramiento en ciberseguridad para ciudadanos y empresas.","gl":"INCIBE: axuda e asesoramento en ciberseguridade para cidadáns e empresas.","ca":"INCIBE: ajuda i assessorament en ciberseguretat per a ciutadans i empreses.","eu":"INCIBE: zibersegurtasunean laguntza eta aholkularitza hiritarrentzat eta enpresentzat."}',
  'lock',
  5
),
(
  'other',
  '{"es":"Otros organismos públicos","gl":"Outros organismos públicos","ca":"Altres organismes públics","eu":"Beste erakunde publiko batzuk"}',
  '{"es":"Otros organismos y servicios de utilidad para casos de suplantación de identidad.","gl":"Outros organismos e servizos de utilidade para casos de suplantación de identidade.","ca":"Altres organismes i serveis dutilitat per a casos de suplantació didentitat.","eu":"Identitate-uzurpen kasuetarako beste erakunde eta zerbitzu erabilgarriak."}',
  'building2',
  6
)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED DATA: CONTACTS
-- ============================================================

-- FINANCIAL
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"Banco de España","gl":"Banco de España","ca":"Banc dEspanya","eu":"Espainiako Bankua"}'::jsonb,
    'atencion.usuario@bde.es',
    '+34 91 338 51 51',
    'https://www.bde.es',
    '{"es":"Banco central supervisor. Atención al usuario para consultas y reclamaciones.","gl":"Banco central supervisor. Atención ao usuario para consultas e reclamacións.","ca":"Banc central supervisor. Atenció a lusuari per a consultes i reclamacions.","eu":"Banku zentraleko arduraduna. Erabiltzailearentzako arreta kontsultak eta erreklamazioetarako."}'::jsonb,
    1
  ),
  (
    '{"es":"CaixaBank","gl":"CaixaBank","ca":"CaixaBank","eu":"CaixaBank"}'::jsonb,
    '',
    '+34 900 444 400',
    'https://www.caixabank.es',
    '{"es":"Atención al cliente para notificar suplantación de identidad o acceso fraudulento a cuentas.","gl":"Atención ao cliente para notificar suplantación de identidade ou acceso fraudulento a contas.","ca":"Atenció al client per notificar suplantació didentitat o accés fraudulènt a comptes.","eu":"Bezeroarentzako arreta identitate-uzurpena edo kontuetara iruzurrezko sarbidea jakinarazteko."}'::jsonb,
    2
  ),
  (
    '{"es":"Banco Santander","gl":"Banco Santander","ca":"Banc Santander","eu":"Santander Bankua"}'::jsonb,
    '',
    '+34 912 056 000',
    'https://www.santander.es',
    '{"es":"Canal de denuncia de fraude y suplantación de identidad para clientes.","gl":"Canal de denuncia de fraude e suplantación de identidade para clientes.","ca":"Canal de denúncia de frau i suplantació didentitat per a clients.","eu":"Bezeroentzako iruzur eta identitate-uzurpen salaketa kanala."}'::jsonb,
    3
  ),
  (
    '{"es":"BBVA","gl":"BBVA","ca":"BBVA","eu":"BBVA"}'::jsonb,
    '',
    '+34 600 373 373',
    'https://www.bbva.es',
    '{"es":"Atención al cliente y canal de prevención de fraude bancario.","gl":"Atención ao cliente e canal de prevención de fraude bancario.","ca":"Atenció al client i canal de prevenció de frau bancari.","eu":"Bezeroarentzako arreta eta banku-iruzur prebentzio kanala."}'::jsonb,
    4
  ),
  (
    '{"es":"Banco Sabadell","gl":"Banco Sabadell","ca":"Banc Sabadell","eu":"Sabadell Bankua"}'::jsonb,
    '',
    '+34 962 060 060',
    'https://www.bancosabadell.com',
    '{"es":"Notificación de suplantación y bloqueo de cuentas bancarias.","gl":"Notificación de suplantación e bloqueo de contas bancarias.","ca":"Notificació de suplantació i bloqueig de comptes bancaris.","eu":"Uzurpen jakinarazpena eta banku-kontuak blokeatzea."}'::jsonb,
    5
  ),
  (
    '{"es":"Bankinter","gl":"Bankinter","ca":"Bankinter","eu":"Bankinter"}'::jsonb,
    '',
    '+34 902 233 633',
    'https://www.bankinter.com',
    '{"es":"Canal de atención para fraude y suplantación de identidad.","gl":"Canal de atención para fraude e suplantación de identidade.","ca":"Canal dattencció per a frau i suplantació didentitat.","eu":"Iruzur eta identitate-uzurpenarentzako arreta kanala."}'::jsonb,
    6
  ),
  (
    '{"es":"ING España","gl":"ING España","ca":"ING Espanya","eu":"ING Espainia"}'::jsonb,
    '',
    '+34 91 206 66 66',
    'https://www.ing.es',
    '{"es":"Banco online. Canal de denuncia de fraude y suplantación.","gl":"Banco en liña. Canal de denuncia de fraude e suplantación.","ca":"Banc en línia. Canal de denúncia de frau i suplantació.","eu":"Lineako bankua. Iruzur eta uzurpen salaketa kanala."}'::jsonb,
    7
  ),
  (
    '{"es":"Unicaja Banco","gl":"Unicaja Banco","ca":"Unicaja Banc","eu":"Unicaja Bankua"}'::jsonb,
    '',
    '+34 952 072 626',
    'https://www.unicaja.es',
    '{"es":"Atención al cliente para suplantación de identidad.","gl":"Atención ao cliente para suplantación de identidade.","ca":"Atenció al client per a suplantació didentitat.","eu":"Bezeroarentzako arreta identitate-uzurpenarentzat."}'::jsonb,
    8
  ),
  (
    '{"es":"Ibercaja","gl":"Ibercaja","ca":"Ibercaja","eu":"Ibercaja"}'::jsonb,
    '',
    '+34 876 030 030',
    'https://www.ibercaja.es',
    '{"es":"Notificación de fraude y acceso no autorizado a cuentas.","gl":"Notificación de fraude e acceso non autorizado a contas.","ca":"Notificació de frau i accés no autoritzat a comptes.","eu":"Iruzur eta baimenikoko kontuetarako sarbide jakinarazpena."}'::jsonb,
    9
  ),
  (
    '{"es":"Kutxabank","gl":"Kutxabank","ca":"Kutxabank","eu":"Kutxabank"}'::jsonb,
    '',
    '+34 900 501 000',
    'https://www.kutxabank.es',
    '{"es":"Caja de ahorros del País Vasco. Bloqueo y fraude.","gl":"Caixa de aforros do País Vasco. Bloqueo e fraude.","ca":"Caixa destalvi del País Basc. Bloqueig i frau.","eu":"Euskal Herriko aurrezki kutxa. Blokeoa eta iruzurra."}'::jsonb,
    10
  ),
  (
    '{"es":"Abanca","gl":"Abanca","ca":"Abanca","eu":"Abanca"}'::jsonb,
    '',
    '+34 981 910 910',
    'https://www.abanca.es',
    '{"es":"Atención al cliente para suplantación y fraude.","gl":"Atención ao cliente para suplantación e fraude.","ca":"Atenció al client per a suplantació i frau.","eu":"Bezeroarentzako arreta uzurpen eta iruzurarentzat."}'::jsonb,
    11
  ),
  (
    '{"es":"Cajasur","gl":"Cajasur","ca":"Cajasur","eu":"Cajasur"}'::jsonb,
    '',
    '+34 957 212 121',
    'https://www.cajasur.es',
    '{"es":"Canal de fraude y suplantación de identidad.","gl":"Canal de fraude e suplantación de identidade.","ca":"Canal de frau i suplantació didentitat.","eu":"Iruzur eta identitate-uzurpen kanala."}'::jsonb,
    12
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'financial';

-- TELECOM
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"Movistar","gl":"Movistar","ca":"Movistar","eu":"Movistar"}'::jsonb,
    '',
    '+34 1004',
    'https://www.movistar.es',
    '{"es":"Operadora de telefonía e internet. Canal de fraude y suplantación.","gl":"Operadora de telefonía e internet. Canal de fraude e suplantación.","ca":"Operadora de telefonia i internet. Canal de frau i suplantació.","eu":"Telefono eta internet operadorea. Iruzur eta uzurpen kanala."}'::jsonb,
    1
  ),
  (
    '{"es":"Vodafone España","gl":"Vodafone España","ca":"Vodafone Espanya","eu":"Vodafone Espainia"}'::jsonb,
    '',
    '+34 607 263 000',
    'https://www.vodafone.es',
    '{"es":"Atención al cliente para fraude y suplantación de líneas.","gl":"Atención ao cliente para fraude e suplantación de liñas.","ca":"Atenció al client per a frau i suplantació de línies.","eu":"Bezeroarentzako arreta iruzur eta lerro-uzurpenarentzat."}'::jsonb,
    2
  ),
  (
    '{"es":"Orange España","gl":"Orange España","ca":"Orange Espanya","eu":"Orange Espainia"}'::jsonb,
    '',
    '+34 656 001 234',
    'https://www.orange.es',
    '{"es":"Notificación de suplantación y uso fraudulento de servicios.","gl":"Notificación de suplantación e uso fraudulento de servizos.","ca":"Notificació de suplantació i ús fraudulènt de serveis.","eu":"Uzurpen eta zerbitzuen erabilera iruzurtiaren jakinarazpena."}'::jsonb,
    3
  ),
  (
    '{"es":"MásMóvil","gl":"MásMóvil","ca":"MásMóvil","eu":"MásMóvil"}'::jsonb,
    '',
    '+34 2373',
    'https://www.masmovil.es',
    '{"es":"Operadora low-cost. Canal de denuncia de fraude.","gl":"Operadora low-cost. Canal de denuncia de fraude.","ca":"Operadora low-cost. Canal de denúncia de frau.","eu":"Operadorea low-cost. Iruzur salaketa kanala."}'::jsonb,
    4
  ),
  (
    '{"es":"Digi España","gl":"Digi España","ca":"Digi Espanya","eu":"Digi Espainia"}'::jsonb,
    '',
    '+34 642 642 642',
    'https://www.digimobil.es',
    '{"es":"Operadora de telefonía móvil. Reporte de suplantación.","gl":"Operadora de telefonía móbil. Reporte de suplantación.","ca":"Operadora de telefonia mòbil. Reportatge de suplantació.","eu":"Telefono mugikorreko operadorea. Uzurpen salaketa."}'::jsonb,
    5
  ),
  (
    '{"es":"Lowi","gl":"Lowi","ca":"Lowi","eu":"Lowi"}'::jsonb,
    '',
    '+34 1707',
    'https://www.lowi.es',
    '{"es":"Operadora de Vodafone. Canal de fraude.","gl":"Operadora de Vodafone. Canal de fraude.","ca":"Operadora de Vodafone. Canal de frau.","eu":"Vodafoneren operadorea. Iruzur kanala."}'::jsonb,
    6
  ),
  (
    '{"es":"Pepephone","gl":"Pepephone","ca":"Pepephone","eu":"Pepephone"}'::jsonb,
    '',
    '+34 1796',
    'https://www.pepephone.com',
    '{"es":"Operadora del Grupo MásMóvil. Atención de fraude.","gl":"Operadora do Grupo MásMóbil. Atención de fraude.","ca":"Operadora del Grup MásMóvil. Atenció de frau.","eu":"MásMóvil Taldeko operadorea. Iruzur arreta."}'::jsonb,
    7
  ),
  (
    '{"es":"Finetwork","gl":"Finetwork","ca":"Finetwork","eu":"Finetwork"}'::jsonb,
    '',
    '+34 800 808 080',
    'https://www.finetwork.com',
    '{"es":"Operadora de fibra y móvil. Canal de suplantación.","gl":"Operadora de fibra e móbil. Canal de suplantación.","ca":"Operadora de fibra i mòbil. Canal de suplantació.","eu":"Zuntz eta mugikorreko operadorea. Uzurpen kanala."}'::jsonb,
    8
  ),
  (
    '{"es":"O2","gl":"O2","ca":"O2","eu":"O2"}'::jsonb,
    '',
    '+34 1551',
    'https://www.o2online.es',
    '{"es":"Operadora de Telefónica. Atención al cliente.","gl":"Operadora de Telefónica. Atención ao cliente.","ca":"Operadora de Telefónica. Atenció al client.","eu":"Telefónicaren operadorea. Bezeroarentzako arreta."}'::jsonb,
    9
  ),
  (
    '{"es":"Simyo","gl":"Simyo","ca":"Simyo","eu":"Simyo"}'::jsonb,
    '',
    '+34 1707',
    'https://www.simyo.es',
    '{"es":"Operadora de KPN. Canal de denuncia de fraude.","gl":"Operadora de KPN. Canal de denuncia de fraude.","ca":"Operadora de KPN. Canal de denúncia de frau.","eu":"KPNren operadorea. Iruzur salaketa kanala."}'::jsonb,
    10
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'telecom';

-- POLICE
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"Guardia Civil - Grupo de Delitos Telemáticos","gl":"Guardia Civil - Grupo de Delitos Telemáticos","ca":"Guàrdia Civil - Grup de Delictes Telemàtics","eu":"Guardia Zibila - Delitu Telematikoen Taldea"}'::jsonb,
    'gdt@guardiacivil.es',
    '+34 900 105 365',
    'https://www.guardiacivil.es',
    '{"es":"Denuncia de delitos telemáticos, suplantación de identidad y robo de datos personales.","gl":"Denuncia de delitos telemáticos, suplantación de identidade e roubo de datos persoais.","ca":"Denúncia de delictes telemàtics, suplantació didentitat i robatori de dades personals.","eu":"Delitu telematikoen, identitate-uzurpenaren eta datu pertsonalen lapurreten salaketa."}'::jsonb,
    1
  ),
  (
    '{"es":"Cuerpo Nacional de Policía - Unidad de Ciberdelincuencia","gl":"Corpo Nacional de Policía - Unidade de Ciberdelincuencia","ca":"Cos Nacional de Policia - Unitat de Ciberdelinqüència","eu":"Polizia Nazionalaren Gorputza - Ziberkriminalitate Unitatea"}'::jsonb,
    '',
    '+34 091',
    'https://www.policia.es',
    '{"es":"Denuncia de ciberdelitos y suplantación de identidad en internet.","gl":"Denuncia de ciberdelitos e suplantación de identidade en internet.","ca":"Denúncia de ciberdelictes i suplantació didentitat a internet.","eu":"Interneteko ziberdelitu eta identitate-uzurpen salaketa."}'::jsonb,
    2
  ),
  (
    '{"es":"Ertzaintza - Ciberdelincuencia","gl":"Ertzaintza - Ciberdelincuencia","ca":"Ertzaintza - Ciberdelinqüència","eu":"Ertzaintza - Ziberkriminalitatea"}'::jsonb,
    '',
    '+34 948 159 800',
    'https://www.ertzaintza.eus',
    '{"es":"Policía autonómica del País Vasco. Denuncia de delitos telemáticos.","gl":"Policía autonómica do País Vasco. Denuncia de delitos telemáticos.","ca":"Policia autonòmica del País Basc. Denúncia de delictes telemàtics.","eu":"Euskal Herriko polizia autonomikoa. Delitu telematikoen salaketa."}'::jsonb,
    3
  ),
  (
    '{"es":"Mossos dEsquadra - Área de Ciberdelincuencia","gl":"Mossos dEsquadra - Área de Ciberdelincuencia","ca":"Mossos dEsquadra - Àrea de Ciberdelinqüència","eu":"Mossos dEsquadra - Ziberkriminalitate Area"}'::jsonb,
    '',
    '+34 937 285 200',
    'https://mossos.gencat.cat',
    '{"es":"Policía autonómica de Cataluña. Denuncia de suplantación de identidad.","gl":"Policía autonómica de Cataluña. Denuncia de suplantación de identidade.","ca":"Policia autonòmica de Catalunya. Denúncia de suplantació didentitat.","eu":"Kataluniako polizia autonomikoa. Identitate-uzurpen salaketa."}'::jsonb,
    4
  ),
  (
    '{"es":"Policía Foral de Navarra","gl":"Policía Foral de Navarra","ca":"Policia Foral de Navarra","eu":"Nafarroako Foru Polizia"}'::jsonb,
    '',
    '+34 848 842 000',
    'https://www.navarra.es/policiaforal',
    '{"es":"Policía autonómica de Navarra. Canal de denuncia de fraude.","gl":"Policía autonómica de Navarra. Canal de denuncia de fraude.","ca":"Policia autonòmica de Navarra. Canal de denúncia de frau.","eu":"Nafarroako polizia autonomikoa. Iruzur salaketa kanala."}'::jsonb,
    5
  ),
  (
    '{"es":"Policía Local (general)","gl":"Policía Local (xeral)","ca":"Policia Local (general)","eu":"Polizia Lokala (orokorra)"}'::jsonb,
    '',
    '+34 092',
    '',
    '{"es":"Policía local para denuncias presenciales de suplantación de identidad.","gl":"Policía local para denuncias presenciais de suplantación de identidade.","ca":"Policia local per a denúncies presencials de suplantació didentitat.","eu":"Identitate-uzurpen salaketa presentzialak egiteko polizia lokala."}'::jsonb,
    6
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'police';

-- AEPD
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"AEPD - Sede Electrónica","gl":"AEPD - Sede Electrónica","ca":"AEPD - Seu Electrònica","eu":"AEPD - Egoitza Elektronikoa"}'::jsonb,
    'informacion@agpd.es',
    '+34 912 663 517',
    'https://sedeagpd.gob.es',
    '{"es":"Sede electrónica de la Agencia Española de Protección de Datos para reclamaciones y denuncias.","gl":"Sede electrónica da Axencia Española de Protección de Datos para reclamacións e denuncias.","ca":"Seu electrònica de lAgència Espanyola de Protecció de Dades per a reclamacions i denúncies.","eu":"Datu Babeserako Espainiako Agentziaren egoitza elektronikoa erreklamazio eta salaketa egiteko."}'::jsonb,
    1
  ),
  (
    '{"es":"AEPD - Canal de Reclamaciones","gl":"AEPD - Canal de Reclamacións","ca":"AEPD - Canal de Reclamacions","eu":"AEPD - Erreklamazio Kanala"}'::jsonb,
    ' reclamaciones@agpd.es',
    '+34 901 100 099',
    'https://www.aepd.es',
    '{"es":"Canal específico para presentar reclamaciones por vulneración de derechos de protección de datos.","gl":"Canal específico para presentar reclamacións por vulneración de dereitos de protección de datos.","ca":"Canal específic per presentar reclamacions per vulneració de drets de protecció de dades.","eu":"Datu babeseko eskubideen urraketarako erreklamazioak aurkezteko kanal espezifikoa."}'::jsonb,
    2
  ),
  (
    '{"es":"AEPD - Inspección de Datos","gl":"AEPD - Inspección de Datos","ca":"AEPD - Inspecció de Dades","eu":"AEPD - Datu Ikuskaritza"}'::jsonb,
    'inspeccion@agpd.es',
    '+34 912 663 517',
    'https://www.aepd.es/inspeccion',
    '{"es":"Inspección de la AEPD para denunciar filtraciones de datos personales como la imagen del DNI.","gl":"Inspección da AEPD para denunciar filtracións de datos persoais como a imaxe do DNI.","ca":"Inspecció de lAEPD per denunciar filtracions de dades personals com la imatge del DNI.","eu":"AEPDko ikuskaritza DNIaren irudia bezalako datu pertsonalen filtrazioak salatzeko."}'::jsonb,
    3
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'aepd';

-- INCIBE
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"INCIBE - Línea de Ayuda en Ciberseguridad","gl":"INCIBE - Liña de Axuda en Ciberseguridade","ca":"INCIBE - Línia dAjuda en Ciberseguretat","eu":"INCIBE - Zibersegurtasun Laguntza Lerroa"}'::jsonb,
    'cauci@incibe.es',
    '+34 900 116 117',
    'https://www.incibe.es',
    '{"es":"Línea gratuita de ayuda en ciberseguridad para ciudadanos. Asesoramiento sobre suplantación de identidad.","gl":"Liña gratuíta de axuda en ciberseguridade para cidadáns. Asesoramento sobre suplantación de identidade.","ca":"Línia gratuïta dajuda en ciberseguretat per a ciutadans. Assessorament sobre suplantació didentitat.","eu":"Hiritarrentzako zibersegurtasun laguntza doako lerroa. Identitate-uzurpenari buruzko aholkularitza."}'::jsonb,
    1
  ),
  (
    '{"es":"INCIBE - Canal de Denuncia de Ciberdelitos","gl":"INCIBE - Canal de Denuncia de Ciberdelitos","ca":"INCIBE - Canal de Denúncia de Ciberdelictes","eu":"INCIBE - Ziberdelitu Salaketa Kanala"}'::jsonb,
    'denuncia@incibe.es',
    '+34 900 116 117',
    'https://www.incibe.es/ciudadania/denuncia',
    '{"es":"Canal para denunciar ciberdelitos, fraude online y suplantación de identidad en internet.","gl":"Canal para denunciar ciberdelitos, fraude online e suplantación de identidade en internet.","ca":"Canal per denunciar ciberdelictes, frau online i suplantació didentitat a internet.","eu":"Interneteko ziberdelituak, lineako iruzurra eta identitate-uzurpena salatzeko kanala."}'::jsonb,
    2
  ),
  (
    '{"es":"INCIBE - Alerta Antifraude","gl":"INCIBE - Alerta Antifraude","ca":"INCIBE - Alerta Antifrau","eu":"INCIBE - Iruzur Aurkezpen Alerta"}'::jsonb,
    'alerta@incibe.es',
    '+34 900 116 117',
    'https://www.incibe.es/alerta-antifraude',
    '{"es":"Sistema de alerta temprana para fraudes online y suplantación de identidad digital.","gl":"Sistema de alerta temperá para fraudes online e suplantación de identidade dixital.","ca":"Sistema dalerta primerenca per a fraus online i suplantació didentitat digital.","eu":"Lineako iruzur eta identitate digitalaren uzurpenentzako alerta goiztiarreko sistema."}'::jsonb,
    3
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'incibe';

-- OTHER
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"Policía Nacional - Bloqueo de Documentos","gl":"Policía Nacional - Bloqueo de Documentos","ca":"Policia Nacional - Bloqueig de Documents","eu":"Polizia Nazionala - Dokumentu Blokeoa"}'::jsonb,
    '',
    '+34 900 102 112',
    'https://www.policia.es/orgjudicial/bloqueo_documentos',
    '{"es":"Servicio para bloquear el uso fraudulento del DNI o pasaporte en caso de robo o pérdida.","gl":"Servizo para bloquear o uso fraudulento do DNI ou pasaporte en caso de roubo ou perda.","ca":"Servei per bloquejar lús fraudulènt del DNI o passaport en cas de robatori o pèrdua.","eu":"Lapurretaren edo galeraren kasuan DNI edo pasaportearen erabilera iruzurtia blokeatzeko zerbitzua."}'::jsonb,
    1
  ),
  (
    '{"es":"Documento Nacional de Identidad - Sede Electrónica","gl":"Documento Nacional de Identidade - Sede Electrónica","ca":"Document Nacional dIdentitat - Seu Electrònica","eu":"Nortasun Agiri Nazionala - Egoitza Elektronikoa"}'::jsonb,
    '',
    '+34 060',
    'https://www.dnielectronico.es',
    '{"es":"Gestión del DNI electrónico. Revocación en caso de suplantación o robo de datos.","gl":"Xestión do DNI electrónico. Revocación en caso de suplantación ou roubo de datos.","ca":"Gestió del DNI electrònic. Revocació en cas de suplantació o robatori de dades.","eu":"DNI elektronikoaren kudeaketa. Uzurpen edo datu-lapurretaren kasuan errebokazioa."}'::jsonb,
    2
  ),
  (
    '{"es":"Brigada de Investigación Tecnológica (BIT)","gl":"Brigada de Investigación Tecnolóxica (BIT)","ca":"Brigada dInvestigació Tecnològica (BIT)","eu":"Ikerketa Teknologikoko Brigada (BIT)"}'::jsonb,
    'bit@policia.es',
    '+34 913 225 000',
    'https://www.policia.es/bit',
    '{"es":"Brigada especializada en delitos tecnológicos y suplantación de identidad digital.","gl":"Brigada especializada en delitos tecnolóxicos e suplantación de identidade dixital.","ca":"Brigada especialitzada en delictes tecnològics i suplantació didentitat digital.","eu":"Delitu teknologiko eta identitate digitalaren uzurpenean espezializatutako brigada."}'::jsonb,
    3
  ),
  (
    '{"es":"Oficina de Seguridad del Internauta","gl":"Oficina de Seguridade do Internauta","ca":"Oficina de Seguretat de lInternauta","eu":"Internet Erabiltzailearen Segurtasun Bulegoa"}'::jsonb,
    'info@osim.es',
    '+34 900 868 678',
    'https://www.osi.es',
    '{"es":"Oficina de seguridad del internauta para prevención y denuncia de fraude online.","gl":"Oficina de seguridade do internauta para prevención e denuncia de fraude online.","ca":"Oficina de seguretat de linternauta per a prevenció i denúncia de frau online.","eu":"Internet erabiltzailearen segurtasun bulegoa lineako iruzur prebentzio eta salaketarako."}'::jsonb,
    4
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'other';