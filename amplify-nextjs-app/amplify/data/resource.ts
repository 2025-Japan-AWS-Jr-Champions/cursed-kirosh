import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]),
  
  LeaderboardEntry: a
    .model({
      playerName: a.string().required(),
      completionTime: a.integer().required(),
      endingType: a.string().required(),
      completedAt: a.datetime().required(),
      unlockedCharCount: a.integer(),
      secretsFound: a.integer(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read', 'create'])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
