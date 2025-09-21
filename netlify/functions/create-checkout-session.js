// netlify/functions/create-checkout-session.js
const Stripe = require('stripe');

// Expect STRIPE_SECRET_KEY in Netlify env (test or live)
// e.g. sk_test_... (for test mode) or sk_live_... (for live)
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // CORS for local testing and Netlify preview
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { line_items } = JSON.parse(event.body || "{}");
    if (!Array.isArray(line_items) || line_items.length === 0) {
      return { statusCode: 400, body: "Missing or empty line_items" };
    }

    // Success/Cancel: set in Netlify env or fallback
    const successUrl = process.env.SUCCESS_URL || "https://bargainhive.store/#home";
    const cancelUrl  = process.env.CANCEL_URL  || "https://bargainhive.store/#categories";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,                    // [{ price: 'price_...', quantity: 1 }]
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Optional: collect shipping, phone, etc.
      // shipping_address_collection: { allowed_countries: ['NZ','AU'] },
      // phone_number_collection: { enabled: true },
      allow_promotion_codes: true
    });

    // Best practice: return the hosted Checkout URL directly
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ url: session.url, id: session.id })
    };
  } catch (err) {
    console.error("Stripe error:", err);
    return {
      statusCode: 500,
      body: `Stripe error: ${err.message || "Unknown error"}`
    };
  }
};
