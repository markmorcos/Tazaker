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

export const paypalClient = new paypal.core.PayPalHttpClient(environment);

export const createOrder = async (value: string) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: "EUR", value } }],
  });

  const { result } = await paypalClient.execute(request);
  return result;
};
