import { relations } from 'drizzle-orm'
import {
  afstemning,
  afstemningstype,
  aktør,
  aktørAktør,
  aktørAktørRolle,
  aktørtype,
  dagsordenspunkt,
  dagsordenspunktdokument,
  dagsordenspunktsag,
  dokument,
  dokumentAktør,
  dokumentAktørRolle,
  dokumentkategori,
  dokumentstatus,
  dokumenttype,
  emneord,
  emneorddokument,
  emneordsag,
  emneordstype,
  fil,
  møde,
  mødestatus,
  mødetype,
  mødeAktør,
  omtryk,
  periode,
  sag,
  sagAktør,
  sagAktørRolle,
  sagdokument,
  sagdokumentrolle,
  sagskategori,
  sagsstatus,
  sagstrin,
  sagstrinAktør,
  sagstrinAktørRolle,
  sagstrindokument,
  sagstrinsstatus,
  sagstrinstype,
  sagstype,
  sambehandlinger,
  stemme,
  stemmetype,
  taleSegment,
} from './schema'

export const afstemningRelations = relations(afstemning, ({ one }) => ({
  afstemningstype: one(afstemningstype, {
    fields: [afstemning.typeid],
    references: [afstemningstype.id],
  }),
  møde: one(møde, {
    fields: [afstemning.mødeid],
    references: [møde.id],
  }),
  sagstrin: one(sagstrin, {
    fields: [afstemning.sagstrinid],
    references: [sagstrin.id],
  }),
}))

export const aktørRelations = relations(aktør, ({ one, many }) => ({
  aktørtype: one(aktørtype, {
    fields: [aktør.typeid],
    references: [aktørtype.id],
  }),
  periode: one(periode, {
    fields: [aktør.periodeid],
    references: [periode.id],
  }),
  fraAktørAktør: many(aktørAktør, { relationName: 'FraAktørToAktørAktør' }),
  tilAktørAktør: many(aktørAktør, { relationName: 'TilAktørToAktørAktør' }),
  dokumentAktør: many(dokumentAktør),
  mødeAktør: many(mødeAktør),
  sagAktør: many(sagAktør),
  sagstrinAktør: many(sagstrinAktør),
  stemme: many(stemme),
  taleSegment: many(taleSegment),
}))

export const aktørAktørRelations = relations(aktørAktør, ({ one }) => ({
  fraAktør: one(aktør, {
    fields: [aktørAktør.fraaktørid],
    references: [aktør.id],
    relationName: 'FraAktørToAktørAktør',
  }),
  tilAktør: one(aktør, {
    fields: [aktørAktør.tilaktørid],
    references: [aktør.id],
    relationName: 'TilAktørToAktørAktør',
  }),
  aktørAktørRolle: one(aktørAktørRolle, {
    fields: [aktørAktør.rolleid],
    references: [aktørAktørRolle.id],
  }),
}))

export const dagsordenspunktRelations = relations(
  dagsordenspunkt,
  ({ one, many }) => ({
    superDagsordenspunkt: one(dagsordenspunkt, {
      fields: [dagsordenspunkt.superid],
      references: [dagsordenspunkt.id],
    }),
    sagstrin: one(sagstrin, {
      fields: [dagsordenspunkt.sagstrinid],
      references: [sagstrin.id],
    }),
    møde: one(møde, {
      fields: [dagsordenspunkt.mødeid],
      references: [møde.id],
    }),
    dagsordenspunktdokument: many(dagsordenspunktdokument),
    dagsordenspunktsag: many(dagsordenspunktsag),
  })
)

export const dokumentRelations = relations(dokument, ({ one, many }) => ({
  dokumenttype: one(dokumenttype, {
    fields: [dokument.typeid],
    references: [dokumenttype.id],
  }),
  dokumentkategori: one(dokumentkategori, {
    fields: [dokument.kategoriid],
    references: [dokumentkategori.id],
  }),
  dokumentstatus: one(dokumentstatus, {
    fields: [dokument.statusid],
    references: [dokumentstatus.id],
  }),
  spørgsmålsDokument: one(dokument, {
    fields: [dokument.spørgsmålsid],
    references: [dokument.id],
    relationName: 'SpørgsmålsDokumentRelation',
  }),
  // svarDokumenter: many(dokument, {
  //   fields: [dokument.id],
  //   references: [dokument.spørgsmålsid],
  //   relationName: 'SvarDokumenterRelation',
  // }),
  dokumentAktør: many(dokumentAktør),
  emneorddokument: many(emneorddokument),
  fil: many(fil),
  omtryk: many(omtryk),
  sagdokument: many(sagdokument),
  sagstrindokument: many(sagstrindokument),
}))

export const dokumentAktørRelations = relations(dokumentAktør, ({ one }) => ({
  aktør: one(aktør, {
    fields: [dokumentAktør.aktørid],
    references: [aktør.id],
  }),
  dokument: one(dokument, {
    fields: [dokumentAktør.dokumentid],
    references: [dokument.id],
  }),
  dokumentAktørRolle: one(dokumentAktørRolle, {
    fields: [dokumentAktør.rolleid],
    references: [dokumentAktørRolle.id],
  }),
}))

export const dokumentAktørRolleRelations = relations(
  dokumentAktørRolle,
  ({ many }) => ({
    dokumentAktørs: many(dokumentAktør),
  })
)

export const emneordRelations = relations(emneord, ({ one, many }) => ({
  emneordstype: one(emneordstype, {
    fields: [emneord.typeid],
    references: [emneordstype.id],
  }),
  emneorddokument: many(emneorddokument),
  emneordsag: many(emneordsag),
}))

export const mødeRelations = relations(møde, ({ one, many }) => ({
  mødestatus: one(mødestatus, {
    fields: [møde.statusid],
    references: [mødestatus.id],
  }),
  mødetype: one(mødetype, {
    fields: [møde.typeid],
    references: [mødetype.id],
  }),
  periode: one(periode, {
    fields: [møde.periodeid],
    references: [periode.id],
  }),
  afstemning: many(afstemning),
  dagsordenspunkt: many(dagsordenspunkt),
  mødeAktør: many(mødeAktør),
  taleSegment: many(taleSegment),
}))

export const sagRelations = relations(sag, ({ one, many }) => ({
  sagstype: one(sagstype, {
    fields: [sag.typeid],
    references: [sagstype.id],
  }),
  sagskategori: one(sagskategori, {
    fields: [sag.kategoriid],
    references: [sagskategori.id],
  }),
  sagsstatus: one(sagsstatus, {
    fields: [sag.statusid],
    references: [sagsstatus.id],
  }),
  periode: one(periode, {
    fields: [sag.periodeid],
    references: [periode.id],
  }),
  fremsatUnderSag: one(sag, {
    fields: [sag.fremsatundersagid],
    references: [sag.id],
    relationName: 'SagerfremsatunderRelation',
  }),
  deltFraSag: one(sag, {
    fields: [sag.deltundersagid],
    references: [sag.id],
    relationName: 'SagerdeltiRelation',
  }),
  sagerdelti: many(sag, { relationName: 'SagerdeltiRelation' }),
  sagerfremsatunder: many(sag, { relationName: 'SagerfremsatunderRelation' }),
  dagsordenspunktsag: many(dagsordenspunktsag),
  emneordsag: many(emneordsag),
  sagAktør: many(sagAktør),
  sagdokument: many(sagdokument),
  sagstrin: many(sagstrin),
  taleSegment: many(taleSegment),
}))

export const sagAktørRelations = relations(sagAktør, ({ one }) => ({
  aktør: one(aktør, {
    fields: [sagAktør.aktørid],
    references: [aktør.id],
  }),
  sag: one(sag, {
    fields: [sagAktør.sagid],
    references: [sag.id],
  }),
  sagAktørRolle: one(sagAktørRolle, {
    fields: [sagAktør.rolleid],
    references: [sagAktørRolle.id],
  }),
}))

export const sagAktørRolleRelations = relations(sagAktørRolle, ({ many }) => ({
  sagAktørs: many(sagAktør),
}))

export const sagskategoriRelations = relations(sagskategori, ({ many }) => ({
  sags: many(sag),
}))

export const sagsstatusRelations = relations(sagsstatus, ({ many }) => ({
  sags: many(sag),
}))

export const sagstypeRelations = relations(sagstype, ({ many }) => ({
  sags: many(sag),
}))

export const sagstrinAktørRelations = relations(sagstrinAktør, ({ one }) => ({
  aktør: one(aktør, {
    fields: [sagstrinAktør.aktørid],
    references: [aktør.id],
  }),
  sagstrin: one(sagstrin, {
    fields: [sagstrinAktør.sagstrinid],
    references: [sagstrin.id],
  }),
  sagstrinAktørRolle: one(sagstrinAktørRolle, {
    fields: [sagstrinAktør.rolleid],
    references: [sagstrinAktørRolle.id],
  }),
}))

export const sagstrinAktørRolleRelations = relations(
  sagstrinAktørRolle,
  ({ many }) => ({
    sagstrinAktørs: many(sagstrinAktør),
  })
)

export const sagstrinRelations = relations(sagstrin, ({ one, many }) => ({
  sag: one(sag, {
    fields: [sagstrin.sagid],
    references: [sag.id],
  }),
  sagstrinsstatus: one(sagstrinsstatus, {
    fields: [sagstrin.statusid],
    references: [sagstrinsstatus.id],
  }),
  sagstrinstype: one(sagstrinstype, {
    fields: [sagstrin.typeid],
    references: [sagstrinstype.id],
  }),
  afstemning: many(afstemning),
  dagsordenspunkt: many(dagsordenspunkt),
  sagstrinAktør: many(sagstrinAktør),
  sagstrindokument: many(sagstrindokument),
  sambehandlingerFørste: many(sambehandlinger, {
    relationName: 'FørsteSagstrin',
  }),
  sambehandlingerAndet: many(sambehandlinger, {
    relationName: 'AndetSagstrin',
  }),
}))

export const sambehandlingerRelations = relations(
  sambehandlinger,
  ({ one }) => ({
    førsteSagstrin: one(sagstrin, {
      fields: [sambehandlinger.førstesagstrinid],
      references: [sagstrin.id],
      relationName: 'FørsteSagstrin',
    }),
    andetSagstrin: one(sagstrin, {
      fields: [sambehandlinger.andetsagstrinid],
      references: [sagstrin.id],
      relationName: 'AndetSagstrin',
    }),
  })
)

export const stemmeRelations = relations(stemme, ({ one }) => ({
  stemmetype: one(stemmetype, {
    fields: [stemme.typeid],
    references: [stemmetype.id],
  }),
  afstemning: one(afstemning, {
    fields: [stemme.afstemningid],
    references: [afstemning.id],
  }),
  aktør: one(aktør, {
    fields: [stemme.aktørid],
    references: [aktør.id],
  }),
}))

/// //

export const dokumentkategoriRelations = relations(
  dokumentkategori,
  ({ many }) => ({
    dokuments: many(dokument),
  })
)

export const dokumentstatusRelations = relations(
  dokumentstatus,
  ({ many }) => ({
    dokuments: many(dokument),
  })
)

export const dokumenttypeRelations = relations(dokumenttype, ({ many }) => ({
  dokuments: many(dokument),
}))

export const sagstrinsstatusRelations = relations(
  sagstrinsstatus,
  ({ many }) => ({
    sagstrins: many(sagstrin),
  })
)

export const sagstrinstypeRelations = relations(sagstrinstype, ({ many }) => ({
  sagstrins: many(sagstrin),
}))

export const aktørtypeRelations = relations(aktørtype, ({ many }) => ({
  aktørs: many(aktør),
}))

export const periodeRelations = relations(periode, ({ many }) => ({
  aktørs: many(aktør),
  mødes: many(møde),
  sags: many(sag),
}))

export const aktørAktørRolleRelations = relations(
  aktørAktørRolle,
  ({ many }) => ({
    aktørAktørs: many(aktørAktør),
  })
)

export const mødestatusRelations = relations(mødestatus, ({ many }) => ({
  mødes: many(møde),
}))

export const mødetypeRelations = relations(mødetype, ({ many }) => ({
  mødes: many(møde),
}))

export const mødeAktørRelations = relations(mødeAktør, ({ one }) => ({
  aktør: one(aktør, {
    fields: [mødeAktør.aktørid],
    references: [aktør.id],
  }),
  møde: one(møde, {
    fields: [mødeAktør.mødeid],
    references: [møde.id],
  }),
}))

export const afstemningstypeRelations = relations(
  afstemningstype,
  ({ many }) => ({
    afstemnings: many(afstemning),
  })
)

export const dagsordenspunktdokumentRelations = relations(
  dagsordenspunktdokument,
  ({ one }) => ({
    dagsordenspunkt: one(dagsordenspunkt, {
      fields: [dagsordenspunktdokument.dagsordenspunktid],
      references: [dagsordenspunkt.id],
    }),
    dokument: one(dokument, {
      fields: [dagsordenspunktdokument.dokumentid],
      references: [dokument.id],
    }),
  })
)

export const dagsordenspunktsagRelations = relations(
  dagsordenspunktsag,
  ({ one }) => ({
    dagsordenspunkt: one(dagsordenspunkt, {
      fields: [dagsordenspunktsag.dagsordenspunktid],
      references: [dagsordenspunkt.id],
    }),
    sag: one(sag, {
      fields: [dagsordenspunktsag.sagid],
      references: [sag.id],
    }),
  })
)

export const emneordstypeRelations = relations(emneordstype, ({ many }) => ({
  emneords: many(emneord),
}))

export const emneorddokumentRelations = relations(
  emneorddokument,
  ({ one }) => ({
    dokument: one(dokument, {
      fields: [emneorddokument.dokumentid],
      references: [dokument.id],
    }),
    emneord: one(emneord, {
      fields: [emneorddokument.emneordid],
      references: [emneord.id],
    }),
  })
)

export const emneordsagRelations = relations(emneordsag, ({ one }) => ({
  emneord: one(emneord, {
    fields: [emneordsag.emneordid],
    references: [emneord.id],
  }),
  sag: one(sag, {
    fields: [emneordsag.sagid],
    references: [sag.id],
  }),
}))

export const filRelations = relations(fil, ({ one }) => ({
  dokument: one(dokument, {
    fields: [fil.dokumentid],
    references: [dokument.id],
  }),
}))

export const omtrykRelations = relations(omtryk, ({ one }) => ({
  dokument: one(dokument, {
    fields: [omtryk.dokumentid],
    references: [dokument.id],
  }),
}))

export const sagdokumentRelations = relations(sagdokument, ({ one }) => ({
  dokument: one(dokument, {
    fields: [sagdokument.dokumentid],
    references: [dokument.id],
  }),
  sag: one(sag, {
    fields: [sagdokument.sagid],
    references: [sag.id],
  }),
  sagdokumentrolle: one(sagdokumentrolle, {
    fields: [sagdokument.rolleid],
    references: [sagdokumentrolle.id],
  }),
}))

export const sagdokumentrolleRelations = relations(
  sagdokumentrolle,
  ({ many }) => ({
    sagdokuments: many(sagdokument),
  })
)

export const sagstrindokumentRelations = relations(
  sagstrindokument,
  ({ one }) => ({
    dokument: one(dokument, {
      fields: [sagstrindokument.dokumentid],
      references: [dokument.id],
    }),
    sagstrin: one(sagstrin, {
      fields: [sagstrindokument.sagstrinid],
      references: [sagstrin.id],
    }),
  })
)

export const taleSegmentRelations = relations(taleSegment, ({ one }) => ({
  møde: one(møde, {
    fields: [taleSegment.mødeid],
    references: [møde.id],
  }),
  sag: one(sag, {
    fields: [taleSegment.sagid],
    references: [sag.id],
  }),
  aktør: one(aktør, {
    fields: [taleSegment.aktørid],
    references: [aktør.id],
  }),
}))
