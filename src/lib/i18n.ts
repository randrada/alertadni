import type { LangCode } from './types';

export const LANGUAGES: { code: LangCode; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'gl', label: 'Galego', flag: 'GL' },
  { code: 'ca', label: 'Català', flag: 'CA' },
  { code: 'eu', label: 'Euskara', flag: 'EU' },
];

type TranslationKey =
  | 'siteTitle'
  | 'siteSubtitle'
  | 'searchPlaceholder'
  | 'searchResults'
  | 'noResults'
  | 'noResultsDesc'
  | 'allCategories'
  | 'contactsCount'
  | 'contactCount'
  | 'email'
  | 'phone'
  | 'website'
  | 'visitWebsite'
  | 'admin'
  | 'adminLogin'
  | 'adminPanel'
  | 'emailPlaceholder'
  | 'passwordPlaceholder'
  | 'signIn'
  | 'signOut'
  | 'loading'
  | 'loginError'
  | 'loginPrompt'
  | 'addContact'
  | 'editContact'
  | 'addCategory'
  | 'editCategory'
  | 'deleteContact'
  | 'deleteCategory'
  | 'confirmDelete'
  | 'confirmDeleteContact'
  | 'confirmDeleteCategory'
  | 'cancel'
  | 'save'
  | 'delete'
  | 'edit'
  | 'name'
  | 'description'
  | 'icon'
  | 'iconPlaceholder'
  | 'sortOrder'
  | 'category'
  | 'selectCategory'
  | 'nameEs'
  | 'nameGl'
  | 'nameCa'
  | 'nameEu'
  | 'descEs'
  | 'descGl'
  | 'descCa'
  | 'descEu'
  | 'backToDirectory'
  | 'filterByCategory'
  | 'showing'
  | 'results'
  | 'of'
  | 'clearFilters'
  | 'introTitle'
  | 'introText'
  | 'howToReport'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step1Text'
  | 'step2Text'
  | 'step3Text'
  | 'quickGuide'
  | 'dataUpdated'
  | 'noContacts'
  | 'noContactsDesc'
  | 'requiredField'
  | 'errorLoading'
  | 'retry'
  | 'totalContacts'
  | 'totalCategories'
  | 'manageContacts'
  | 'manageCategories'
  | 'saving'
  | 'deleting'
  | 'loginSuccess'
  | 'updated'
  | 'created'
  | 'deleted'
  | 'errorSaving'
  | 'errorDeleting'
  | 'copy'
  | 'copied'
  | 'close'
  | 'viewAll'
  | 'collapse'
  | 'gamingCardTitle'
  | 'gamingCardText'
  | 'gamingCardAction'
  | 'gamingCardTitle2'
  | 'gamingCardText2'
  | 'gamingCardAction2'
  | 'financialCardTitle'
  | 'financialCardText'
  | 'financialCardAction'
  | 'verified'
  | 'unverified'
  | 'markVerified'
  | 'markUnverified';

const translations: Record<LangCode, Record<TranslationKey, string>> = {
  es: {
    siteTitle: 'AlertaDNI',
    siteSubtitle: 'Directorio para reportar suplantación de identidad por filtración de datos personales',
    searchPlaceholder: 'Buscar entidad, banco, operadora, organismo...',
    searchResults: 'Resultados de búsqueda',
    noResults: 'No se encontraron resultados',
    noResultsDesc: 'Prueba con otros términos de búsqueda o explora las categorías.',
    allCategories: 'Todas las categorías',
    contactsCount: 'contactos',
    contactCount: 'contacto',
    email: 'Email',
    phone: 'Teléfono',
    website: 'Web',
    visitWebsite: 'Visitar web',
    admin: 'Admin',
    adminLogin: 'Acceso administrador',
    adminPanel: 'Panel de administración',
    emailPlaceholder: 'correo@ejemplo.es',
    passwordPlaceholder: 'Contraseña',
    signIn: 'Iniciar sesión',
    signOut: 'Cerrar sesión',
    loading: 'Cargando...',
    loginError: 'Email o contraseña incorrectos',
    loginPrompt: 'Introduce tus credenciales para acceder al panel de gestión.',
    addContact: 'Añadir contacto',
    editContact: 'Editar contacto',
    addCategory: 'Añadir categoría',
    editCategory: 'Editar categoría',
    deleteContact: 'Eliminar contacto',
    deleteCategory: 'Eliminar categoría',
    confirmDelete: 'Confirmar eliminación',
    confirmDeleteContact: '¿Estás seguro de que deseas eliminar este contacto?',
    confirmDeleteCategory: '¿Estás seguro? Se eliminarán también todos los contactos de esta categoría.',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    name: 'Nombre',
    description: 'Descripción',
    icon: 'Icono (Lucide)',
    iconPlaceholder: 'shield',
    sortOrder: 'Orden',
    category: 'Categoría',
    selectCategory: 'Selecciona una categoría',
    nameEs: 'Nombre (Español)',
    nameGl: 'Nombre (Galego)',
    nameCa: 'Nombre (Català)',
    nameEu: 'Nombre (Euskara)',
    descEs: 'Descripción (Español)',
    descGl: 'Descripción (Galego)',
    descCa: 'Descripción (Català)',
    descEu: 'Descripción (Euskara)',
    backToDirectory: 'Volver al directorio',
    filterByCategory: 'Filtrar por categoría',
    showing: 'Mostrando',
    results: 'resultados',
    of: 'de',
    clearFilters: 'Limpiar filtros',
    introTitle: '¿Se ha filtrado la imagen de tu DNI?',
    introText: 'Si tus datos personales han sido expuestos en internet, puedes ser víctima de suplantación de identidad. Aquí encontrarás los contactos necesarios para notificarlo a las entidades pertinentes.',
    howToReport: '¿Qué hacer si se filtran tus datos?',
    step1: '1. Notifica a tu banco',
    step2: '2. Denuncia ante la policía',
    step3: '3. Renueva tu DNI',
    step1Text: 'Contacta con tu entidad bancaria para bloquear cuentas y prevenir fraudes financieros.',
    step2Text: 'Presenta denuncia ante las fuerzas de seguridad por suplantación de identidad.',
    step3Text: 'Solicita cita previa para renovar tu DNI. Ten en cuenta que en ocasiones pueden poner dificultades, especialmente si el DNI actual está en vigor: insiste en que tus datos han sido filtrados.',
    quickGuide: 'Guía rápida',
    dataUpdated: 'Datos actualizados',
    noContacts: 'No hay contactos en esta categoría',
    noContactsDesc: 'Añade contactos desde el panel de administración.',
    requiredField: 'Este campo es obligatorio',
    errorLoading: 'Error al cargar los datos. Revisa tu conexión.',
    retry: 'Reintentar',
    totalContacts: 'Contactos totales',
    totalCategories: 'Categorías',
    manageContacts: 'Gestionar contactos',
    manageCategories: 'Gestionar categorías',
    saving: 'Guardando...',
    deleting: 'Eliminando...',
    loginSuccess: 'Sesión iniciada correctamente',
    updated: 'Actualizado correctamente',
    created: 'Creado correctamente',
    deleted: 'Eliminado correctamente',
    errorSaving: 'Error al guardar',
    errorDeleting: 'Error al eliminar',
    copy: 'Copiar',
    copied: 'Copiado',
    close: 'Cerrar',
    viewAll: 'Ver todos',
    collapse: 'Contraer',
    gamingCardTitle: 'Alerta de suplantación de identidad en el juego',
    gamingCardText: 'Si temes que alguien esté usando tu identidad para jugar, notifícalo a la DGOJ mediante su formulario de alerta por suplantación de identidad. Es el primer paso que debes dar.',
    gamingCardAction: 'Notificar suplantación de identidad',
    gamingCardTitle2: 'Autoexclusión del juego online',
    gamingCardText2: 'Como medida más drástica, puedes inscribirte en el RGIAJ para autoexcluirte de todas las plataformas de juego online y bloquear cualquier actividad a tu nombre.',
    gamingCardAction2: 'Ver trámite de autoexclusión',
    financialCardTitle: 'Consulta tus productos financieros contratados',
    financialCardText: 'Mediante trámite online en la CIRBE del Banco de España puedes obtener un informe gratuito con todos los préstamos, créditos y productos financieros contratados a tu nombre. Necesitas certificado digital o DNI electrónico.',
    financialCardAction: 'Consultar CIRBE online',
    verified: 'Verificado',
    unverified: 'No verificado',
    markVerified: 'Marcar como verificado',
    markUnverified: 'Quitar verificación',
  },
  gl: {
    siteTitle: 'AlertaDNI',
    siteSubtitle: 'Directorio para reportar suplantación de identidade por filtración de datos persoais',
    searchPlaceholder: 'Buscar entidade, banco, operadora, organismo...',
    searchResults: 'Resultados da busca',
    noResults: 'Non se atoparon resultados',
    noResultsDesc: 'Proba con outros termos de busca ou explora as categorías.',
    allCategories: 'Todas as categorías',
    contactsCount: 'contactos',
    contactCount: 'contacto',
    email: 'Correo',
    phone: 'Teléfono',
    website: 'Web',
    visitWebsite: 'Visitar web',
    admin: 'Admin',
    adminLogin: 'Acceso administrador',
    adminPanel: 'Panel de administración',
    emailPlaceholder: 'correo@exemplo.gal',
    passwordPlaceholder: 'Contrasinal',
    signIn: 'Iniciar sesión',
    signOut: 'Pechar sesión',
    loading: 'Cargando...',
    loginError: 'Correo ou contrasinal incorrectos',
    loginPrompt: 'Introduce as túas credenciais para acceder ao panel de xestión.',
    addContact: 'Engadir contacto',
    editContact: 'Editar contacto',
    addCategory: 'Engadir categoría',
    editCategory: 'Editar categoría',
    deleteContact: 'Eliminar contacto',
    deleteCategory: 'Eliminar categoría',
    confirmDelete: 'Confirmar eliminación',
    confirmDeleteContact: 'Estás seguro de que desexas eliminar este contacto?',
    confirmDeleteCategory: 'Estás seguro? Eliminaranse tamén todos os contactos desta categoría.',
    cancel: 'Cancelar',
    save: 'Gardar',
    delete: 'Eliminar',
    edit: 'Editar',
    name: 'Nome',
    description: 'Descrición',
    icon: 'Icona (Lucide)',
    iconPlaceholder: 'shield',
    sortOrder: 'Orde',
    category: 'Categoría',
    selectCategory: 'Selecciona unha categoría',
    nameEs: 'Nome (Español)',
    nameGl: 'Nome (Galego)',
    nameCa: 'Nome (Català)',
    nameEu: 'Nome (Euskara)',
    descEs: 'Descrición (Español)',
    descGl: 'Descrición (Galego)',
    descCa: 'Descrición (Català)',
    descEu: 'Descrición (Euskara)',
    backToDirectory: 'Volver ao directorio',
    filterByCategory: 'Filtrar por categoría',
    showing: 'Mostrando',
    results: 'resultados',
    of: 'de',
    clearFilters: 'Limpar filtros',
    introTitle: 'Filtrouse a imaxe do teu DNI?',
    introText: 'Se os teus datos persoais foron expostos en internet, podes ser vítima de suplantación de identidade. Aquí atoparás os contactos necesarios para notificalo ás entidades pertinentes.',
    howToReport: 'Que facer se se filtran os teus datos?',
    step1: '1. Notifica ao teu banco',
    step2: '2. Denuncia ante a policía',
    step3: '3. Renova o teu DNI',
    step1Text: 'Contacta coa túa entidade bancaria para bloquear contas e previr fraudes financeiros.',
    step2Text: 'Presenta denuncia ante as forzas de seguridade por suplantación de identidade.',
    step3Text: 'Solicita cita previa para renovar o teu DNI. Ten en conta que en ocasións poden poñer dificultades, especialmente se o DNI actual está en vigor: insiste en que os teus datos foron filtrados.',
    quickGuide: 'Guía rápida',
    dataUpdated: 'Datos actualizados',
    noContacts: 'Non hai contactos nesta categoría',
    noContactsDesc: 'Engade contactos desde o panel de administración.',
    requiredField: 'Este campo é obrigatorio',
    errorLoading: 'Erro ao cargar os datos. Revisa a túa conexión.',
    retry: 'Reintentar',
    totalContacts: 'Contactos totais',
    totalCategories: 'Categorías',
    manageContacts: 'Xestionar contactos',
    manageCategories: 'Xestionar categorías',
    saving: 'Gardando...',
    deleting: 'Eliminando...',
    loginSuccess: 'Sesión iniciada correctamente',
    updated: 'Actualizado correctamente',
    created: 'Creado correctamente',
    deleted: 'Eliminado correctamente',
    errorSaving: 'Erro ao gardar',
    errorDeleting: 'Erro ao eliminar',
    copy: 'Copiar',
    copied: 'Copiado',
    close: 'Pechar',
    viewAll: 'Ver todos',
    collapse: 'Contraer',
    gamingCardTitle: 'Alerta de suplantación de identidade no xogo',
    gamingCardText: 'Se temes que alguén estea a usar a túa identidade para xogar, notifícao á DGOJ mediante o seu formulario de alerta por suplantación de identidade. É o primeiro paso que debes dar.',
    gamingCardAction: 'Notificar suplantación de identidade',
    gamingCardTitle2: 'Autoexclusión do xogo online',
    gamingCardText2: 'Como medida máis drástica, podes inscribirte no RGIAJ para autoexcluírte de todas as plataformas de xogo online e bloquear calquera actividade ao teu nome.',
    gamingCardAction2: 'Ver trámite de autoexclusión',
    financialCardTitle: 'Consulta os teus produtos financeiros contratados',
    financialCardText: 'Mediante trámite online na CIRBE do Banco de España podes obter un informe gratuíto con todos os préstamos, créditos e produtos financeiros contratados ao teu nome. Necesitas certificado dixital ou DNI electrónico.',
    financialCardAction: 'Consultar CIRBE online',
    verified: 'Verificado',
    unverified: 'Non verificado',
    markVerified: 'Marcar como verificado',
    markUnverified: 'Quitar verificación',
  },
  ca: {
    siteTitle: 'AlertaDNI',
    siteSubtitle: 'Directori per reportar suplantació didentitat per filtració de dades personals',
    searchPlaceholder: 'Buscar entitat, banc, operador, organisme...',
    searchResults: 'Resultats de la cerca',
    noResults: 'No ses van trobar resultats',
    noResultsDesc: 'Prova amb altres termes de cerca o explora les categories.',
    allCategories: 'Totes les categories',
    contactsCount: 'contactes',
    contactCount: 'contacte',
    email: 'Correu',
    phone: 'Telèfon',
    website: 'Web',
    visitWebsite: 'Visitar web',
    admin: 'Admin',
    adminLogin: 'Accés administrador',
    adminPanel: 'Panel dadministració',
    emailPlaceholder: 'correu@exemple.cat',
    passwordPlaceholder: 'Contrasenya',
    signIn: 'Iniciar sessió',
    signOut: 'Tancar sessió',
    loading: 'Carregant...',
    loginError: 'Correu o contrasenya incorrectes',
    loginPrompt: 'Introdueix les teves credencials per accedir al panell de gestió.',
    addContact: 'Afegir contacte',
    editContact: 'Editar contacte',
    addCategory: 'Afegir categoria',
    editCategory: 'Editar categoria',
    deleteContact: 'Eliminar contacte',
    deleteCategory: 'Eliminar categoria',
    confirmDelete: 'Confirmar eliminació',
    confirmDeleteContact: 'Estàs segur que vols eliminar aquest contacte?',
    confirmDeleteCategory: 'Estàs segur? Seliminaran també tots els contactes daquesta categoria.',
    cancel: 'Cancel·lar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    name: 'Nom',
    description: 'Descripció',
    icon: 'Icona (Lucide)',
    iconPlaceholder: 'shield',
    sortOrder: 'Ordre',
    category: 'Categoria',
    selectCategory: 'Selecciona una categoria',
    nameEs: 'Nom (Español)',
    nameGl: 'Nom (Galego)',
    nameCa: 'Nom (Català)',
    nameEu: 'Nom (Euskara)',
    descEs: 'Descripció (Español)',
    descGl: 'Descripció (Galego)',
    descCa: 'Descripció (Català)',
    descEu: 'Descripció (Euskara)',
    backToDirectory: 'Tornar al directori',
    filterByCategory: 'Filtrar per categoria',
    showing: 'Mostrant',
    results: 'resultats',
    of: 'de',
    clearFilters: 'Netejar filtres',
    introTitle: 'Sha filtrat la imatge del teu DNI?',
    introText: 'Si les teves dades personals han estat exposades a internet, pots ser víctima de suplantació didentitat. Aquí trobaràs els contactes necessaris per notificar-ho a les entitats pertinents.',
    howToReport: 'Què fer si es filtren les teves dades?',
    step1: '1. Notifica al teu banc',
    step2: '2. Denuncia a la policia',
    step3: '3. Renova el teu DNI',
    step1Text: 'Contacta amb la teva entitat bancària per bloquejar comptes i prevenir fraus financers.',
    step2Text: 'Presenta denúncia a les forces de seguretat per suplantació didentitat.',
    step3Text: 'Sol·licita cita prèvia per renovar el teu DNI. Tingues en compte que en ocasions poden posar dificultats, especialment si el DNI actual està en vigor: insisteix que les teves dades han estat filtrades.',
    quickGuide: 'Guia ràpida',
    dataUpdated: 'Dades actualitzades',
    noContacts: 'No hi ha contactes en aquesta categoria',
    noContactsDesc: 'Afegeix contactes des del panell dadministració.',
    requiredField: 'Aquest camp és obligatori',
    errorLoading: 'Error en carregar les dades. Revisa la teva connexió.',
    retry: 'Reintentar',
    totalContacts: 'Contactes totals',
    totalCategories: 'Categories',
    manageContacts: 'Gestionar contactes',
    manageCategories: 'Gestionar categories',
    saving: 'Guardant...',
    deleting: 'Eliminant...',
    loginSuccess: 'Sessió iniciada correctament',
    updated: 'Actualitzat correctament',
    created: 'Creat correctament',
    deleted: 'Eliminat correctament',
    errorSaving: 'Error en guardar',
    errorDeleting: 'Error en eliminar',
    copy: 'Copiar',
    copied: 'Copiat',
    close: 'Tancar',
    viewAll: 'Ver tots',
    collapse: 'Contraure',
    gamingCardTitle: 'Alerta de suplantació didentitat al joc',
    gamingCardText: 'Si tems que algú estigui usant la teva identitat per jugar, notifica-ho a la DGOJ mitjançant el seu formulari dalerta per suplantació didentitat. És el primer pas que has de fer.',
    gamingCardAction: 'Notificar suplantació didentitat',
    gamingCardTitle2: 'Autoexclusió del joc online',
    gamingCardText2: 'Com a mesura més dràstica, pots inscriure-te al RGIAJ per autoexcloure-te de totes les plataformes de joc online i bloquejar qualsevol activitat al teu nom.',
    gamingCardAction2: 'Veure tràmit dautoexclusió',
    financialCardTitle: 'Consulta els teus productes financers contractats',
    financialCardText: 'Mitjançant tràmit online a la CIRBE del Banc dEspanya pots obtenir un informe gratuït amb tots els préstecs, crèdits i productes financers contractats al teu nom. Necessites certificat digital o DNI electrònic.',
    financialCardAction: 'Consultar CIRBE online',
    verified: 'Verificat',
    unverified: 'No verificat',
    markVerified: 'Marcar com a verificat',
    markUnverified: 'Treure verificació',
  },
  eu: {
    siteTitle: 'AlertaDNI',
    siteSubtitle: 'Datu pertsonalen filtrazioagatik identitate-uzurpena salatzeko direktorioa',
    searchPlaceholder: 'Bilatu erakundea, bankua, operadorea, organismoa...',
    searchResults: 'Bilaketaren emaitzak',
    noResults: 'Ez da emaitzarik aurkitu',
    noResultsDesc: 'Probatu beste bilaketa-termino batzuk edo esploratu kategoriak.',
    allCategories: 'Kategoria guztiak',
    contactsCount: 'kontaktu',
    contactCount: 'kontaktu',
    email: 'Posta elektronikoa',
    phone: 'Telefonoa',
    website: 'Web',
    visitWebsite: 'Bisitatu web',
    admin: 'Admin',
    adminLogin: 'Administratzaile sarbidea',
    adminPanel: 'Administrazio panela',
    emailPlaceholder: 'posta@adibidea.eus',
    passwordPlaceholder: 'Pasahitza',
    signIn: 'Saioa hasi',
    signOut: 'Saioa itxi',
    loading: 'Kargatzen...',
    loginError: 'Posta elektronikoa edo pasahitza okerrak',
    loginPrompt: 'Sartu zure kredentzialak kudeaketa panelera sartzeko.',
    addContact: 'Kontaktua gehitu',
    editContact: 'Kontaktua editatu',
    addCategory: 'Kategoria gehitu',
    editCategory: 'Kategoria editatu',
    deleteContact: 'Kontaktua ezabatu',
    deleteCategory: 'Kategoria ezabatu',
    confirmDelete: 'Ezabaketa berretsi',
    confirmDeleteContact: 'Ziur al zaude kontaktu hau ezabatu nahi duzula?',
    confirmDeleteCategory: 'Ziur al zaude? Kategoria honetako kontaktu guztiak ere ezabatuko dira.',
    cancel: 'Utzi',
    save: 'Gorde',
    delete: 'Ezabatu',
    edit: 'Editatu',
    name: 'Izena',
    description: 'Deskribapena',
    icon: 'Ikonoa (Lucide)',
    iconPlaceholder: 'shield',
    sortOrder: 'Ordena',
    category: 'Kategoria',
    selectCategory: 'Hautatu kategoria bat',
    nameEs: 'Izena (Español)',
    nameGl: 'Izena (Galego)',
    nameCa: 'Izena (Català)',
    nameEu: 'Izena (Euskara)',
    descEs: 'Deskribapena (Español)',
    descGl: 'Deskribapena (Galego)',
    descCa: 'Deskribapena (Català)',
    descEu: 'Deskribapena (Euskara)',
    backToDirectory: 'Direktoriora itzuli',
    filterByCategory: 'Kategoriaren arabera iragazi',
    showing: 'Erakusten',
    results: 'emaitzak',
    of: '/',
    clearFilters: 'Iragazkiak garbitu',
    introTitle: 'Zure DNIaren irudia iragazi da?',
    introText: 'Zure datu pertsonalak interneten argitaratu badira, identitate-uzurpenaren biktima izan zaitezke. Hemen aurkituko dituzu entitateei jakinarazteko beharrezkoak diren kontaktuak.',
    howToReport: 'Zer egin zure datuak iragazten badira?',
    step1: '1. Jakinarazi zure bankuari',
    step2: '2. Salatu polizian',
    step3: '3. Berritu zure DNIa',
    step1Text: 'Jarri harremanetan zure banku-erakundearekin kontuak blokeatzeko eta iruzur finantzarioak saihesteko.',
    step2Text: 'Aurkeztu salaketa segurtasun indarren aurrean identitate-uzurpenagatik.',
    step3Text: 'Eskatu aurrez hitzordua zure DNIa berritzeko. Kontuan izan batzuetan zailtasunak jar ditzaketela, batez ere uneko DNIa indarrean badago: insistitu zure datuak iragazi direla.',
    quickGuide: 'Gida azkarra',
    dataUpdated: 'Datu eguneratuak',
    noContacts: 'Ez dago kontakturik kategoria honetan',
    noContactsDesc: 'Gehitu kontaktuak administrazio paneletik.',
    requiredField: 'Eremu hau derrigorrezkoa da',
    errorLoading: 'Errorea datuak kargatzean. Egiaztatu zure konexioa.',
    retry: 'Berriz saiatu',
    totalContacts: 'Kontaktu guztiak',
    totalCategories: 'Kategoriak',
    manageContacts: 'Kontaktuak kudeatu',
    manageCategories: 'Kategoriak kudeatu',
    saving: 'Gordetzen...',
    deleting: 'Ezabatzen...',
    loginSuccess: 'Saioa ondo hasi da',
    updated: 'Ondo eguneratu da',
    created: 'Ondo sortu da',
    deleted: 'Ondo ezabatu da',
    errorSaving: 'Errorea gordetzean',
    errorDeleting: 'Errorea ezabatzean',
    copy: 'Kopiatu',
    copied: 'Kopiatuta',
    close: 'Itxi',
    viewAll: 'Guztiak ikusi',
    collapse: 'Tolestu',
    gamingCardTitle: 'Jokoan identitate-uzurpen alerta',
    gamingCardText: 'Norbaitek zure identitatea erabiltzen ari bada jokatzeko, jakinarazi DGOJri bere identitate-uzurpen alerta formularioaren bidez. Eman beharreko lehen urratsa da.',
    gamingCardAction: 'Jakinarazi identitate-uzurpena',
    gamingCardTitle2: 'Lineako jokoaren autobaztertzea',
    gamingCardText2: 'Neurri drastikoago gisa, RGIAJn izena eman dezakezu lineako joko plataforma guztietatik autobaztertzeko eta zure izenean edozein jarduera blokeatzeko.',
    gamingCardAction2: 'Ikusi autobaztertze izapidea',
    financialCardTitle: 'Kontsultatu kontratatutako produktu finantzarioak',
    financialCardText: 'Espainiako Bankuaren CIRBEren lineako izapidearen bidez doako txosten bat lor dezakezu zure izenean kontratatutako mailegu, kreditu eta produktu finantzario guztiekin. Ziurtagiri digitala edo DNI elektronikoa behar duzu.',
    financialCardAction: 'Kontsultatu CIRBE online',
    verified: 'Egiaztatuta',
    unverified: 'Egiaztatu gabe',
    markVerified: 'Markatu egiaztatuta bezala',
    markUnverified: 'Kendu egiaztapena',
  },
};

export function t(lang: LangCode, key: TranslationKey): string {
  return translations[lang][key] ?? translations.es[key] ?? key;
}

export function localizedText(text: { es: string; gl: string; ca: string; eu: string } | null, lang: LangCode): string {
  if (!text) return '';
  return text[lang] || text.es || '';
}
