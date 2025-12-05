import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  LeaderboardEntry: a
    .model({
      playerName: a.string().required(),
      completionTime: a.integer().required(),
      endingType: a.string().required(),
      completedAt: a.datetime().required(),
      unlockedCharCount: a.integer(),
      secretsFound: a.integer(),
    })
    .authorization((allow) => [allow.publicApiKey().to(["read", "create"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
