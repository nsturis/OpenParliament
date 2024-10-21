import type {
  SagDetails,
  SagAktørWithRelations,
  FilContent,
  DokumentWithRelations,
} from '../../types/sag';
import { LLaMAClient } from './llamaClient';

export async function generateQuestion(sagData: SagDetails) {
  const llm = new LLaMAClient();

  const prompt = `Du skal generere ét spørgsmål om denne sag, som skal være på dansk og formuleret simpelt, så en 10-årig ville forstå det. Det kan være spørgsmål om hvem, hvad, hvor meget. For eksempel: Hvad sagde Socialdemokratiet om dette? Hvor meget kostede det at indføre denne lovgivning? Hvem stillede forslaget? Svaret skal findes i baggrundsmaterialet markeret med <baggrundsmateriale></baggrundsmateriale>.
  
  <baggrundsmateriale>
  Titel: ${sagData.sag.titel}
  Resume: ${sagData.sag.resume}
  Aktører: ${sagData.aktører
    .map((a: SagAktørWithRelations) => a.aktør.navn)
    .join(', ')}
  Dokumenter: ${sagData.dokumenter.map((d) => d.titel).join(', ')}
  </baggrundsmateriale>
  `;

  const question = await llm.generateResponse(prompt);
  return { prompt, question };
}
