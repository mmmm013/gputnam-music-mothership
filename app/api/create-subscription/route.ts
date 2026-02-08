import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

// SponsorSHIP tier pricing (cents/month)
const TIER_AMOUNTS: Record<string, number> = {
  kayak: 500,
  speedboat: 1000,
  clipper: 2500,
  cruiseliner: 10000,
};

const TIER_LABELS: Record<string, string> = {
  kayak: 'Kayak — Solo Paddler',
  speedboat: 'Speedboat — Fast Lane',
  clipper: 'Clipper — Full Sails',
  cruiseliner: 'Cruiseliner — The Captain',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier } = body;

    if (!tier || !TIER_AMOUNTS[tier]) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be: kayak, speedboat, clipper, or cruiseliner' },
        { status: 400 }
      );
    }

    const amount = TIER_AMOUNTS[tier];
    const label = TIER_LABELS[tier];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gputnammusic.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `GPM SponsorSHIP: ${label}`,
              description: 'Monthly SponsorSHIP — 100% fuels development & artist support',
              images: ['https://www.gputnammusic.com/og-image.png'],
            },
            unit_amount: amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/join?success=true&tier=${tier}`,
      cancel_url: `${baseUrl}/join?cancelled=true`,
      metadata: {
        tier,
        source: 'sponsorship_join',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Subscription checkout error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create subscription checkout' },
      { status: 500 }
    );
  }
}
