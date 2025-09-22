// Netlify serverless function for Stripe Checkout
// Save this file as: functions/create-checkout-session.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    // Parse incoming body
    const { line_items } = JSON.parse(event.body || '{}');

    if (!Array.isArray(line_items) || line_items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid line_items array.' }),
      };
    }

    // Use Netlify's URL or fallback
    const baseUrl = process.env.URL || 'https://bargainhive.store';

    // Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${baseUrl}/#home?checkout=success`,
      cancel_url: `${baseUrl}/#categories?checkout=cancel`,
      allow_promotion_codes: true,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url, id: session.id }),
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Stripe error: ${err.message}` }),
    };
  }
};
