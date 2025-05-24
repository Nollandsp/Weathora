// Transition du bouton
window.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("scrollToForecast");
  const target = document.getElementById("decouvrir");

  if (button && target) {
    button.addEventListener("click", function () {
      target.scrollIntoView({ behavior: "smooth" });
    });
  }
});
