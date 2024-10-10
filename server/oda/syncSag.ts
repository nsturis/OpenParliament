import type { FtDomainModelsSag } from '../../utils/oda'
import { sagGet } from '../../utils/oda'
import { sagRepository } from '../repositories/sagRepository'
import { syncEntity } from './syncUtils'

export async function syncSag() {
  await syncEntity<FtDomainModelsSag, FtDomainModelsSag>({
    entityName: 'sag',
    fetchFunction: sagGet,
    repository: sagRepository,
    mapData: (sag) => ({
      id: sag.id,
      typeid: sag.typeid,
      kategoriid: sag.kategoriid,
      statusid: sag.statusid,
      titel: sag.titel,
      titelkort: sag.titelkort,
      offentlighedskode: sag.offentlighedskode,
      nummer: sag.nummer,
      nummerprefix: sag.nummerprefix,
      nummernumerisk: sag.nummernumerisk,
      nummerpostfix: sag.nummerpostfix,
      resume: sag.resume,
      afstemningskonklusion: sag.afstemningskonklusion,
      periodeid: sag.periodeid,
      afgørelsesresultatkode: sag.afgørelsesresultatkode,
      baggrundsmateriale: sag.baggrundsmateriale,
      opdateringsdato: sag.opdateringsdato,
      statsbudgetsag: sag.statsbudgetsag,
      begrundelse: sag.begrundelse,
      paragrafnummer: sag.paragrafnummer,
      paragraf: sag.paragraf,
      afgørelsesdato: sag.afgørelsesdato,
      afgørelse: sag.afgørelse,
      rådsmødedato: sag.rådsmødedato,
      lovnummer: sag.lovnummer,
      lovnummerdato: sag.lovnummerdato,
      retsinformationsurl: sag.retsinformationsurl,
      fremsatundersagid: sag.fremsatundersagid,
      deltundersagid: sag.deltundersagid,
    }),
  })
}
