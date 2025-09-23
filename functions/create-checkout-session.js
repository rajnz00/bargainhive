// functions/create-checkout-session.js
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const Stripe = require("stripe");

exports.handler = async (event) => {
  const resp = (status, body) => ({
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    },
    body: JSON.stringify(body),
  });

  if (event.httpMethod === "OPTIONS") return resp(200, { ok: true });
  if (!stripeSecret) return resp(500, { error: "Server misconfiguration: STRIPE_SECRET_KEY missing" });

  const stripe = new Stripe(stripeSecret);

  let items;
  try {
    const body = JSON.parse(event.body || "{}");
    // Accept both shapes:
    items = body.items || body.line_items;
  } catch {
    return resp(400, { error: "Invalid JSON body" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return resp(400, { error: "Send items: [{ price:'price_xxx', quantity:1 }, ...]" });
  }

  // Validate each Price exists and belongs to this account/mode
  try {
    for (const it of items) {
      if (!it.price?.startsWith("price_")) {
        return resp(400, { error: `Invalid price format: ${it.price}` });
      }
      await stripe.prices.retrieve(it.price);
    }
  } catch (e) {
    return resp(400, { error: `Price check failed: ${e.message}` });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map(i => ({ price: i.price, quantity: i.quantity || 1 })),
      success_url: `${process.env.URL || "https://bargainhive.store"}/?success=true`,
      cancel_url:  `${process.env.URL || "https://bargainhive.store"}/?canceled=true`,
      automatic_tax: { enabled: false },
    });
    return resp(200, { id: session.id, url: session.url });
  } catch (e) {
    return resp(500, { error: `Stripe create session failed: ${e.message}` });
  }
};
