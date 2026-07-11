import { db } from './db';
import { sag } from '../database/schema';
import { eq } from 'drizzle-orm';
import type {
  SagWithRelations,
  SagDetails,
  SagdokumentWithRelations,
} from '../../types/sag';

export async function getSagDetails(sagId: number): Promise<SagDetails> {
  const result = await db.query.sag.findFirst({
    where: eq(sag.id, sagId),
    with: {
      sagAktør: {
        with: {
          aktør: true,
        },
      },
      sagdokument: {
        with: {
          dokument: {
            with: {
              fil: {
                with: {
                  filContent: true,
                },
              },
            },
          },
        },
      },
      taleSegment: true,
    },
  });

  if (!result) {
    throw new Error('Sag not found');
  }

  return {
    sag: result as unknown as SagWithRelations,
    aktører: result.sagAktør as any,
    dokumenter: result.sagdokument.map((sd: any) => ({
      titel: sd.dokument.titel,
      fil: sd.dokument.fil[0]?.titel, // Assuming fil is an array
      content: sd.dokument.fil[0]?.filContent?.[0]?.content, // Assuming filContent is an array
    })) as any,
    taler: result.taleSegment,
  } as SagDetails;
}
