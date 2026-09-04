# CAF FAPI Pianopoli — Frontend

Interfaccia web di un Centro di Assistenza Fiscale: sito pubblico con
il catalogo dei servizi e area amministrativa per la gestione di
clienti, pratiche, documenti, tesseramenti e agenda.

Capstone EPICODE — progetto full-stack diviso in due repository.

| | Repository |
|---|---|
| **Frontend** (questo) | https://github.com/acetomartina/FE-Capstone-CAF |
| **Backend** | https://github.com/acetomartina/BE-Capstone-CAF |

Per far girare l'applicazione servono entrambi. Le istruzioni complete
sono qui sotto e comprendono anche il backend.

---

## Stack

| | |
|---|---|
| Libreria | React 19 |
| Linguaggio | TypeScript 6 |
| Build | Vite 8 |
| Stato | Redux Toolkit |
| Routing | React Router 7 |
| UI | React Bootstrap 2 + CSS con design token |
| HTTP | Axios |
| Test | Vitest + Testing Library — 34 test |

---

## Requisiti

- **Node.js 20+**
- Il **backend** in esecuzione su `http://localhost:8080`
- **PostgreSQL 16+** (lo usa il backend)

---

## Avvio rapido

### 1. Backend

Il frontend da solo non funziona: tutti i dati arrivano dall'API.

```bash
git clone https://github.com/acetomartina/BE-Capstone-CAF.git
cd BE-Capstone-CAF

createdb caf_fapi
cp env.properties.example env.properties
```

Compila `env.properties`: database, `JWT_SECRET` e il blocco
`SUPER_ADMIN_*` sono obbligatori — senza questi ultimi l'applicazione
non parte. Per il segreto JWT:

```bash
openssl rand -base64 32
```

Poi avvia:

```bash
./mvnw spring-boot:run
```

Al primo avvio Flyway crea lo schema, carica il catalogo dei servizi e
genera l'utente `SUPER_ADMIN` con le credenziali indicate: sono quelle
per accedere all'area amministrativa.

### 2. Frontend

```bash
cp .env.example .env
npm install
npm run dev
```

Il sito risponde su `http://localhost:5173`. `.env` contiene un solo
valore, `VITE_API_URL`, gia' puntato al backend locale.

---

## Comandi

```bash
npm run dev       # sviluppo con hot reload
npm run build     # build di produzione in dist/
npm run preview   # anteprima della build
npm run test      # test in modalita' watch
npm run test:run  # test una volta sola
npm run lint      # analisi statica
```

---

## Struttura

Organizzazione **per dominio**: ogni funzionalita' raccoglie le proprie
chiamate API, i tipi, i componenti e lo stato.

```
src/
├── app/          store Redux e hook tipizzati
├── components/   componenti condivisi (layout, navbar, footer, cookie)
├── features/     un dominio per cartella
│   ├── agenda/       viste scadenze e appuntamenti
│   ├── allegati/     caricamento documenti
│   ├── appuntamenti/
│   ├── auth/         login, rotte protette, regole password
│   ├── clienti/
│   ├── documenti/
│   ├── pratiche/
│   ├── profilo/
│   ├── servizi/      catalogo pubblico e configurazione
│   └── tesseramenti/
├── layouts/      guscio pubblico e guscio dell'area riservata
├── pages/        una pagina per rotta, divise fra public e private
├── services/     istanza Axios e gestione del token
└── styles/       token di design e fogli condivisi
```

### Come e' organizzato l'accesso

`RottaProtetta` decide cosa mostrare in base al ruolo, ma **non e' una
misura di sicurezza**: l'autorizzazione vera sta nel backend. Il
frontend evita di proporre schermate inutili, non protegge dati.

Il token viaggia in `localStorage` se l'utente sceglie "ricordami",
altrimenti in `sessionStorage`. Un interceptor lo aggiunge a ogni
richiesta e lo rimuove quando l'API risponde 401.

All'avvio la sessione viene ricostruita chiedendo `/api/auth/me`:
l'identita' arriva dal server, non dal browser.

### Stile

I colori, i raggi e le ombre vivono in `src/styles/tokens.css` come
variabili CSS. I fogli delle pagine vi fanno riferimento invece di
ripetere i valori.

---

## Funzionalita'

**Sito pubblico**
- Home, catalogo servizi navigabile per macro-area, scheda del singolo
  servizio con documenti richiesti
- Chi siamo, contatti con mappa
- Informativa privacy e cookie, con banner di consenso

**Area amministrativa**
- Dashboard con indicatori di sintesi
- Clienti: elenco, ricerca, scheda con storico pratiche, tesseramenti
  e appuntamenti
- Pratiche: elenco filtrabile, dettaglio con sottopratiche, checklist
  documentale e caricamento allegati
- Documenti: vista trasversale su tutte le pratiche
- Agenda: scadenze delle pratiche e appuntamenti della sede
- Configurazione dei servizi e della relativa checklist
- Configurazione della quota di tesseramento

---

## Stato del progetto

Sono attivi il **sito pubblico** e l'**area amministrativa**.

L'area riservata ai clienti e l'attivazione dell'account sono
sviluppate ma sospese: le rotte sono commentate in `src/App.tsx`,
`src/features/auth/percorsiRuolo.ts` e `src/layouts/PrivateLayout.tsx`,
ciascuna con l'indicazione di come riattivarle.
