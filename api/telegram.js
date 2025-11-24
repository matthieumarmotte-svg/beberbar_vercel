export async function handler(event) {
  const data = JSON.parse(event.body); // récupère le message envoyé depuis le navigateur

  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: data.message,
      parse_mode: "Markdown"
    })
  });

  const result = await response.json();
  return { statusCode: 200, body: JSON.stringify(result) };
}
