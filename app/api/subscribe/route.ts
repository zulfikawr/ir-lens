import { NextResponse } from 'next/server';
import { database } from '@/lib/firebase';
import { ref, set, get } from 'firebase/database';
import { subscriberSchema } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const enrichedBody = {
      ...body,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const result = subscriberSchema.safeParse(enrichedBody);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.format() },
        { status: 400 },
      );
    }

    const emailKey = result.data.email.replace(/\./g, ',');
    const subscriberRef = ref(database, `subscribers/${emailKey}`);

    const snapshot = await get(subscriberRef);
    if (snapshot.exists()) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 },
      );
    }

    await set(subscriberRef, result.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 },
    );
  }
}
