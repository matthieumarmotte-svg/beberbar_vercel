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
    let totalVisuel = 0;
    document.querySelectorAll(".boisson").forEach((b) => {
      const qte = parseInt(b.querySelector("input").value) || 0;
      const prix = parseFloat(b.dataset.prix);
      
      // ICI : On ne calcule QUE le prix de base pour l'affichage client
      // On ignore le supplement (frais d'ouverture) pour le total écran
      if (qte > 0) {
        totalVisuel += qte * prix; 
      }
    });
    totalElement.textContent = totalVisuel.toFixed(2);
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

  let totalGlobalReel = 0; // Le vrai total (pour toi)
  let totalSupplements = 0; // Le total des ouvertures

  document.querySelectorAll(".boisson").forEach((b) => {
    // On récupère le nom propre
    const nomBoisson = b.querySelector("h3").innerText.split("—")[0].trim();
    const prix = parseFloat(b.dataset.prix);
    const supplement = parseFloat(b.dataset.supplement) || 0;
    const qte = parseInt(b.querySelector("input").value) || 0;

    if (qte > 0) {
      // Prix de la ligne (juste la boisson)
      const prixLigneBoisson = qte * prix;
      
      // On ajoute la ligne au message Telegram
      message += `• ${nomBoisson} x${qte} → ${prixLigneBoisson.toFixed(2)}€\n`;
      
      // Calcul des totaux pour toi
      if (supplement > 0) {
          totalSupplements += supplement; // On cumule les ouvertures
      }
      
      // Le total global inclut tout (boisson + ouverture)
      totalGlobalReel += prixLigneBoisson + supplement;
    }
  });

  // Affichage des suppléments séparés dans Telegram
  if (totalSupplements > 0) {
      message += `\n🍾 Total Ouvertures : ${totalSupplements.toFixed(2)} €`;
  }

  // Affichage du vrai total à encaisser dans Telegram
  message += `\n\n💰 Total à payer : ${totalGlobalReel.toFixed(2)} €`;

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
