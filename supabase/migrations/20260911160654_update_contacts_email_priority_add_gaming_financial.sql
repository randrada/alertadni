/*
# Update contacts: email priority, remove non-security phones, add gaming + financial products

## Overview
1. Deletes ALL existing contacts and categories.
2. Re-creates 8 categories (adds "gaming" and "financial_products").
3. Re-seeds all contacts with EMAIL as the primary contact method.
4. Phones removed unless specifically for security/fraud reporting.
5. "DNI blocking" replaced with "DNI renewal" (renovación).
6. New category: Gaming (DGOJ) — control over online gambling platforms.
7. New category: Financial products — how to obtain your contracted financial products online (CIRBE).

## Categories (8)
1. financial — Entidades financieras (banks)
2. telecom — Operadoras de telefonía e internet
3. police — Fuerzas y cuerpos de seguridad
4. aepd — Agencia Española de Protección de Datos
5. incibe — Instituto Nacional de Ciberseguridad
6. gaming — Control de plataformas de juego online (DGOJ)
7. financial_products — Consulta de productos financieros contratados (CIRBE)
8. other — Otros trámites y servicios

## Security
No changes to RLS policies (already set on tables). Categories/contacts
policies remain: public SELECT, authenticated INSERT/UPDATE/DELETE.
*/

-- ============================================================
-- CLEAR EXISTING DATA
-- ============================================================

DELETE FROM contacts;
DELETE FROM categories;

-- ============================================================
-- RE-SEED CATEGORIES (8 categories)
-- ============================================================

INSERT INTO categories (key, name, description, icon, sort_order) VALUES
(
  'financial',
  '{"es":"Entidades financieras","gl":"Entidades financeiras","ca":"Entitats financeres","eu":"Erakunde finantzarioak"}',
  '{"es":"Bancos y cajas para notificar suplantación de identidad o fraude por filtración de datos.","gl":"Bancos e caixas para notificar suplantación de identidade ou fraude por filtración de datos.","ca":"Bancs i caixes per notificar suplantació didentitat o frau per filtració de dades.","eu":"Bankuak eta kutxak identitate-uzurpena edo datu-filtraketagatiko iruzurra jakinarazteko."}',
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
  'gaming',
  '{"es":"Control de plataformas de juego online","gl":"Control de plataformas de xogo online","ca":"Control de plataformes de joc online","eu":"Lineako joko plataformen kontrola"}',
  '{"es":"DGOJ: autoexclusión y control sobre plataformas de juego online para prevenir suplantación.","gl":"DGOJ: autoexclusión e control sobre plataformas de xogo online para previr suplantación.","ca":"DGOJ: autoexclusió i control sobre plataformes de joc online per prevenir suplantació.","eu":"DGOJ: lineako joko plataformen gaineko autobaztertzea eta kontrola uzurpena prebenitzeko."}',
  'gamepad-2',
  6
),
(
  'financial_products',
  '{"es":"Consulta de productos financieros contratados","gl":"Consulta de produtos financeiros contratados","ca":"Consulta de productes financers contractats","eu":"Kontratatutako produktu finantzarioen kontsulta"}',
  '{"es":"CIRBE y otros servicios para obtener información sobre tus productos financieros contratados online.","gl":"CIRBE e outros servizos para obter información sobre os teus produtos financeiros contratados online.","ca":"CIRBE i altres serveis per obtenir informació sobre els teus productes financers contractats online.","eu":"CIRBE eta beste zerbitzu batzuk linean kontratatutako produktu finantzarioei buruzko informazioa lortzeko."}',
  'credit-card',
  7
),
(
  'other',
  '{"es":"Otros trámites y servicios","gl":"Outros trámites e servizos","ca":"Altres tràmits i serveis","eu":"Beste izapideak eta zerbitzuak"}',
  '{"es":"Renovación de DNI y otros trámites útiles en caso de suplantación de identidad.","gl":"Renovación de DNI e outros trámites útiles en caso de suplantación de identidade.","ca":"Renovació del DNI i altres tràmits útils en cas de suplantació didentitat.","eu":"DNI berritzea eta beste izapide erabilgarriak identitate-uzurpen kasuan."}',
  'building2',
  8
)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- RE-SEED CONTACTS
-- ============================================================

-- FINANCIAL (email-prioritized, phones only for security)
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"Banco de España","gl":"Banco de España","ca":"Banc dEspanya","eu":"Espainiako Bankua"}'::jsonb,
    'atencion.usuario@bde.es',
    NULL,
    'https://www.bde.es',
    '{"es":"Banco central supervisor. Atención al usuario para consultas y reclamaciones. Gestiona la CIRBE.","gl":"Banco central supervisor. Atención ao usuario para consultas e reclamacións. Xestiona a CIRBE.","ca":"Banc central supervisor. Atenció a lusuari per a consultes i reclamacions. Gestiona la CIRBE.","eu":"Banku zentraleko arduraduna. Erabiltzailearentzako arreta kontsultak eta erreklamazioetarako. CIRBE kudeatzen du."}'::jsonb,
    1
  ),
  (
    '{"es":"Banco Santander","gl":"Banco Santander","ca":"Banc Santander","eu":"Santander Bankua"}'::jsonb,
    'phishing@gruposantander.es',
    NULL,
    'https://www.bancosantander.es',
    '{"es":"Reenvía emails sospechosos de phishing a este buzón. Para fraude documental: recepciondocfraudes@gruposantander.es","gl":"Reenvía emails sospeitosos de phishing a este buzón. Para fraude documental: recepciondocfraudes@gruposantander.es","ca":"Reenvia correus sospitosos de phishing a aquesta bústia. Per a frau documental: recepciondocfraudes@gruposantander.es","eu":"Birbidali phishing-eko mezu susmagarriak postontzi honetara. Dokumentu-iruzurrerako: recepciondocfraudes@gruposantander.es"}'::jsonb,
    2
  ),
  (
    '{"es":"BBVA","gl":"BBVA","ca":"BBVA","eu":"BBVA"}'::jsonb,
    'denuncias.fraudes@bbva.com',
    NULL,
    'https://www.bbva.es',
    '{"es":"Canal de denuncia de fraude y suplantación de identidad para clientes.","gl":"Canal de denuncia de fraude e suplantación de identidade para clientes.","ca":"Canal de denúncia de frau i suplantació didentitat per a clients.","eu":"Bezeroentzako iruzur eta identitate-uzurpen salaketa kanala."}'::jsonb,
    3
  ),
  (
    '{"es":"CaixaBank","gl":"CaixaBank","ca":"CaixaBank","eu":"CaixaBank"}'::jsonb,
    'canaldenuncias.grupocaixabank@caixabank.com',
    NULL,
    'https://www.caixabank.es',
    '{"es":"Canal de denuncias del grupo CaixaBank para notificar fraude y suplantación de identidad.","gl":"Canal de denuncias do grupo CaixaBank para notificar fraude e suplantación de identidade.","ca":"Canal de denúncies del grup CaixaBank per notificar frau i suplantació didentitat.","eu":"CaixaBank taldeko salaketa kanala iruzurra eta identitate-uzurpena jakinarazteko."}'::jsonb,
    4
  ),
  (
    '{"es":"Banco Sabadell","gl":"Banco Sabadell","ca":"Banc Sabadell","eu":"Sabadell Bankua"}'::jsonb,
    'bancsabadell@bancsabadell.com',
    NULL,
    'https://www.bancsabadell.com',
    '{"es":"Contacto para notificar suplantación de identidad y bloqueo de cuentas bancarias.","gl":"Contacto para notificar suplantación de identidade e bloqueo de contas bancarias.","ca":"Contacte per notificar suplantació didentitat i bloqueig de comptes bancaris.","eu":"Identitate-uzurpena eta banku-kontuak blokeatzeko jakinarazpena egiteko kontaktua."}'::jsonb,
    5
  ),
  (
    '{"es":"Bankinter","gl":"Bankinter","ca":"Bankinter","eu":"Bankinter"}'::jsonb,
    'phishing@bankinter.com',
    NULL,
    'https://www.bankinter.com',
    '{"es":"Buzón para reportar correos fraudulentos que suplantan la identidad del banco.","gl":"Buzón para reportar correos fraudulentos que suplantan a identidade do banco.","ca":"Bústia per reportar correus fraudulents que suplanten la identitat del banc.","eu":"Bankuaren identitatea uzurtzen duten mezu iruzurtiak salatzeko postontzia."}'::jsonb,
    6
  ),
  (
    '{"es":"ING España","gl":"ING España","ca":"ING Espanya","eu":"ING Espainia"}'::jsonb,
    'informacion@ing.es',
    NULL,
    'https://www.ing.es',
    '{"es":"Banco online. Contacto para denunciar fraude y suplantación de identidad.","gl":"Banco en liña. Contacto para denunciar fraude e suplantación de identidade.","ca":"Banc en línia. Contacte per denunciar frau i suplantació didentitat.","eu":"Lineako bankua. Iruzur eta identitate-uzurpena salatzeko kontaktua."}'::jsonb,
    7
  ),
  (
    '{"es":"Unicaja Banco","gl":"Unicaja Banco","ca":"Unicaja Banc","eu":"Unicaja Bankua"}'::jsonb,
    'buzonseguridad@unicaja.es',
    NULL,
    'https://www.unicaja.es',
    '{"es":"Buzón de seguridad para notificar suplantación de identidad y fraude.","gl":"Buzón de seguridade para notificar suplantación de identidade e fraude.","ca":"Bústia de seguretat per notificar suplantació didentitat i frau.","eu":"Identitate-uzurpena eta iruzurra jakinarazteko segurtasun postontzia."}'::jsonb,
    8
  ),
  (
    '{"es":"Ibercaja","gl":"Ibercaja","ca":"Ibercaja","eu":"Ibercaja"}'::jsonb,
    'seguridad@ibercaja.es',
    NULL,
    'https://www.ibercaja.es',
    '{"es":"Canal de seguridad para notificación de fraude y acceso no autorizado a cuentas.","gl":"Canal de seguridade para notificación de fraude e acceso non autorizado a contas.","ca":"Canal de seguretat per notificació de frau i accés no autoritzat a comptes.","eu":"Iruzur eta baimenikoko kontuetarako sarbidea jakinarazteko segurtasun kanala."}'::jsonb,
    9
  ),
  (
    '{"es":"Kutxabank","gl":"Kutxabank","ca":"Kutxabank","eu":"Kutxabank"}'::jsonb,
    'seguridad@kutxabank.es',
    NULL,
    'https://www.kutxabank.es',
    '{"es":"Caja de ahorros del País Vasco. Canal de seguridad para fraude y suplantación.","gl":"Caixa de aforros do País Vasco. Canal de seguridade para fraude e suplantación.","ca":"Caixa destalvi del País Basc. Canal de seguretat per a frau i suplantació.","eu":"Euskal Herriko aurrezki kutxa. Iruzur eta uzurpenarentzako segurtasun kanala."}'::jsonb,
    10
  ),
  (
    '{"es":"Abanca","gl":"Abanca","ca":"Abanca","eu":"Abanca"}'::jsonb,
    'seguridad@abanca.es',
    NULL,
    'https://www.abanca.es',
    '{"es":"Canal de seguridad para suplantación de identidad y fraude financiero.","gl":"Canal de seguridade para suplantación de identidade e fraude financeiro.","ca":"Canal de seguretat per a suplantació didentitat i frau financer.","eu":"Identitate-uzurpen eta iruzur finantzarioarentzako segurtasun kanala."}'::jsonb,
    11
  ),
  (
    '{"es":"Cajasur","gl":"Cajasur","ca":"Cajasur","eu":"Cajasur"}'::jsonb,
    'seguridad@cajasur.es',
    NULL,
    'https://www.cajasur.es',
    '{"es":"Canal de seguridad para fraude y suplantación de identidad.","gl":"Canal de seguridade para fraude e suplantación de identidade.","ca":"Canal de seguretat per a frau i suplantació didentitat.","eu":"Iruzur eta identitate-uzurpenarentzako segurtasun kanala."}'::jsonb,
    12
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'financial';

-- TELECOM (email-prioritized, no phones unless security-specific)
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"Movistar","gl":"Movistar","ca":"Movistar","eu":"Movistar"}'::jsonb,
    'denuncias.fraude@telefonica.com',
    NULL,
    'https://www.movistar.es',
    '{"es":"Buzón de fraude del grupo Telefónica para reportar suplantación de identidad en líneas móviles y fijas.","gl":"Buzón de fraude do grupo Telefónica para reportar suplantación de identidade en liñas móviles e fixas.","ca":"Bústia de frau del grup Telefónica per reportar suplantació didentitat en línies mòbils i fixes.","eu":"Telefónica taldeko iruzur postontzia mugikor eta finko lerroetako identitate-uzurpena salatzeko."}'::jsonb,
    1
  ),
  (
    '{"es":"Vodafone España","gl":"Vodafone España","ca":"Vodafone Espanya","eu":"Vodafone Espainia"}'::jsonb,
    'fraud.report@vodafone.com',
    NULL,
    'https://www.vodafone.es',
    '{"es":"Canal de fraude para reportar suplantación o uso fraudulento de líneas.","gl":"Canal de fraude para reportar suplantación ou uso fraudulento de liñas.","ca":"Canal de frau per reportar suplantació o ús fraudulènt de línies.","eu":"Lerroen usurpazioa edo erabilera iruzurtia salatzeko iruzur kanala."}'::jsonb,
    2
  ),
  (
    '{"es":"Orange España","gl":"Orange España","ca":"Orange Espanya","eu":"Orange Espainia"}'::jsonb,
    'fraude@orange.es',
    NULL,
    'https://www.orange.es',
    '{"es":"Canal para notificación de suplantación y uso fraudulento de servicios.","gl":"Canal para notificación de suplantación e uso fraudulento de servizos.","ca":"Canal per notificació de suplantació i ús fraudulènt de serveis.","eu":"Uzurpen eta zerbitzuen erabilera iruzurtiaren jakinarazpen kanala."}'::jsonb,
    3
  ),
  (
    '{"es":"MásMóvil","gl":"MásMóvil","ca":"MásMóvil","eu":"MásMóvil"}'::jsonb,
    'seguridad@masmovil.com',
    NULL,
    'https://www.masmovil.es',
    '{"es":"Canal de seguridad del grupo MásMóvil para denuncia de fraude y suplantación.","gl":"Canal de seguridade do grupo MásMóbil para denuncia de fraude e suplantación.","ca":"Canal de seguretat del grup MásMóvil per denúncia de frau i suplantació.","eu":"MásMóvil taldeko segurtasun kanala iruzur eta uzurpen salaketarako."}'::jsonb,
    4
  ),
  (
    '{"es":"Digi España","gl":"Digi España","ca":"Digi Espanya","eu":"Digi Espainia"}'::jsonb,
    'soporte@digimobil.es',
    NULL,
    'https://www.digimobil.es',
    '{"es":"Soporte para reportar suplantación de identidad en líneas móviles.","gl":"Soporte para reportar suplantación de identidade en liñas móviles.","ca":"Suport per reportar suplantació didentitat en línies mòbils.","eu":"Mugikor lerroetako identitate-uzurpena salatzeko laguntza."}'::jsonb,
    5
  ),
  (
    '{"es":"Lowi","gl":"Lowi","ca":"Lowi","eu":"Lowi"}'::jsonb,
    'info@lowi.es',
    NULL,
    'https://www.lowi.es',
    '{"es":"Operadora de Vodafone. Contacto para reportar fraude y suplantación.","gl":"Operadora de Vodafone. Contacto para reportar fraude e suplantación.","ca":"Operadora de Vodafone. Contacte per reportar frau i suplantació.","eu":"Vodafoneren operadorea. Iruzur eta uzurpena salatzeko kontaktua."}'::jsonb,
    6
  ),
  (
    '{"es":"Pepephone","gl":"Pepephone","ca":"Pepephone","eu":"Pepephone"}'::jsonb,
    'ayuda@pepephone.com',
    NULL,
    'https://www.pepephone.com',
    '{"es":"Operadora del Grupo MásMóvil. Contacto para fraude y suplantación.","gl":"Operadora do Grupo MásMóbil. Contacto para fraude e suplantación.","ca":"Operadora del Grup MásMóvil. Contacte per a frau i suplantació.","eu":"MásMóvil Taldeko operadorea. Iruzur eta uzurpenentzako kontaktua."}'::jsonb,
    7
  ),
  (
    '{"es":"Finetwork","gl":"Finetwork","ca":"Finetwork","eu":"Finetwork"}'::jsonb,
    'soporte@finetwork.com',
    NULL,
    'https://www.finetwork.com',
    '{"es":"Operadora de fibra y móvil. Contacto para suplantación de identidad.","gl":"Operadora de fibra e móbil. Contacto para suplantación de identidade.","ca":"Operadora de fibra i mòbil. Contacte per a suplantació didentitat.","eu":"Zuntz eta mugikorreko operadorea. Identitate-uzurpenentzako kontaktua."}'::jsonb,
    8
  ),
  (
    '{"es":"O2","gl":"O2","ca":"O2","eu":"O2"}'::jsonb,
    'contacto@o2online.es',
    NULL,
    'https://www.o2online.es',
    '{"es":"Operadora de Telefónica. Contacto para fraude y suplantación.","gl":"Operadora de Telefónica. Contacto para fraude e suplantación.","ca":"Operadora de Telefónica. Contacte per a frau i supantació.","eu":"Telefónicaren operadorea. Iruzur eta uzurpenentzako kontaktua."}'::jsonb,
    9
  ),
  (
    '{"es":"Simyo","gl":"Simyo","ca":"Simyo","eu":"Simyo"}'::jsonb,
    'soporte@simyo.es',
    NULL,
    'https://www.simyo.es',
    '{"es":"Operadora de KPN. Contacto para denuncia de fraude.","gl":"Operadora de KPN. Contacto para denuncia de fraude.","ca":"Operadora de KPN. Contacte per denúncia de frau.","eu":"KPNren operadorea. Iruzur salaketarako kontaktua."}'::jsonb,
    10
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'telecom';

-- POLICE (keep security-specific phones, add emails where available)
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"Guardia Civil - Grupo de Delitos Telemáticos","gl":"Guardia Civil - Grupo de Delitos Telemáticos","ca":"Guàrdia Civil - Grup de Delictes Telemàtics","eu":"Guardia Zibila - Delitu Telematikoen Taldea"}'::jsonb,
    'gdt@guardiacivil.es',
    '+34 900 105 365',
    'https://www.guardiacivil.es',
    '{"es":"Denuncia de delitos telemáticos, suplantación de identidad y robo de datos personales. Línea de denuncia 24h.","gl":"Denuncia de delitos telemáticos, suplantación de identidade e roubo de datos persoais. Liña de denuncia 24h.","ca":"Denúncia de delictes telemàtics, suplantació didentitat i robatori de dades personals. Línia de denúncia 24h.","eu":"Delitu telematikoen, identitate-uzurpenaren eta datu pertsonalen lapurreten salaketa. 24h-eko salaketa lerroa."}'::jsonb,
    1
  ),
  (
    '{"es":"Cuerpo Nacional de Policía - Unidad de Ciberdelincuencia","gl":"Corpo Nacional de Policía - Unidade de Ciberdelincuencia","ca":"Cos Nacional de Policia - Unitat de Ciberdelinqüència","eu":"Polizia Nazionalaren Gorputza - Ziberkriminalitate Unitatea"}'::jsonb,
    'ciberdelincuencia@policia.es',
    '+34 091',
    'https://www.policia.es',
    '{"es":"Denuncia de ciberdelitos y suplantación de identidad en internet. Teléfono de emergencias 091.","gl":"Denuncia de ciberdelitos e suplantación de identidade en internet. Teléfono de emerxencias 091.","ca":"Denúncia de ciberdelictes i suplantació didentitat a internet. Telèfon demergències 091.","eu":"Interneteko ziberdelitu eta identitate-uzurpen salaketa. Larrialdi telefonoa 091."}'::jsonb,
    2
  ),
  (
    '{"es":"Ertzaintza - Ciberdelincuencia","gl":"Ertzaintza - Ciberdelincuencia","ca":"Ertzaintza - Ciberdelinqüència","eu":"Ertzaintza - Ziberkriminalitatea"}'::jsonb,
    'info@ertzaintza.eus',
    NULL,
    'https://www.ertzaintza.eus',
    '{"es":"Policía autonómica del País Vasco. Denuncia de delitos telemáticos y suplantación de identidad.","gl":"Policía autonómica do País Vasco. Denuncia de delitos telemáticos e suplantación de identidade.","ca":"Policia autonòmica del País Basc. Denúncia de delictes telemàtics i suplantació didentitat.","eu":"Euskal Herriko polizia autonomikoa. Delitu telematikoen eta identitate-uzurpenaren salaketa."}'::jsonb,
    3
  ),
  (
    '{"es":"Mossos dEsquadra - Área de Ciberdelincuencia","gl":"Mossos dEsquadra - Área de Ciberdelincuencia","ca":"Mossos dEsquadra - Àrea de Ciberdelinqüència","eu":"Mossos dEsquadra - Ziberkriminalitate Area"}'::jsonb,
    'ciberdelinquencia@ Mossos.gencat.cat',
    NULL,
    'https://mossos.gencat.cat',
    '{"es":"Policía autonómica de Cataluña. Denuncia de suplantación de identidad y delitos telemáticos.","gl":"Policía autonómica de Cataluña. Denuncia de suplantación de identidade e delitos telemáticos.","ca":"Policia autonòmica de Catalunya. Denúncia de suplantació didentitat i delictes telemàtics.","eu":"Kataluniako polizia autonomikoa. Identitate-uzurpen eta delitu telematikoen salaketa."}'::jsonb,
    4
  ),
  (
    '{"es":"Policía Foral de Navarra","gl":"Policía Foral de Navarra","ca":"Policia Foral de Navarra","eu":"Nafarroako Foru Polizia"}'::jsonb,
    'info@policiaforal.navarra.es',
    NULL,
    'https://www.navarra.es/policiaforal',
    '{"es":"Policía autonómica de Navarra. Canal de denuncia de fraude y suplantación.","gl":"Policía autonómica de Navarra. Canal de denuncia de fraude e suplantación.","ca":"Policia autonòmica de Navarra. Canal de denúncia de frau i suplantació.","eu":"Nafarroako polizia autonomikoa. Iruzur eta uzurpen salaketa kanala."}'::jsonb,
    5
  ),
  (
    '{"es":"Policía Local (general)","gl":"Policía Local (xeral)","ca":"Policia Local (general)","eu":"Polizia Lokala (orokorra)"}'::jsonb,
    NULL,
    '+34 092',
    NULL,
    '{"es":"Policía local para denuncias presenciales de suplantación de identidad. Teléfono de emergencias 092.","gl":"Policía local para denuncias presenciais de suplantación de identidade. Teléfono de emerxencias 092.","ca":"Policia local per a denúncies presencials de suplantació didentitat. Telèfon demergències 092.","eu":"Identitate-uzurpen salaketa presentzialak egiteko polizia lokala. Larrialdi telefonoa 092."}'::jsonb,
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
    NULL,
    'https://sedeagpd.gob.es',
    '{"es":"Sede electrónica de la AEPD para reclamaciones y denuncias por filtración de datos personales.","gl":"Sede electrónica da AEPD para reclamacións e denuncias por filtración de datos persoais.","ca":"Seu electrònica de lAEPD per a reclamacions i denúncies per filtració de dades personals.","eu":"AEPDren egoitza elektronikoa datu pertsonalen filtrazioagatiko erreklamazio eta salaketetarako."}'::jsonb,
    1
  ),
  (
    '{"es":"AEPD - Canal de Reclamaciones","gl":"AEPD - Canal de Reclamacións","ca":"AEPD - Canal de Reclamacions","eu":"AEPD - Erreklamazio Kanala"}'::jsonb,
    'reclamaciones@agpd.es',
    NULL,
    'https://www.aepd.es',
    '{"es":"Canal específico para presentar reclamaciones por vulneración de derechos de protección de datos.","gl":"Canal específico para presentar reclamacións por vulneración de dereitos de protección de datos.","ca":"Canal específic per presentar reclamacions per vulneració de drets de protecció de dades.","eu":"Datu babeseko eskubideen urraketarako erreklamazioak aurkezteko kanal espezifikoa."}'::jsonb,
    2
  ),
  (
    '{"es":"AEPD - Inspección de Datos","gl":"AEPD - Inspección de Datos","ca":"AEPD - Inspecció de Dades","eu":"AEPD - Datu Ikuskaritza"}'::jsonb,
    'inspeccion@agpd.es',
    NULL,
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
    '{"es":"Línea gratuita 24h de ayuda en ciberseguridad para ciudadanos. Asesoramiento sobre suplantación de identidad.","gl":"Liña gratuíta 24h de axuda en ciberseguridade para cidadáns. Asesoramento sobre suplantación de identidade.","ca":"Línia gratuïta 24h dajuda en ciberseguretat per a ciutadans. Assessorament sobre suplantació didentitat.","eu":"Hiritarrentzako zibersegurtasun laguntza doako lerroa 24h. Identitate-uzurpenari buruzko aholkularitza."}'::jsonb,
    1
  ),
  (
    '{"es":"INCIBE - Canal de Denuncia de Ciberdelitos","gl":"INCIBE - Canal de Denuncia de Ciberdelitos","ca":"INCIBE - Canal de Denúncia de Ciberdelictes","eu":"INCIBE - Ziberdelitu Salaketa Kanala"}'::jsonb,
    'denuncia@incibe.es',
    NULL,
    'https://www.incibe.es/ciudadania/denuncia',
    '{"es":"Canal para denunciar ciberdelitos, fraude online y suplantación de identidad en internet.","gl":"Canal para denunciar ciberdelitos, fraude online e suplantación de identidade en internet.","ca":"Canal per denunciar ciberdelictes, frau online i suplantació didentitat a internet.","eu":"Interneteko ziberdelituak, lineako iruzurra eta identitate-uzurpena salatzeko kanala."}'::jsonb,
    2
  ),
  (
    '{"es":"INCIBE - Alerta Antifraude","gl":"INCIBE - Alerta Antifraude","ca":"INCIBE - Alerta Antifrau","eu":"INCIBE - Iruzur Aurkezpen Alerta"}'::jsonb,
    'alerta@incibe.es',
    NULL,
    'https://www.incibe.es/alerta-antifraude',
    '{"es":"Sistema de alerta temprana para fraudes online y suplantación de identidad digital.","gl":"Sistema de alerta temperá para fraudes online e suplantación de identidade dixital.","ca":"Sistema dalerta primerenca per a fraus online i suplantació didentitat digital.","eu":"Lineako iruzur eta identitate digitalaren uzurpenentzako alerta goiztiarreko sistema."}'::jsonb,
    3
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'incibe';

-- GAMING (DGOJ - control de plataformas de juego online)
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"DGOJ - Sede Electrónica","gl":"DGOJ - Sede Electrónica","ca":"DGOJ - Seu Electrònica","eu":"DGOJ - Egoitza Elektronikoa"}'::jsonb,
    'sede.ordenacionjuego@mincotur.es',
    NULL,
    'https://sede.ordenacionjuego.gob.es',
    '{"es":"Sede electrónica de la Dirección General de Ordenación del Juego para trámites de autoexclusión y alerta de suplantación de identidad.","gl":"Sede electrónica da Dirección Xeral de Ordenación do Xogo para trámites de autoexclusión e alerta de suplantación de identidade.","ca":"Seu electrònica de la Direcció General dOrdenació del Joc per a tràmits dautoexclusió i alerta de suplantació didentitat.","eu":"Jokoaren Antolaketako Zuzendaritza Nagusiaren egoitza elektronikoa autobaztertze eta identitate-uzurpen alerta izapideetarako."}'::jsonb,
    1
  ),
  (
    '{"es":"DGOJ - Alerta Suplantación de Identidad","gl":"DGOJ - Alerta Suplantación de Identidade","ca":"DGOJ - Alerta Suplantació dIdentitat","eu":"DGOJ - Identitate Uzurpen Alerta"}'::jsonb,
    'alerta.suplantacion@ordenacionjuego.es',
    NULL,
    'https://www.ordenacionjuego.es',
    '{"es":"Servicio específico de la DGOJ para alertar sobre suplantación de identidad en plataformas de juego online.","gl":"Servizo específico da DGOJ para alertar sobre suplantación de identidade en plataformas de xogo online.","ca":"Servei específic de la DGOJ per alertar sobre suplantació didentitat en plataformes de joc online.","eu":"DGOJren zerbitzu espezifikoa lineako joko plataformetako identitate-uzurpenari buruz alerta emateko."}'::jsonb,
    2
  ),
  (
    '{"es":"DGOJ - Registro General de Interdicciones de Acceso al Juego","gl":"DGOJ - Rexistro Xeral de Interdicións de Acceso ao Xogo","ca":"DGOJ - Registre General dInterdiccions dAccés al Joc","eu":"DGOJ - Jokorako Sarbideko Debeku Erregistro Nagusia"}'::jsonb,
    'rgiaj@ordenacionjuego.es',
    NULL,
    'https://sede.ordenacionjuego.gob.es',
    '{"es":"Registro para inscribirse en la autoexclusión de plataformas de juego online. Impide el acceso a operadores de juego.","gl":"Rexistro para inscribirse na autoexclusión de plataformas de xogo online. Impide o acceso a operadores de xogo.","ca":"Registre per inscriure-se en lautoexclusió de plataformes de joc online. Impedeix laccés a operadors de joc.","eu":"Lineako joko plataformetako autobaztertzean izena emateko erregistroa. Joko operadoreetarako sarbidea eragozten du."}'::jsonb,
    3
  ),
  (
    '{"es":"DGOJ - Portal del Jugador","gl":"DGOJ - Portal do Xogador","ca":"DGOJ - Portal del Jugador","eu":"DGOJ - Jokalari Ataria"}'::jsonb,
    'info@ordenacionjuego.es',
    NULL,
    'https://www.ordenacionjuego.es/participantes-juego',
    '{"es":"Portal del jugador de la DGOJ con información sobre juego seguro, autoexclusión y prevención de suplantación.","gl":"Portal do xogador da DGOJ con información sobre xogo seguro, autoexclusión e prevención de suplantación.","ca":"Portal del jugador de la DGOJ amb informació sobre joc segur, autoexclusió i prevenció de suplantació.","eu":"DGOJren jokalari ataria joko seguruari, autobaztertzeari eta uzurpen prebentzioari buruzko informazioarekin."}'::jsonb,
    4
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'gaming';

-- FINANCIAL_PRODUCTS (CIRBE - consulta de productos financieros contratados)
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"CIRBE - Oficina Virtual del Banco de España","gl":"CIRBE - Oficina Virtual do Banco de España","ca":"CIRBE - Oficina Virtual del Banc dEspanya","eu":"CIRBE - Espainiako Bankuaren Bulego Birtuala"}'::jsonb,
    'cirbe@bde.es',
    NULL,
    'https://www.bde.es/cirbe',
    '{"es":"Consulta online y gratuita de la Central de Información de Riesgos del Banco de España. Necesitas certificado digital o DNI electrónico.","gl":"Consulta online e gratuíta da Central de Información de Riscos do Banco de España. Necesitas certificado dixital ou DNI electrónico.","ca":"Consulta online i gratuïta de la Central dInformació de Riscos del Banc dEspanya. Necessites certificat digital o DNI electrònic.","eu":"Espainiako Bankuaren Arrisku Informazio Zentralaren lineako eta doako kontsulta. Ziurtagiri digitala edo DNI elektronikoa behar duzu."}'::jsonb,
    1
  ),
  (
    '{"es":"Banco de España - Reclamaciones","gl":"Banco de España - Reclamacións","ca":"Banc dEspanya - Reclamacions","eu":"Espainiako Bankua - Erreklamazioak"}'::jsonb,
    'reclamaciones@bde.es',
    NULL,
    'https://www.bde.es/reclamaciones',
    '{"es":"Canal de reclamaciones del Banco de España si detectas productos financieros contratados a tu nombre que no reconoces.","gl":"Canal de reclamacións do Banco de España se detectas produtos financeiros contratados ao teu nome que non recoñeces.","ca":"Canal de reclamacions del Banc dEspanya si detectes productes financers contractats al teu nom que no reconeixes.","eu":"Zure izenean kontratatutako eta ezagutzen ez dituzun produktu finantzarioak antzematen badituzu, Espainiako Bankuaren erreklamazio kanala."}'::jsonb,
    2
  ),
  (
    '{"es":"CIRBE - Correo Postal","gl":"CIRBE - Correo Postal","ca":"CIRBE - Correu Postal","eu":"CIRBE - Posta"}'::jsonb,
    'cirbe@bde.es',
    NULL,
    'https://www.bde.es/cirbe',
    '{"es":"Solicita tu informe CIRBE por correo postal escribiendo a Banco de España, Calle Alcalá 48, 28014 Madrid, indicando tus datos personales.","gl":"Solicita o teu informe CIRBE por correo postal escribindo a Banco de España, Calle Alcalá 48, 28014 Madrid, indicando os teus datos persoais.","ca":"Sol·licita el teu informe CIRBE per correu postal escrivint a Banc dEspanya, Calle Alcalá 48, 28014 Madrid, indicant les teves dades personals.","eu":"Eskatu zure CIRBE txostena posta bidez Espainiako Bankuari idatziz, Calle Alcalá 48, 28014 Madrid, zure datu pertsonalak zehaztuz."}'::jsonb,
    3
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'financial_products';

-- OTHER (renovación de DNI en lugar de bloqueo)
INSERT INTO contacts (category_id, name, email, phone, website, description, sort_order)
SELECT c.id, v.name, v.email, v.phone, v.website, v.description, v.sort_order
FROM categories c, (VALUES
  (
    '{"es":"Renovación del DNI - Cita Previa","gl":"Renovación do DNI - Cita Previa","ca":"Renovació del DNI - Cita Prèvia","eu":"DNI berritzea - Aurrez hitzordua"}'::jsonb,
    NULL,
    NULL,
    'https://www.citapreviadnie.es',
    '{"es":"Solicita cita previa para renovar tu DNI electrónico en caso de suplantación de identidad o robo de datos. Trámite online.","gl":"Solicita cita previa para renovar o teu DNI electrónico en caso de suplantación de identidade ou roubo de datos. Trámite online.","ca":"Sol·licita cita prèvia per renovar el teu DNI electrònic en cas de suplantació didentitat o robatori de dades. Tràmit online.","eu":"Eskatu aurrez hitzordua zure DNI elektronikoa berritzeko identitate-uzurpen edo datu-lapurretaren kasuan. Lineako izapidea."}'::jsonb,
    1
  ),
  (
    '{"es":"DNI Electrónico - Soporte y Consultas","gl":"DNI Electrónico - Soporte e Consultas","ca":"DNI Electrònic - Suport i Consultes","eu":"DNI Elektronikoa - Laguntza eta Kontsultak"}'::jsonb,
    'sac@dnielectronico.es',
    NULL,
    'https://www.dnielectronico.es',
    '{"es":"Soporte del DNI electrónico para consultas sobre revocación, renovación y problemas con el certificado digital.","gl":"Soporte do DNI electrónico para consultas sobre revocación, renovación e problemas co certificado dixital.","ca":"Suport del DNI electrònic per a consultes sobre revocació, renovació i problemes amb el certificat digital.","eu":"DNI elektronikoaren laguntza errebokazio, berritze eta ziurtagiri digitalarekin arazoei buruzko kontsultetarako."}'::jsonb,
    2
  ),
  (
    '{"es":"Brigada de Investigación Tecnológica (BIT)","gl":"Brigada de Investigación Tecnolóxica (BIT)","ca":"Brigada dInvestigació Tecnològica (BIT)","eu":"Ikerketa Teknologikoko Brigada (BIT)"}'::jsonb,
    'bit@policia.es',
    NULL,
    'https://www.policia.es/bit',
    '{"es":"Brigada especializada en delitos tecnológicos y suplantación de identidad digital.","gl":"Brigada especializada en delitos tecnolóxicos e suplantación de identidade dixital.","ca":"Brigada especialitzada en delictes tecnològics i suplantació didentitat digital.","eu":"Delitu teknologiko eta identitate digitalaren uzurpenean espezializatutako brigada."}'::jsonb,
    3
  ),
  (
    '{"es":"Oficina de Seguridad del Internauta","gl":"Oficina de Seguridade do Internauta","ca":"Oficina de Seguretat de lInternauta","eu":"Internet Erabiltzailearen Segurtasun Bulegoa"}'::jsonb,
    'info@osi.es',
    NULL,
    'https://www.osi.es',
    '{"es":"Oficina de seguridad del internauta para prevención y denuncia de fraude online.","gl":"Oficina de seguridade do internauta para prevención e denuncia de fraude online.","ca":"Oficina de seguretat de linternauta per a prevenció i denúncia de frau online.","eu":"Internet erabiltzailearen segurtasun bulegoa lineako iruzur prebentzio eta salaketarako."}'::jsonb,
    4
  )
) AS v(name, email, phone, website, description, sort_order)
WHERE c.key = 'other';