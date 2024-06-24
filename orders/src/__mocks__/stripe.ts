export const stripe = {
  checkout: {
    sessions: {
      create: jest.fn(() => ({ client_secret: "client-secret" })),
      retrieve: jest.fn(() => ({ client_secret: "client-secret" })),
    },
  },
};
