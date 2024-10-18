import {
  pgTable,
  bigserial,
  text,
  integer,
  uuid,
  boolean,
  smallint,
  index,
  uniqueIndex,
  primaryKey,
  timestamp,
  vector,
} from 'drizzle-orm/pg-core'

export const synclogger = pgTable('synclogger', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  entitet: text('entitet').notNull(),
  internid: integer('internid').notNull(),
  eksternid: text('eksternid').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  antal: integer('antal').notNull(),
  godkendtdato: timestamp('godkendtdato', {
    withTimezone: true,
    mode: 'string',
  }),
})

export const refactorlog = pgTable('__refactorlog', {
  operationkey: uuid('operationkey').primaryKey().notNull(),
})

export const afstemning = pgTable('afstemning', {
  id: integer('id').primaryKey().notNull(),
  nummer: integer('nummer'),
  konklusion: text('konklusion'),
  vedtaget: boolean('vedtaget'),
  kommentar: text('kommentar'),
  mødeid: integer('mødeid').references(() => møde.id),
  typeid: integer('typeid').references(() => afstemningstype.id),
  sagstrinid: integer('sagstrinid').references(() => sagstrin.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }),
})

export const afstemningstype = pgTable('afstemningstype', {
  id: integer('id').primaryKey().notNull(),
  type: text('type').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const aktør = pgTable('Aktør', {
  id: integer('id').primaryKey().notNull(),
  typeid: integer('typeid')
    .notNull()
    .references(() => aktørtype.id),
  gruppenavnkort: text('gruppenavnkort'),
  navn: text('navn'),
  fornavn: text('fornavn'),
  efternavn: text('efternavn'),
  biografi: text('biografi'),
  periodeid: integer('periodeid').references(() => periode.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  startdato: timestamp('startdato', { withTimezone: true, mode: 'string' }),
  slutdato: timestamp('slutdato', { withTimezone: true, mode: 'string' }),
})

export const aktørAktør = pgTable('AktørAktør', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  fraaktørid: integer('fraaktørid')
    .notNull()
    .references(() => aktør.id),
  tilaktørid: integer('tilaktørid')
    .notNull()
    .references(() => aktør.id),
  startdato: timestamp('startdato', { withTimezone: true, mode: 'string' }),
  slutdato: timestamp('slutdato', { withTimezone: true, mode: 'string' }),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  rolleid: integer('rolleid')
    .notNull()
    .references(() => aktørAktørRolle.id),
})

export const aktørAktørRolle = pgTable('AktørAktørRolle', {
  id: integer('id').primaryKey().notNull(),
  rolle: text('rolle').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const aktørtype = pgTable('Aktørtype', {
  id: integer('id').primaryKey().notNull(),
  type: text('type'),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const dagsordenspunkt = pgTable('dagsordenspunkt', {
  id: integer('id').primaryKey().notNull(),
  kørebemærkning: text('kørebemærkning'),
  titel: text('titel'),
  kommentar: text('kommentar'),
  nummer: text('nummer'),
  forhandlingskode: text('forhandlingskode'),
  forhandling: text('forhandling'),
  superid: integer('superid').references(() => dagsordenspunkt.id),
  sagstrinid: integer('sagstrinid').references(() => sagstrin.id),
  mødeid: integer('mødeid').references(() => møde.id),
  offentlighedskode: text('offentlighedskode').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }),
})

export const dagsordenspunktdokument = pgTable('dagsordenspunktdokument', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  dokumentid: integer('dokumentid').references(() => dokument.id),
  dagsordenspunktid: integer('dagsordenspunktid').references(
    () => dagsordenspunkt.id
  ),
  note: text('note'),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const dagsordenspunktsag = pgTable('dagsordenspunktsag', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  dagsordenspunktid: integer('dagsordenspunktid').references(
    () => dagsordenspunkt.id
  ),
  sagid: integer('sagid').references(() => sag.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const dokument = pgTable('dokument', {
  id: integer('id').primaryKey().notNull(),
  typeid: integer('typeid').references(() => dokumenttype.id),
  kategoriid: integer('kategoriid').references(() => dokumentkategori.id),
  statusid: integer('statusid').references(() => dokumentstatus.id),
  offentlighedskode: text('offentlighedskode').notNull(),
  titel: text('titel').notNull(),
  dato: timestamp('dato', { withTimezone: true, mode: 'string' }).notNull(),
  modtagelsesdato: timestamp('modtagelsesdato', {
    withTimezone: true,
    mode: 'string',
  }),
  frigivelsesdato: timestamp('frigivelsesdato', {
    withTimezone: true,
    mode: 'string',
  }),
  paragraf: text('paragraf'),
  paragrafnummer: text('paragrafnummer'),
  spørgsmålsordlyd: text('spørgsmålsordlyd'),
  spørgsmålstitel: text('spørgsmålstitel'),
  spørgsmålsid: integer('spørgsmålsid').references(() => dokument.id),
  procedurenummer: text('procedurenummer'),
  grundnotatstatus: text('grundnotatstatus'),
  dagsordenudgavenummer: smallint('dagsordenudgavenummer'),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const dokumentAktør = pgTable('DokumentAktør', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  dokumentid: integer('dokumentid')
    .notNull()
    .references(() => dokument.id),
  aktørid: integer('aktørid')
    .notNull()
    .references(() => aktør.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  rolleid: integer('rolleid')
    .notNull()
    .references(() => dokumentAktørRolle.id),
})

export const dokumentAktørRolle = pgTable('DokumentAktørRolle', {
  id: integer('id').primaryKey().notNull(),
  rolle: text('rolle').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const dokumentkategori = pgTable('dokumentkategori', {
  id: integer('id').primaryKey().notNull(),
  kategori: text('kategori').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const dokumentstatus = pgTable('dokumentstatus', {
  id: integer('id').primaryKey().notNull(),
  status: text('status').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const dokumenttype = pgTable('dokumenttype', {
  id: integer('id').primaryKey().notNull(),
  type: text('type').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const emneord = pgTable(
  'emneord',
  {
    id: integer('id').primaryKey().notNull(),
    typeid: integer('typeid').notNull(),
    emneord: text('emneord').notNull(),
    opdateringsdato: timestamp('opdateringsdato', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
  },
  (table) => {
    return {
      idx19768IxFkEmneordEmneordstype: index(
        'idx_19768_ix_fk_emneord_emneordstype'
      ).using('btree', table.typeid),
    }
  }
)

export const emneorddokument = pgTable('emneorddokument', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  emneordid: integer('emneordid').notNull(),
  dokumentid: integer('dokumentid').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const emneordsag = pgTable('emneordsag', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  emneordid: integer('emneordid').notNull(),
  sagid: integer('sagid').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const emneordstype = pgTable('emneordstype', {
  id: integer('id').primaryKey().notNull(),
  type: text('type').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const entitetbeskrivelse = pgTable('entitetbeskrivelse', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  entitetnavn: text('entitetnavn'),
  beskrivelse: text('beskrivelse'),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }),
})

export const fil = pgTable('fil', {
  id: integer('id').primaryKey().notNull(),
  dokumentid: integer('dokumentid').notNull(),
  titel: text('titel'),
  versionsdato: timestamp('versionsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  filurl: text('filurl').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  variantkode: text('variantkode').notNull(),
  format: text('format').notNull(),
})

export const kollonebeskrivelse = pgTable('kollonebeskrivelse', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  entitetnavn: text('entitetnavn'),
  kollonenavn: text('kollonenavn'),
  beskrivelse: text('beskrivelse'),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }),
})

export const møde = pgTable('Møde', {
  id: integer('id').primaryKey().notNull(),
  titel: text('titel').notNull(),
  lokale: text('lokale'),
  nummer: text('nummer'),
  dagsordenurl: text('dagsordenurl'),
  starttidsbemærkning: text('starttidsbemærkning'),
  offentlighedskode: text('offentlighedskode').notNull(),
  dato: timestamp('dato', { withTimezone: true, mode: 'string' }),
  statusid: integer('statusid').references(() => mødestatus.id),
  typeid: integer('typeid').references(() => mødetype.id),
  periodeid: integer('periodeid')
    .notNull()
    .references(() => periode.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const mødestatus = pgTable('Mødestatus', {
  id: integer('id').primaryKey().notNull(),
  status: text('status').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const mødetype = pgTable('Mødetype', {
  id: integer('id').primaryKey().notNull(),
  type: text('type').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const mødeAktør = pgTable('MødeAktør', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  mødeid: integer('mødeid')
    .notNull()
    .references(() => møde.id),
  aktørid: integer('aktørid')
    .notNull()
    .references(() => aktør.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const omtryk = pgTable('omtryk', {
  id: integer('id').primaryKey().notNull(),
  dokumentid: integer('dokumentid').notNull(),
  dato: timestamp('dato', { withTimezone: true, mode: 'string' }),
  begrundelse: text('begrundelse').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const periode = pgTable('periode', {
  id: integer('id').primaryKey().notNull(),
  startdato: timestamp('startdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  slutdato: timestamp('slutdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  type: text('type').notNull(),
  kode: text('kode').notNull(),
  titel: text('titel').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sag = pgTable(
  'sag',
  {
    id: integer('id').primaryKey().notNull(),
    typeid: integer('typeid')
      .notNull()
      .references(() => sagstype.id),
    kategoriid: integer('kategoriid').references(() => sagskategori.id),
    statusid: integer('statusid')
      .notNull()
      .references(() => sagsstatus.id),
    titel: text('titel').notNull(),
    titelkort: text('titelkort').notNull(),
    offentlighedskode: text('offentlighedskode').notNull(),
    nummer: text('nummer'),
    nummerprefix: text('nummerprefix'),
    nummernumerisk: text('nummernumerisk'),
    nummerpostfix: text('nummerpostfix'),
    resume: text('resume'),
    afstemningskonklusion: text('afstemningskonklusion'),
    periodeid: integer('periodeid')
      .notNull()
      .references(() => periode.id),
    afgørelsesresultatkode: text('afgørelsesresultatkode'),
    baggrundsmateriale: text('baggrundsmateriale'),
    opdateringsdato: timestamp('opdateringsdato', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    statsbudgetsag: boolean('statsbudgetsag'),
    begrundelse: text('begrundelse'),
    paragrafnummer: integer('paragrafnummer'),
    paragraf: text('paragraf'),
    afgørelsesdato: timestamp('afgørelsesdato', {
      withTimezone: true,
      mode: 'string',
    }),
    afgørelse: text('afgørelse'),
    rådsmødedato: timestamp('rådsmødedato', {
      withTimezone: true,
      mode: 'string',
    }),
    lovnummer: text('lovnummer'),
    lovnummerdato: timestamp('lovnummerdato', {
      withTimezone: true,
      mode: 'string',
    }),
    retsinformationsurl: text('retsinformationsurl'),
    fremsatundersagid: integer('fremsatundersagid').references(() => sag.id),
    deltundersagid: integer('deltundersagid').references(() => sag.id),
  },
  (table) => {
    return {
      idx19842IxFkDeltundersagSag: index(
        'idx_19842_ix_fk_deltundersag_sag'
      ).using('btree', table.deltundersagid),
      idx19842IxFkFremsatundersagSag: index(
        'idx_19842_ix_fk_fremsatundersag_sag'
      ).using('btree', table.fremsatundersagid),
      idx19842IxFkSagSagskategori: index(
        'idx_19842_ix_fk_sag_sagskategori'
      ).using('btree', table.kategoriid),
      idx19842IxFkSagSagsstatus: index('idx_19842_ix_fk_sag_sagsstatus').using(
        'btree',
        table.statusid
      ),
      idx19842IxFkSagSagstype: index('idx_19842_ix_fk_sag_sagstype').using(
        'btree',
        table.typeid
      ),
    }
  }
)

export const sagAktør = pgTable('SagAktør', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  aktørid: integer('aktørid')
    .notNull()
    .references(() => aktør.id),
  sagid: integer('sagid')
    .notNull()
    .references(() => sag.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  rolleid: integer('rolleid')
    .notNull()
    .references(() => sagAktørRolle.id),
})

export const sagAktørRolle = pgTable('SagAktørRolle', {
  id: integer('id').primaryKey().notNull(),
  rolle: text('rolle').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sagdokument = pgTable('sagdokument', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  sagid: integer('sagid')
    .notNull()
    .references(() => sag.id),
  dokumentid: integer('dokumentid')
    .notNull()
    .references(() => dokument.id),
  bilagsnummer: text('bilagsnummer'),
  frigivelsesdato: timestamp('frigivelsesdato', {
    withTimezone: true,
    mode: 'string',
  }),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  rolleid: integer('rolleid')
    .notNull()
    .references(() => sagdokumentrolle.id),
})

export const sagdokumentrolle = pgTable('sagdokumentrolle', {
  id: integer('id').primaryKey().notNull(),
  rolle: text('rolle').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sagskategori = pgTable('sagskategori', {
  id: integer('id').primaryKey().notNull(),
  kategori: text('kategori').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sagsstatus = pgTable('sagsstatus', {
  id: integer('id').primaryKey().notNull(),
  status: text('status').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sagstrin = pgTable('sagstrin', {
  id: integer('id').primaryKey().notNull(),
  titel: text('titel').notNull(),
  dato: timestamp('dato', { withTimezone: true, mode: 'string' }),
  sagid: integer('sagid')
    .notNull()
    .references(() => sag.id),
  typeid: integer('typeid')
    .notNull()
    .references(() => sagstrinstype.id),
  folketingstidendeurl: text('folketingstidendeurl'),
  folketingstidende: text('folketingstidende'),
  folketingstidendesidenummer: text('folketingstidendesidenummer'),
  statusid: integer('statusid')
    .notNull()
    .references(() => sagstrinsstatus.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sagstrinAktør = pgTable('SagstrinAktør', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  sagstrinid: integer('sagstrinid')
    .notNull()
    .references(() => sagstrin.id),
  aktørid: integer('aktørid')
    .notNull()
    .references(() => aktør.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  rolleid: integer('rolleid')
    .notNull()
    .references(() => sagstrinAktørRolle.id),
})

export const sagstrinAktørRolle = pgTable('SagstrinAktørRolle', {
  id: integer('id').primaryKey().notNull(),
  rolle: text('rolle').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sagstrindokument = pgTable('sagstrindokument', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  sagstrinid: integer('sagstrinid')
    .notNull()
    .references(() => sagstrin.id),
  dokumentid: integer('dokumentid')
    .notNull()
    .references(() => dokument.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sagstrinsstatus = pgTable('sagstrinsstatus', {
  id: integer('id').primaryKey().notNull(),
  status: text('status').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sagstrinstype = pgTable('sagstrinstype', {
  id: integer('id').primaryKey().notNull(),
  type: text('type').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sagstype = pgTable('sagstype', {
  id: integer('id').primaryKey().notNull(),
  type: text('type').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const sambehandlinger = pgTable('sambehandlinger', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  førstesagstrinid: integer('førstesagstrinid')
    .notNull()
    .references(() => sagstrin.id),
  andetsagstrinid: integer('andetsagstrinid')
    .notNull()
    .references(() => sagstrin.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const slettet = pgTable('slettet', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  slettetmapid: integer('slettetmapid').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  objektid: integer('objektid').notNull(),
})

export const slettetmap = pgTable('slettetmap', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  datatype: text('datatype').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const stemme = pgTable('stemme', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  typeid: integer('typeid').references(() => stemmetype.id),
  afstemningid: integer('afstemningid')
    .notNull()
    .references(() => afstemning.id),
  aktørid: integer('aktørid')
    .notNull()
    .references(() => aktør.id),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const stemmetype = pgTable('stemmetype', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  type: text('type').notNull(),
  opdateringsdato: timestamp('opdateringsdato', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
})

export const idmap = pgTable(
  'idmap',
  {
    id: integer('id').notNull(),
    originalid: text('originalid').notNull(),
    entity: text('entity').notNull(),
  },
  (table) => {
    return {
      idx19800IxIdmapOriginalidEntity: uniqueIndex(
        'idx_19800_ix_idmap_originalid_entity'
      ).using('btree', table.originalid, table.entity),
      idx19800PkIdmap: primaryKey({
        columns: [table.id, table.entity],
        name: 'idx_19800_pk_idmap',
      }),
    }
  }
)

export const taleSegment = pgTable(
  'taleSegment',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
    content: text('content').notNull(),
    mødeid: integer('mødeid')
      .notNull()
      .references(() => møde.id),
    starttid: timestamp('starttid', { withTimezone: true, mode: 'string' }),
    sluttid: timestamp('sluttid', { withTimezone: true, mode: 'string' }),
    lastModified: timestamp('last_modified', {
      withTimezone: true,
      mode: 'string',
    }),
    sagid: integer('sagid').references(() => sag.id),
    aktørid: integer('aktørid')
      .notNull()
      .references(() => aktør.id),
    opdateringsdato: timestamp('opdateringsdato', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    embedding: vector('embedding', { dimensions: 768 }).notNull(),
  },
  (table) => {
    return {
      speechOrderIdx: index('speech_order_idx').on(
        table.mødeid,
        table.starttid
      ),
    }
  }
)

// Add this table definition
export const filContent = pgTable('FilContent', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  filId: integer('fil_id')
    .notNull()
    .references(() => fil.id),
  content: text('content').notNull(),
  extractedAt: timestamp('extracted_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  embedding: vector('embedding', { dimensions: 768 }).notNull(),
  version: integer('version').notNull().default(1),
  chunkIndex: integer('chunk_index').notNull().default(0),
})
