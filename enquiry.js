document.addEventListener("DOMContentLoaded", () => {
  const enquiryForm = document.getElementById("enquiry-form");
  if (!enquiryForm) return; // Stop if not on enquiry page

  enquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    try {
      const res = await fetch("/submit-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Thank You for contacting us. We will reach you soon.");
        enquiryForm.reset();
      } else {
        alert("❌ Something went wrong while saving data.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("⚠️ Server error. Please try again later.");
    }
  });
});
