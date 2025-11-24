const boissons = document.querySelectorAll(".boisson");
const formulaire = document.getElementById("commande-form");

let selection = "";

// Sélection d'une boisson
boissons.forEach((boisson) => {
  boisson.addEventListener("click", () => {
    boissons.forEach((b) => b.classList.remove("active"));
    boisson.classList.add("active");
    selection = boisson.dataset.nom;
  });
});

// Envoi du formulaire
formulaire.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!selection) {
    alert("Sélectionne une boisson !");
    return;
  }

  const data = {
    message: {
      text: selection,
    },
  };

  fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((r) => {
      console.log("Réponse serveur :", r);
      alert("Commande envoyée !");
    })
    .catch((err) => {
      console.error(err);
      alert("❌ Erreur d’envoi.");
    });
});
