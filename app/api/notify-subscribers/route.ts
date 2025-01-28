import { NextResponse } from 'next/server';
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { sendNewArticleEmail } from '@/lib/email';
import { Subscriber, subscriberSchema } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { article } = await request.json();

    const subscribersRef = ref(database, 'subscribers');
    const snapshot = await get(subscribersRef);

    if (!snapshot.exists()) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers found',
      });
    }

    const subscribers: Subscriber[] = [];
    snapshot.forEach((childSnapshot) => {
      const rawSubscriber = childSnapshot.val();
      const result = subscriberSchema.safeParse(rawSubscriber);
      if (result.success && result.data.status === 'active') {
        subscribers.push(result.data);
      }
    });

    const emailPromises = subscribers.map((subscriber) =>
      sendNewArticleEmail(subscriber, article),
    );

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      subscribersNotified: subscribers.length,
    });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Failed to notify subscribers' },
      { status: 500 },
    );
  }
}
