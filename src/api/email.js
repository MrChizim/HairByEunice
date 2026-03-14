// EmailJS — sends emails directly from the browser, no backend needed.
// Sign up free at https://emailjs.com, create a service + template, then add these to your .env file:
//   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
//   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
//   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx

const SERVICE_ID   = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID  = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY  = import.meta.env.VITE_EMAILJS_PRIVATE_KEY;

// Sends a booking notification email to Eunice.
// The EmailJS template should use these variables:
//   {{client_name}}, {{client_email}}, {{client_phone}},
//   {{service}}, {{date}}, {{time}}, {{location}}, {{notes}}, {{price}}
export async function sendBookingNotification(booking, serviceName, price) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !PRIVATE_KEY) {
    console.warn('EmailJS not configured — skipping email notification.');
    return;
  }

  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    accessToken: PRIVATE_KEY,
    template_params: {
      client_name:  booking.client_name,
      client_email: booking.email,
      client_phone: booking.phone,
      service_name: serviceName || booking.service_name,
      date:         booking.date,
      time:         booking.time,
      location:     booking.location,
      notes:        booking.notes || 'None',
      price:        price ? `${price}` : '',
    },
  };

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('EmailJS error:', text);
  }
}
