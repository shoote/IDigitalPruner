document.addEventListener("DOMContentLoaded", () => {
  // ===== Navbar Hamburger =====
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const dropdowns = document.querySelectorAll(".dropdown");

  // Hamburger toggle (mobile)
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Close mobile menu when normal link clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992 && !link.closest(".dropdown")) {
        navLinks.classList.remove("active");
      }
    });
  });

  // Dropdown toggle on click
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector("a");
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault(); // prevent link navigation
        dropdown.classList.toggle("active");
      });

      // Close dropdown on mouse leave (desktop only)
      dropdown.addEventListener("mouseleave", () => {
        if (window.innerWidth > 992) { // only for PC version
          dropdown.classList.remove("active");
        }
      });
    }
  });

  // Close dropdown if clicking outside
  document.addEventListener("click", (e) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target) && window.innerWidth > 992) {
        dropdown.classList.remove("active");
      }
    });
  });


  // ===== Home Image Fade =====
  const fadeImage = document.querySelector(".fade-image");
  if (fadeImage) {
    window.addEventListener("scroll", () => {
      let scrollY = window.scrollY;
      let opacity = 1 - scrollY / 180;
      fadeImage.style.opacity = opacity < 0 ? 0 : opacity;
    });
  }

  // ===== Currency Switcher =====
  const currencyBtn = document.getElementById("currency-btn");
  const currencyDropdown = document.getElementById("currency-dropdown");
  const currentCurrency = document.getElementById("current-currency");
  const prices = document.querySelectorAll(".price");

  if (currencyBtn && currencyDropdown && currentCurrency && prices) {
    let selectedCurrency = "INR";

    function updatePrices(currency) {
      let symbol = currency === "USD" ? "$" : "₹";
      currentCurrency.textContent = `${symbol} ${currency}`;
      prices.forEach((priceEl) => {
        priceEl.textContent =
          symbol + " " + (currency === "USD" ? priceEl.dataset.usd : priceEl.dataset.inr);
      });
    }

    updatePrices(selectedCurrency);

    currencyBtn.addEventListener("click", () => {
      currencyDropdown.style.display =
        currencyDropdown.style.display === "block" ? "none" : "block";
    });

    currencyDropdown.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", () => {
        selectedCurrency = item.getAttribute("data-currency");
        updatePrices(selectedCurrency);
        currencyDropdown.style.display = "none";
      });
    });

    document.addEventListener("click", (e) => {
      if (!currencyBtn.contains(e.target) && !currencyDropdown.contains(e.target)) {
        currencyDropdown.style.display = "none";
      }
    });
  }

  // ===== Auth Form Toggle =====
  const signinBtn = document.getElementById("signin-btn");
  const registerBtn = document.getElementById("register-btn");
  const signinForm = document.getElementById("signin-form");
  const registerForm = document.getElementById("register-form");
  const gotoSignin = document.getElementById("goto-signin");
  const gotoRegister = document.getElementById("goto-register");

  if (signinBtn && registerBtn && signinForm && registerForm) {
    signinBtn.addEventListener("click", () => {
      signinBtn.classList.add("active");
      registerBtn.classList.remove("active");
      signinForm.classList.add("active");
      registerForm.classList.remove("active");
    });

    registerBtn.addEventListener("click", () => {
      registerBtn.classList.add("active");
      signinBtn.classList.remove("active");
      registerForm.classList.add("active");
      signinForm.classList.remove("active");
    });
  }

  if (gotoSignin) {
    gotoSignin.addEventListener("click", () => {
      signinBtn.classList.add("active");
      registerBtn.classList.remove("active");
      signinForm.classList.add("active");
      registerForm.classList.remove("active");
    });
  }

  if (gotoRegister) {
    gotoRegister.addEventListener("click", () => {
      registerBtn.classList.add("active");
      signinBtn.classList.remove("active");
      registerForm.classList.add("active");
      signinForm.classList.remove("active");
    });
  }

  // ===== Enquiry Form Submission =====
  const enquiryForm = document.getElementById("enquiry-form");

  if (enquiryForm) {
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
  }
});
