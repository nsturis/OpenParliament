import { getRandomSag } from './randomSag';
import { getSagDetails } from './sagDetails';
import { generateQuestion } from '../llm/generateQuestion';
import { createHash } from 'crypto';
import type { SagDetails } from '~/types/sag';
const cache = new Map<
  string,
  {
    question: string;
    prompt: string;
    sagDetails: SagDetails;
    timestamp: number;
  }
>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export default defineEventHandler(async (event) => {
  try {
    const randomSag = await getRandomSag();
    const cacheKey = createHash('md5')
      .update(JSON.stringify(randomSag))
      .digest('hex');

    const cachedResult = cache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult;
    }

    const sagDetails = await getSagDetails(randomSag.id);
    const { question, prompt } = await generateQuestion(sagDetails);

    const result = {
      question,
      prompt,
      sagDetails,
      timestamp: Date.now(),
    };

    cache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Error in randomQuestion handler:', error);
    throw createError({
      statusCode: 500,
      message: 'An error occurred while generating the random question',
    });
  }
});
