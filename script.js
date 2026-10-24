"use strict";

const SITE_CONFIG = {
  whatsappNumber: "966533653387",
  phoneNumber: "+966533653387",
  mapsUrl: "https://maps.app.goo.gl/UE2SRgCkSvka9ir56?g_st=iw",
  reviewsUrl: "https://maps.app.goo.gl/UE2SRgCkSvka9ir56?g_st=iw",
  customOrdersEnabled: true,
};

// WhatsApp =========================================== //

function buildWhatsAppUrl(message) {
  const number = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");

  if (!number || number.includes("X") || number.length < 10) {
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function setLinkOrFallback(element, url, fallback = "#contact") {
  if (!element) return;

  element.href = url || fallback;

  if (url && url.startsWith("https://")) {
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  } else {
    element.removeAttribute("target");
    element.removeAttribute("rel");
  }
}

function configureWhatsAppLinks() {
  const generalMessage =
    "السلام عليكم، أرغب في الاستفسار عن الأثاث المتوفر لدى الفائز للأثاث.";

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    setLinkOrFallback(link, buildWhatsAppUrl(generalMessage));
  });

  document.querySelectorAll("[data-product]").forEach((link) => {
    const productName = link.dataset.product;

    const message =
      `السلام عليكم، أرغب في الاستفسار عن: ${productName}.\n` +
      "هل يمكن تزويدي بالتفاصيل والتوفر؟";

    setLinkOrFallback(link, buildWhatsAppUrl(message));
  });

  document.querySelectorAll("[data-custom-whatsapp]").forEach((link) => {
    const message =
      "السلام عليكم، أرغب في الاستفسار عن إمكانية تفصيل قطعة أثاث " +
      "بمقاسات محددة. هل يمكنني إرسال أبعاد المساحة وصورة للمكان؟";

    const url = SITE_CONFIG.customOrdersEnabled
      ? buildWhatsAppUrl(message)
      : null;

    setLinkOrFallback(link, url);
  });
}

function configurePhoneLinks() {
  const phone = SITE_CONFIG.phoneNumber.trim();

  const digits = phone.replace(/\D/g, "");

  const isValidPlaceholderFreeNumber =
    digits.length >= 10 && digits.length <= 15 && !/[xX]/.test(phone);

  document.querySelectorAll("[data-phone]").forEach((link) => {
    if (isValidPlaceholderFreeNumber) {
      link.href = `tel:+${digits}`;

      if (link.classList.contains("header-call")) {
        link.innerHTML = `<span aria-hidden='true'><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-phone preview-icon icon"
            >
              <path
                d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
              />
            </svg></span> اتصل بنا`;
      }
    } else {
      link.href = "#contact";
    }
  });
}

function configureMapLinks() {
  const mapUrl = SITE_CONFIG.mapsUrl;
  const reviewsUrl = SITE_CONFIG.reviewsUrl;

  document.querySelectorAll("[data-maps-location]").forEach((link) => {
    const isConfigured =
      mapUrl &&
      !mapUrl.includes("YOUR-") &&
      mapUrl !== "https://maps.google.com";

    setLinkOrFallback(link, isConfigured ? mapUrl : null);
  });

  document.querySelectorAll("[data-maps-reviews]").forEach((link) => {
    const isConfigured =
      reviewsUrl &&
      !reviewsUrl.includes("YOUR-") &&
      reviewsUrl !== "https://www.google.com/maps";

    setLinkOrFallback(link, isConfigured ? reviewsUrl : null);
  });
}

// Menu =========================================== //

function initializeMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-nav");

  if (!toggle || !navigation) return;

  function closeMenu() {
    navigation.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "فتح قائمة التنقل");
  }

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل",
    );
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

// Update Year =========================================== //

function initializeCopyrightYear() {
  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function initializeWebsite() {
  configureWhatsAppLinks();
  configurePhoneLinks();
  configureMapLinks();
  initializeMobileMenu();
  initializeCopyrightYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite);
} else {
  initializeWebsite();
}
