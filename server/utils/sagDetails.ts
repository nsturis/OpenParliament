import { db } from './db';
import { asc, eq } from 'drizzle-orm';
import { sag, taleSegmentRaw } from '../database/schema';
import type {
  SagWithRelations,
  SagDetails,
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
    },
  });

  if (!result) {
    throw new Error('Sag not found');
  }

  // Speeches live in taleSegmentRaw (imported from the transcripts), not the
  // legacy empty taleSegment table
  const taler = await db
    .select({
      id: taleSegmentRaw.id,
      content: taleSegmentRaw.content,
      mødeid: taleSegmentRaw.mødeid,
      aktørid: taleSegmentRaw.aktørid,
      starttid: taleSegmentRaw.starttid,
    })
    .from(taleSegmentRaw)
    .where(eq(taleSegmentRaw.sagid, sagId))
    .orderBy(asc(taleSegmentRaw.starttid))
    .limit(50)

  return {
    sag: result as unknown as SagWithRelations,
    aktører: result.sagAktør as any,
    dokumenter: result.sagdokument.map((sd: any) => ({
      titel: sd.dokument.titel,
      fil: sd.dokument.fil[0]?.titel, // Assuming fil is an array
      content: sd.dokument.fil[0]?.filContent?.[0]?.content, // Assuming filContent is an array
    })) as any,
    taler,
  } as SagDetails;
}
