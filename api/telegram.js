export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, message: "Ready" });
  }

  const TELEGRAM_BOT_TOKEN = "8449993558:AAE8DBnTMqoMAaRedgCszQEltTW1fVNOYAg";  
  const TELEGRAM_CHAT_ID = "6211317081";

  const rawBody = await new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });

  let update = {};
  try {
    update = JSON.parse(rawBody);
  } catch (err) {
    console.error("Erreur JSON :", err);
  }

  console.log("Message reçu :", update);

  const userMessage = update?.message?.text || "(aucun message)";

  const sendUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(sendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `Nouvelle commande : ${userMessage}`,
    }),
  });

  const result = await response.json();
  console.log("Réponse Telegram :", result);

  return res.status(200).json({ ok: true });
}
