// ============================
//      GESTION DES BOISSONS
// ============================

const boissons = document.querySelectorAll(".boisson");
const totalElement = document.getElementById("total");

boissons.forEach((boisson) => {
  const moins = boisson.querySelector(".moins");
  const plus = boisson.querySelector(".plus");
  const input = boisson.querySelector("input");

  const updateTotal = () => {
    let total = 0;
    document.querySelectorAll(".boisson").forEach((b) => {
      const qte = parseInt(b.querySelector("input").value) || 0;
      const prix = parseFloat(b.dataset.prix);
      const supplement = parseFloat(b.dataset.supplement) || 0;

      if (qte > 0) {
        total += qte * prix + supplement;
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

// ============================
//      GESTION DE LA COMMANDE
// ============================

document.getElementById("commande-form").addEventListener("submit", function (e) {
  e.preventDefault(); // rester sur la même page

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

  // ============================
  //         ENVOI TELEGRAM
  // ============================

  fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        text: message
      }
    }),
  })
    .then(() => {
      alert("✅ Votre commande a été envoyée !");
    })
    .catch((err) => {
      console.error(err);
      alert("❌ Erreur d’envoi. Réessayez plus tard.");
    });
});
