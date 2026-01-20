import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', subscription.id);

        // Call the Supabase stored procedure to revoke licenses
        const { data, error } = await supabase.rpc(
          'revoke_rewards_on_cancel',
          {
            stripe_subscription_id: subscription.id,
          }
        );

        if (error) {
          console.error('Error revoking rewards:', error);
          // Don't return error to Stripe - we want to acknowledge receipt
          // but we should investigate this issue
        } else {
          console.log('Successfully revoked licenses for subscription:', subscription.id);
        }
        break;
      }

      case 'customer.subscription.updated': {
        // Handle subscription updates (e.g., plan changes, status changes)
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id, 'Status:', subscription.status);

        // If subscription becomes inactive (e.g., past_due, canceled), revoke rewards
        if (['past_due', 'canceled', 'unpaid'].includes(subscription.status)) {
          const { data, error } = await supabase.rpc(
            'revoke_rewards_on_cancel',
            {
              stripe_subscription_id: subscription.id,
            }
          );

          if (error) {
            console.error('Error revoking rewards on status change:', error);
          } else {
            console.log('Revoked licenses due to subscription status:', subscription.status);
          }
        }
        break;
      }

      case 'customer.subscription.created': {
        // Handle new subscription creation
        const subscription = event.data.object as Stripe.Subscription;
        console.log('New subscription created:', subscription.id);
        
        // You might want to grant rewards here or handle initial setup
        // This would require knowing which user the subscription belongs to
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Required: disable body parsing for webhook verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
