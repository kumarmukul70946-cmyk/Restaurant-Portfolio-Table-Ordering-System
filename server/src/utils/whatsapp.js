import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

export const sendOrderWhatsApp = async (toPhone, orderSummary) => {
  if (!accountSid || !authToken || !fromNumber) {
    console.warn('WhatsApp/Twilio not configured. Skipping notification.');
    return { success: false, message: 'WhatsApp not configured' };
  }

  try {
    const client = twilio(accountSid, authToken);
    const to = toPhone.startsWith('whatsapp:') ? toPhone : `whatsapp:${toPhone.replace(/\D/g, '')}`;
    const message = await client.messages.create({
      body: orderSummary,
      from: fromNumber,
      to,
    });
    return { success: true, sid: message.sid };
  } catch (err) {
    console.error('WhatsApp send error:', err.message);
    return { success: false, message: err.message };
  }
};

export const formatOrderForWhatsApp = (order) => {
  const lines = [
    `Order #${order._id.toString().slice(-6)}`,
    `Table: ${order.tableNumber}`,
    `Items:`,
    ...order.items.map((i) => `  • ${i.name} x${i.quantity} - ₹${(i.price * i.quantity).toFixed(2)}`),
    `Total: ₹${order.total.toFixed(2)}`,
  ];
  return lines.join('\n');
};
