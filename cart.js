// cart.js — Stripe Checkout helper (TEST MODE)

// Your TEST publishable key:
const stripe = Stripe("pk_test_51S0Zy5PS76jaeeTCadCITgeuqZuw8u32ENTRHvLbdY2QwqgPkiyALWxXLZAU8Smmobgx1m2VhvFt9NFfZ6xayqjY00ULLnlb7Y");

// Call startCheckout([{ price:'price_xxx', quantity:1 }])
async function startCheckout(lineItems) {
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    alert("Nothing to buy yet."); 
    throw new Error("No line items provided.");
  }

  let res, data;
  try {
    res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // FIX: the function expects `items`, not `line_items`
      body: JSON.stringify({ items: lineItems, mode: "payment" })
    });
  } catch (e) {
    console.error("Network error:", e);
    alert("Network error talking to the server.");
    throw e;
  }

  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) {
    console.error(`Checkout session failed: ${res.status}`, data);
    alert(data?.error || "Checkout could not start.");
    throw new Error(`Checkout failed: ${res.status} ${JSON.stringify(data)}`);
  }

  // Prefer direct URL if present, else use session id
  if (data.url) { window.location.href = data.url; return; }
  if (!data.id && !data.sessionId) { alert("No session id returned."); return; }

  const { error } = await stripe.redirectToCheckout({ sessionId: data.id || data.sessionId });
  if (error) { console.error(error); alert(error.message || "Stripe redirection failed."); }
}

window.startCheckout = startCheckout;
