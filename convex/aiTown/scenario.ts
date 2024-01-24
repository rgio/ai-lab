import { Id } from '../_generated/dataModel';
import { Game } from './game';
import { ObjectType, v } from 'convex/values';
import { Player } from './player';
import { Conversation, serializedConversation } from './conversation';
import { internalMutation } from '../_generated/server';

// export const serializedAuctionSettings = {
//   rounds: v.number(),
// };
// export type SerializedAuctionSettings = ObjectType<typeof serializedAuctionSettings>;

export const serializedDebateSettings = {
  rounds: v.number(),
  topic: v.string(),
  reference: v.string(),
};
export type SerializedDebateSettings = ObjectType<typeof serializedDebateSettings>;

export const serializedScenario = {
  id: v.optional(v.id('scenarios')),
  worldId: v.id('worlds'),
  type: v.union(v.literal('debate'), v.literal('auction')),
  description: v.string(),
  conversation: v.optional(v.object(serializedConversation)),
  conversationId: v.optional(v.string()),
  settings: v.object(serializedDebateSettings),
};
export type SerializedScenario = ObjectType<typeof serializedScenario>;

export class Scenario {
  id?: Id<'scenarios'>;
  worldId: Id<'worlds'>;
  type: 'debate' | 'auction';
  description: string;
  conversation?: Conversation;
  conversationId?: string;
  settings: SerializedDebateSettings;

  constructor(serialized: SerializedScenario) {
    this.id = serialized.id;
    this.worldId = serialized.worldId;
    this.type = serialized.type;
    this.description = serialized.description;
    this.conversation =
      (serialized.conversation && new Conversation(serialized.conversation)) || undefined;
    this.conversationId = serialized.conversationId;
    this.settings = serialized.settings;
  }

  start(game: Game, now: number, players: Player[]) {
    this.conversation = Conversation.startMultiplayer(game, now, players);
    console.log(`START MULTIPLAYER`);
  }

  serialize(): SerializedScenario {
    let c;
    if (this.conversation) {
      c = {
        ...this.conversation,
        participants: [...this.conversation.participants.values()].map((p) => p.serialize()),
      };
    }

    return {
      id: this.id,
      worldId: this.worldId,
      type: this.type,
      description: this.description,
      conversation: c,
      conversationId: this.conversationId,
      settings: this.settings,
    };
  }
}

export const setConversation = internalMutation({
  args: {
    scenarioId: v.id('scenarios'),
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.scenarioId, { conversationId: args.conversationId });
  },
});
