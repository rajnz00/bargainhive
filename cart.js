// cart.js — Stripe Checkout helper (test mode)
const stripe = Stripe("pk_test_51S0Zy5PS76jaeeTCadCITgeuqZuw8u32ENTRHvLbdY2QwqgPkiyALWxXLZAU8Smmobgx1m2VhvFt9NFfZ6xayqjY00ULLnlb7Y");

async function startCheckout(lineItems) {
  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ line_items: lineItems })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Checkout session failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  if (data.url) { window.location.href = data.url; return; }

  if (data.id) {
    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
    if (error) throw error;
    return;
  }

  throw new Error("Unexpected response from create-checkout-session.");
}

window.startCheckout = startCheckout;
