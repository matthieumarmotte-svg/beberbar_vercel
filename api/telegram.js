export const config = {
  api: {
    bodyParser: false, // On désactive pour gérer nous-mêmes
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "OK" });
  }

  // Lire le RAW body depuis la requête (spécifique à Vercel)
  const rawBody = await new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(body);
    });
  });

  let bodyJson = {};
  try {
    bodyJson = JSON.parse(rawBody);
  } catch (e) {
    console.error("Erreur parsing JSON:", e);
  }

  // Récupération du message Telegram
  const userMessage = bodyJson?.message?.text || "Message vide";

  // Envoi au Telegram ADMIN
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const sendUrl = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  const telegramResponse = await fetch(sendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: `Nouvelle commande : ${userMessage}`,
    }),
  });

  const data = await telegramResponse.json();

  return res.status(200).json({ ok: true, messageSent: data });
}
