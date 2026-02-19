// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Hamburger Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  let menuOpen = false;
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.background = 'rgba(0,0,0,0.6)';
      navLinks.style.padding = '10px';
      navLinks.style.position = 'absolute';
      navLinks.style.right = '18px';
      navLinks.style.top = '60px';
      navLinks.style.borderRadius = '8px';
      const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

      // hamburger animation
      hamburger.classList.add('open');
    } else {
      navLinks.style.removeProperty('display');
      navLinks.style.removeProperty('flexDirection');
      navLinks.style.removeProperty('background');
      navLinks.style.removeProperty('padding');
      navLinks.style.removeProperty('position');
      navLinks.style.removeProperty('right');
      navLinks.style.removeProperty('top');
      navLinks.style.removeProperty('borderRadius');
      hamburger.classList.remove('open');
    }
  });
  

  // Transform hamburger bars when open
  hamburger.addEventListener('click', () => {
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('open')) {
      spans[0].style.transform = 'translateY(9px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Auto-scroll slider (medium = 2000ms)
  const scrollContainer = document.getElementById('scrollContainer');
  let autoScroll;
  function startAutoScroll() {
    autoScroll = setInterval(() => {
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (Math.ceil(scrollContainer.scrollLeft) >= maxScrollLeft - 2) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: 280, behavior: 'smooth' });
      }
    }, 2000); // 2000ms => medium
  }
  function stopAutoScroll() { clearInterval(autoScroll); }
  scrollContainer.addEventListener('mouseenter', stopAutoScroll);
  scrollContainer.addEventListener('mouseleave', startAutoScroll);
  startAutoScroll();

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
const track = document.getElementById("sliderTrack");
const copy = track.innerHTML;
track.innerHTML += copy; // duplicate for infinite loop
<script>
document.querySelectorAll('.bar-item').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 150);
  });
});
</script>
