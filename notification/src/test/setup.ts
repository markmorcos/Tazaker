jest.mock("@sendgrid/mail");

jest.mock("../nats");

beforeAll(async () => {
  process.env.SENDGRID_KEY = "asdfasdf";
});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {});
