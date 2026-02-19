function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("show");
}

// CONTACT FORM MESSAGE
document.getElementById("contactForm").addEventListener("submit", function(e){
    e.preventDefault();

    document.getElementById("formMsg").classList.remove("hidden");

    setTimeout(() => {
        document.getElementById("formMsg").classList.add("hidden");
    }, 3000);
});
