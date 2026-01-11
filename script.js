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
        // Le total affiché sur le site reste le montant exact à payer (boisson + ouverture)
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

  let totalGlobal = 0;
  let totalSupplements = 0;

  document.querySelectorAll(".boisson").forEach((b) => {
    const nomBoisson = b.querySelector("h3").innerText.split("—")[0].trim();
    const prix = parseFloat(b.dataset.prix);
    const supplement = parseFloat(b.dataset.supplement) || 0;
    const qte = parseInt(b.querySelector("input").value) || 0;

    if (qte > 0) {
      // Calcul du prix juste pour les boissons (sans l'ouverture)
      const prixLigneBoisson = qte * prix;
      
      // On ajoute la ligne au message avec seulement le prix des boissons
      message += `• ${nomBoisson} x${qte} → ${prixLigneBoisson.toFixed(2)}€\n`;
      
      // On cumule les suppléments à part
      if (supplement > 0) {
          totalSupplements += supplement;
      }

      // Calcul du total réel à payer (Boissons + Suppléments)
      totalGlobal += prixLigneBoisson + supplement;
    }
  });

  // Si on a des frais d'ouverture, on les affiche en une seule ligne à la fin
  if (totalSupplements > 0) {
      message += `\n🍾 Total Ouvertures : ${totalSupplements.toFixed(2)} €`;
  }

  message += `\n\n💰 Total à payer : ${totalGlobal.toFixed(2)} €`;

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
