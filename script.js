const boissons = document.querySelectorAll(".boisson");
const totalElement = document.getElementById("total");

boissons.forEach((boisson) => {
  const moins = boisson.querySelector(".moins");
  const plus = boisson.querySelector(".plus");
  const input = boisson.querySelector("input");
  const prix = parseFloat(boisson.dataset.prix);

  const updateTotal = () => {
  let total = 0;
  document.querySelectorAll(".boisson").forEach((b) => {
    const qte = parseInt(b.querySelector("input").value) || 0;
    const prixBoisson = parseFloat(b.dataset.prix);
    const supplement = parseFloat(b.dataset.supplement) || 0;

    if (qte > 0) {
      total += qte * prixBoisson + supplement;
    }
  });
  totalElement.textContent = total.toFixed(2);
  };


  moins.addEventListener("click", () => {
    if (input.value > 0) input.value--;
    updateTotal();
  });

  plus.addEventListener("click", () => {
    input.value++;
    updateTotal();
  });

  input.addEventListener("input", updateTotal);
});

function showConfirmation() {
  alert("✅ Votre commande a été envoyée ! Elle arrive bientôt 🍹");
  return true; // permet à Netlify d'envoyer quand même le formulaire
}

// === CONFIGURE TON BOT ICI ===
const TELEGRAM_BOT_TOKEN = "8449993558:AAE8DBnTMqoMAaRedgCszQEltTW1fVNOYAg";
const TELEGRAM_CHAT_ID = "6211317081";

// === ENVOI AUTOMATIQUE SUR TELEGRAM ===
document.getElementById("commande-form").addEventListener("submit", function (e) {
  e.preventDefault(); // empêche le rechargement immédiat de la page

  const formData = new FormData(this);
  const prenom = formData.get("prenom");
  const nom = formData.get("nom");
  const insta = formData.get("insta");
  let message = `🍹 *Nouvelle commande !*\n👤 ${prenom} ${nom} ${insta}\n\n`;

  let total = 0;
  document.querySelectorAll(".boisson").forEach((b) => {
  const nomBoisson = b.querySelector("h3").innerText.split("—")[0].trim();
  const prix = parseFloat(b.dataset.prix);
  const supplement = parseFloat(b.dataset.supplement) || 0;
  const qte = parseInt(b.querySelector("input").value) || 0;
  if (qte > 0) {
    const sousTotal = qte * prix + supplement;
    message += `• ${nomBoisson} x${qte} → ${sousTotal.toFixed(2)}€\n`;
    total += sousTotal;
    }
  });


  message += `\n💰 Total : ${total.toFixed(2)} €`;

  fetch("/.netlify/functions/telegram", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
  })
    .then(() => {
      alert("✅ Votre commande a été envoyée ! Elle arrive bientôt 🍹");
      e.target.submit(); // ensuite on envoie le formulaire à Netlify
    })
    .catch((err) => {
      console.error(err);
      alert("❌ Erreur d’envoi. Réessayez plus tard.");
    });
});
