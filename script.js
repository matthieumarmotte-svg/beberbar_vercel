const selects = document.querySelectorAll(".select-variante");
const totalElement = document.getElementById("total");

const updateTotal = () => {
  let totalVisuel = 0;
  selects.forEach((select) => {
    const option = select.options[select.selectedIndex];
    totalVisuel += parseFloat(option.dataset.prix) || 0;
  });
  totalElement.textContent = totalVisuel.toFixed(2);
};

selects.forEach((select) => {
  select.addEventListener("change", updateTotal);
});

document.getElementById("commande-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  
  let message = `🍹 *Nouvelle commande !*\n👤 ${formData.get("prenom")} ${formData.get("nom")} (${formData.get("insta")})\n\n`;
  let totalGlobal = 0;

  selects.forEach((select) => {
    const option = select.options[select.selectedIndex];
    const prix = parseFloat(option.dataset.prix) || 0;
    if (prix > 0) {
      message += `• ${select.name} : ${option.text}\n`;
      totalGlobal += prix;
    }
  });

  message += `\n💰 *Total à encaisser : ${totalGlobal.toFixed(2)} €*`;

  fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: { text: message } }),
  })
  .then(() => alert("✅ Commande envoyée !"))
  .catch(() => alert("❌ Erreur."));
});
