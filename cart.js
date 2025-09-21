<!-- cart.js — tiny Stripe Checkout helper -->
<script>
// 1) Put your Stripe publishable key below (exact value from your Dashboard)
const stripe = Stripe("pk_test_51S0Zy5PS76jaeeTCadCITgeuqZuw8u32ENTRHvLbdY2QwqgPkiyALWxXLZAU8Smmobgx1m2VhvFt9NFfZ6xayqjY00ULLnlb7Y");

// 2) Call your Netlify function to create a session, then redirect.
async function startCheckout(lineItems) {
  // lineItems must contain price IDs: [{ price: "price_...", quantity: 1 }, ...]
  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ line_items: lineItems })
  });

  if (!res.ok) {
    // Make any server-side error visible to you while testing
    const text = await res.text().catch(() => "");
    throw new Error(`Checkout session failed: ${res.status} ${text}`);
  }

  // Your function should return either { id: "cs_test_..." } or { url: "https://checkout.stripe.com/..." }
  const data = await res.json();

  // If your function returns a URL, go there directly (best practice)
  if (data.url) {
    window.location.href = data.url;
    return;
  }

  // Fallback to redirectToCheckout when a sessionId is returned
  if (data.id) {
    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
    if (error) throw error;
    return;
  }

  throw new Error("Unexpected response from create-checkout-session.");
}

// Expose globally for your Buy buttons
window.startCheckout = startCheckout;
</script>
