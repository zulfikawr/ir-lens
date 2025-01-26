import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";
import { subscriberSchema } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = subscriberSchema.safeParse(body);

    if (!result.success) {
      // Explicitly define the type of zodErrors
      const zodErrors: Record<string, string> = {}; // Record with string keys and string values
      result.error.issues.forEach((issue) => {
        zodErrors[issue.path[0]] = issue.message;
      });
      return NextResponse.json({ errors: zodErrors }, { status: 400 });
    }

    // Convert email to a valid Firebase key by replacing . with ,
    const emailKey = result.data.email.replace(/\./g, ',');
    const subscriberRef = ref(database, `subscribers/${emailKey}`);

    // Check if subscriber already exists
    const snapshot = await get(subscriberRef);
    if (snapshot.exists()) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Add new subscriber
    await set(subscriberRef, {
      email: result.data.email,
      preferences: result.data.preferences,
      status: 'active',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
