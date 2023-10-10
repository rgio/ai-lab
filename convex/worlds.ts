import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { internal } from './_generated/api';
import { query, action } from './_generated/server';
import { MemoryDB } from './lib/memory';
import { Characters, Descriptions } from './schema';

//type Player = { id: Id<'players'>; name: string; identity: string };

export const createWorld = action({
    args: { 
        mapId: v.string(), 
        characters: v.array(v.object(Characters.fields)), 
        descriptions: v.array(Descriptions)
    },
    handler: async (ctx: any, { mapId, characters, descriptions }) => {
        //const worldId = await makeWorld(ctx.db, false);
        //const allCharacters: Character[] = await ctx.db.query("characters").collect();
        // const characters = allCharacters.filter((character) => characterIds.includes(character._id));
        type addPlayersResult = {
          playersByName: Record<string, Id<'players'>>;
          worldId: Id<'worlds'>;
        };

        console.log("Before")

        const result: addPlayersResult = await ctx.runMutation(internal.init.addPlayers, {
          newWorld: true,
          characters,
          descriptions,
          frozen: false,
          mapId,
        });

        console.log(`Result: ${JSON.stringify(result)}`);

        const { playersByName, worldId } = result;

        const memories = descriptions.flatMap(({ name, memories }) => {
            const playerId = playersByName[name]!;
            return memories.map((memory, idx) => {
              const { description, ...rest } = memory;
              let data: Doc<'memories'>['data'] | undefined;
              if (rest.type === 'relationship') {
                const { playerName, ...relationship } = rest;
                const otherId = playersByName[playerName!];
                if (!otherId) throw new Error(`No player named ${playerName}`);
                data = { ...relationship, playerId: otherId };
              } else {
                data = rest;
              }
              const newMemory = {
                playerId,
                data,
                description: memory.description,
              };
      
              return newMemory;
            });
        });
        await MemoryDB(ctx).addMemories(memories);
        await ctx.runMutation(internal.engine.tick, { worldId });
        return worldId;
    },
});

export const getAllMaps = query({ args: {}, handler: async (ctx: any) => {
    const maps = await ctx.db
      .query('maps')
      .collect();
    return maps;
}});
  
export default createWorld;
