import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Tier price mapping (cents)
const TIER_AMOUNTS: Record<string, number> = {
  tap: 199,
  double_tap: 499,
  long_press: 999,
  hold_heart: 2499,
};

const TIER_LABELS: Record<string, string> = {
  tap: 'Quick Tap',
  double_tap: 'Double Tap',
  long_press: 'Long Press',
  hold_heart: 'Hold My Heart',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier, donorName, donorEmail, donorPhone, message, isAnonymous } = body;

    // Validate tier
    if (!tier || !TIER_AMOUNTS[tier]) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be: tap, double_tap, long_press, or hold_heart' },
        { status: 400 }
      );
    }

    const amount = TIER_AMOUNTS[tier];
    const label = TIER_LABELS[tier];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `GPM Heart-Tap: ${label}`,
              description: `Support G. Putnam Music - ${label} tier gift`,
              images: ['https://www.gputnammusic.com/og-image.png'],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gift/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gift?cancelled=true`,
      metadata: {
        tier,
        donorName: donorName || '',
        donorEmail: donorEmail || '',
        donorPhone: donorPhone || '',
        message: message || '',
        isAnonymous: isAnonymous ? 'true' : 'false',
      },
    });

    // Create pending donation record in Supabase
    const { error: dbError } = await supabase.from('gpm_donations').insert({
      stripe_session_id: session.id,
      donor_name: isAnonymous ? 'Anonymous' : (donorName || null),
      donor_email: donorEmail || null,
      donor_phone: donorPhone || null,
      amount_cents: amount,
      tier,
      message: message || null,
      is_anonymous: isAnonymous || false,
      grand_prize_eligible: tier !== 'tap',
      status: 'pending',
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      // Don't block checkout - log and continue
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
