// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewArticleEmail(
  subscriber: { email: string },
  article: { title: string; description: string; slug: string },
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      //to: subscriber.email,
      to: 'zulfikar6556@gmail.com',
      subject: `New Article: ${article.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${article.title}</h2>
          <p style="color: #666; line-height: 1.6;">${article.description}</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/articles/${article.slug}" 
             style="display: inline-block; padding: 10px 20px; background-color: #000; 
                    color: #fff; text-decoration: none; margin-top: 20px;">
            Read More
          </a>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}
