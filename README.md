# Unfuck The System.dk

Unfuck The System.dk var engang et større projekt – et _for stort_ projekt – og det her er et forsøg på at tage det gode fra websitet og putte det ind i et mindre, modulært repo.

Indtil videre er det kun _Den Historiske _, som er kommet med.

Sitet er bygget med [nuxt](https://v3.nuxtjs.org)

## Den Historiske Valgtest

Den er lavet hurtigt og simpelt – der er 21 spørgsmål lige nu, men alle data ligger i filerne `assets/data/electionData.json` og `assets/data/metaData.json`.

Ja – du må **meget gerne** tilføje flere spørgsmål. Tænk over hvordan spørgsmålet stilles og om det passer godt på lov- eller beslutningsforslaget.

## Integration med Folketingets Åbne Data

Integrationen med Folketingets Åbne Data er lavet med [Folketingets Åbne Data API](https://oda.ft.dk/api) og [Folketingets Åbne Data API Dokumentation](https://oda.ft.dk/api/docs/Overview).

### Installation

### Structure of repository

.
├── \_templates
│ ├── component
│ │ └── new
│ ├── generator
│ │ ├── help
│ │ ├── new
│ │ └── with-prompt
│ ├── init
│ │ └── repo
│ └── page
│ └── new
├── assets
│ ├── css
│ └── data
│ ├── documents
│ ├── html
│ ├── meetings
│ ├── old_meetings
│ ├── pdf
│ └── raw
├── backup
├── components
├── composables
├── config
│ └── init-scripts
├── init-scripts
├── layouts
├── llm_service
│ └── **pycache**
├── middleware
├── pages
│ ├── dashboard
│ ├── dokumenter
│ ├── lovforslag
│ │ └── fil
│ ├── partier
│ ├── politikere
│ ├── sager
│ ├── udvalg
│ └── ugeplan
├── plugins
├── public
├── scripts
├── server
│ ├── api
│ │ ├── møde
│ │ ├── sag
│ │ ├── udvalg
│ │ └── ugeplan
│ ├── database
│ │ └── meta
│ ├── oda
│ ├── parser
│ ├── plugins
│ ├── repositories
│ └── tasks
├── stores
├── tests
│ ├── e2e
│ └── server
│ └── oda
├── types
└── utils
