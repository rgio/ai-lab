import { query } from './_generated/server';

export const getAllCharacters = query({ args: {}, handler: async (ctx: any) => {
  const characters = await ctx.db
    .query('characters')
    .collect();
  return characters;
}});

export default getAllCharacters;
