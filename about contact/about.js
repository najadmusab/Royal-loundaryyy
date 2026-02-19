// Reveal on scroll animation
const items = document.querySelectorAll(".fade, .fade-up, .mv-card, .choose-card");

function reveal() {
  items.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);
