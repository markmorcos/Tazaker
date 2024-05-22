import paypal from "@paypal/payouts-sdk";
import { randomBytes } from "crypto";

const environment =
  process.env.ENVIRONMENT === "production"
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_SECRET!
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_SECRET!
      );

const client = new paypal.core.PayPalHttpClient(environment);

export const initiatePayout = async (value: number, email: string) => {
  const request = new paypal.payouts.PayoutsPostRequest();
  request.requestBody({
    sender_batch_header: {
      sender_batch_id: randomBytes(16).toString("hex"),
      email_subject: "You have a payout!",
      email_message:
        "You have received a payout! Thanks for using our service!",
    },
    items: [
      {
        recipient_type: "EMAIL",
        amount: { value, currency: "EUR" },
        receiver: email,
        sender_item_id: randomBytes(16).toString("hex"),
      },
    ],
  });

  const { result } = await client.execute(request);
  return result;
};
