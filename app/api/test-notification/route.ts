// app/api/test-notification/route.ts
import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { sendNewArticleEmail } from "@/lib/email";
import { Subscriber, subscriberSchema } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const testArticle = {
      title: "Test Article",
      description: "This is a test notification.",
      slug: "test-article"
    };
    
    const subscribersRef = ref(database, 'subscribers');
    const snapshot = await get(subscribersRef);
    
    if (!snapshot.exists()) {
      return NextResponse.json({ success: true, message: 'No subscribers found' });
    }

    const subscribers: Subscriber[] = [];
    snapshot.forEach((childSnapshot) => {
      const rawSubscriber = childSnapshot.val();
      const result = subscriberSchema.safeParse(rawSubscriber);
      if (result.success && result.data.status === 'active') {
        subscribers.push(result.data);
      }
    });

    // Send test email to first subscriber only
    const firstSubscriber = subscribers[0];
    if (firstSubscriber) {
      await sendNewArticleEmail(firstSubscriber, testArticle);
      return NextResponse.json({ 
        success: true, 
        message: `Test email sent to ${firstSubscriber.email}` 
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'No active subscribers found' 
    });
  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send test notification' },
      { status: 500 }
    );
  }
}