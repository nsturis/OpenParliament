import { defineEventHandler, getQuery, createError } from 'h3';
import { performSearch } from '../services/searchService';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchQuery = query.q as string;

  try {
    return await performSearch(searchQuery);
  } catch (error) {
    console.error('Error in search:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
