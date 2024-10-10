import type { FtDomainModelsDokument } from '../../utils/oda'
import { dokumentGet } from '../../utils/oda'
import { dokumentRepository } from '../repositories/dokumentRepository'
import { syncEntity } from './syncUtils'

export async function syncDokument() {
  await syncEntity<FtDomainModelsDokument, FtDomainModelsDokument>({
    entityName: 'dokument',
    fetchFunction: dokumentGet,
    repository: dokumentRepository,
    mapData: (dokument) => ({
      id: dokument.id,
      typeid: dokument.typeid,
      kategoriid: dokument.kategoriid,
      statusid: dokument.statusid,
      offentlighedskode: dokument.offentlighedskode,
      titel: dokument.titel,
      dato: dokument.dato,
      modtagelsesdato: dokument.modtagelsesdato,
      frigivelsesdato: dokument.frigivelsesdato,
      paragraf: dokument.paragraf,
      paragrafnummer: dokument.paragrafnummer,
      spørgsmålsordlyd: dokument.spørgsmålsordlyd,
      spørgsmålstitel: dokument.spørgsmålstitel,
      spørgsmålsid: dokument.spørgsmålsid,
      procedurenummer: dokument.procedurenummer,
      grundnotatstatus: dokument.grundnotatstatus,
      dagsordenudgavenummer: dokument.dagsordenudgavenummer,
      opdateringsdato: dokument.opdateringsdato,
    }),
  })
}
