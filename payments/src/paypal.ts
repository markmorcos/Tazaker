import paypal from "@paypal/checkout-server-sdk";

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

export const captureOrder = async (paypalOrderId: string) => {
  const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
  const { result } = await client.execute(request);
  return result;
};
