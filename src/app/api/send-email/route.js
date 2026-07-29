import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { customerName, customerContact, items, total } = await request.json();

  const itemsList = items.map(item => 
    `${item.name} x${item.qty} = ${(item.price * item.qty).toLocaleString()} MNT`
  ).join('\n');

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'Info@taaz.mn',
      subject: `Шинэ захиалга - ${customerName}`,
      text: `
Шинэ захиалга ирлээ!

Захиалагч: ${customerName}
Холбоо барих: ${customerContact}

Захиалсан бараа:
${itemsList}

Нийт дүн: ${total.toLocaleString()} MNT
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}