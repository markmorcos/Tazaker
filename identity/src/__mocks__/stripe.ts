export const stripe = {
  accounts: { create: jest.fn(() => ({ id: "account-id" })), del: jest.fn() },
  accountSessions: {
    create: jest.fn(() => ({ client_secret: "client-secret" })),
  },
};
