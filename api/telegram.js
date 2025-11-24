export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "OK" });
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  const body = req.body;

  const userMessage = body?.message?.text || "Message vide";
  
  const sendUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const result = await fetch(sendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `Nouvelle commande : ${userMessage}`,
    }),
  });

  const data = await result.json();

  return res.status(200).json({ ok: true, telegram: data });
}
