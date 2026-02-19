let currentService = "";

function openForm(service) {
    currentService = service;
    document.getElementById("selectedService").innerText = "Selected: " + service;
    document.getElementById("orderModal").style.display = "flex";
}

function closeForm() {
    document.getElementById("orderModal").style.display = "none";
}

document.getElementById("orderForm").addEventListener("submit", function(e){
    e.preventDefault();

    let name = document.getElementById("name").value;
    let location = document.getElementById("location").value;
    let phone = document.getElementById("phone").value;
    let notes = document.getElementById("notes").value;

    let message =
`📌 *New Laundry Order*
-----------------------------------
👤 Name: ${name}
📍 Location: ${location}
📞 Phone: ${phone}
🧼 Service: ${currentService}
📝 Notes: ${notes}
-----------------------------------
RoyalWashing`;

    let whatsapp = "https://wa.me/9526226011?text=" + encodeURIComponent(message);

    window.open(whatsapp, "_blank");

    closeForm();
});
// ================= ELEMENTS =================
const modal = document.querySelector(".booking-modal");
const serviceNameText = document.getElementById("serviceName");
const bookButtons = document.querySelectorAll(".service-card button");
const cancelButton = modal.querySelector("button[type='button']");
const form = modal.querySelector("form");

// ================= OPEN MODAL =================
bookButtons.forEach(button => {
  button.addEventListener("click", () => {
    const serviceTitle =
      button.closest(".service-card")
            .querySelector("h3")
            .innerText;

    serviceNameText.innerText = `Service: ${serviceTitle}`;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
});

// ================= CLOSE MODAL =================
function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

cancelButton.addEventListener("click", closeModal);

// Close when clicking outside modal box
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// ================= FORM SUBMIT =================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.querySelector("input[placeholder='Your Name']").value;
  const location = form.querySelector("input[placeholder='Your Location']").value;
  const phone = form.querySelector("input[placeholder='Phone Number']").value;
  const notes = form.querySelector("textarea").value;
  const service = serviceNameText.innerText;

  console.log({
    name,
    location,
    phone,
    notes,
    service
  });

  alert("✅ Booking submitted successfully!");

  form.reset();
  closeModal();
});
