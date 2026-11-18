(function () {
  "use strict";

  const languageKey = "narecafe-language";
  const storedLanguage = (() => {
    try {
      return localStorage.getItem(languageKey);
    } catch (error) {
      return null;
    }
  })();
  const browserLanguage = (navigator.language || "").toLowerCase().startsWith("en") ? "en" : "es";
  let currentLanguage = window.location.pathname.startsWith("/en")
    ? "en"
    : (storedLanguage || browserLanguage);

  function saveLanguage(language) {
    try {
      localStorage.setItem(languageKey, language);
    } catch (error) {
      // Language switching still works when storage is unavailable.
    }
  }

  function applyLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;
    const dictionary = window.NARECAFE_TRANSLATIONS && window.NARECAFE_TRANSLATIONS[language];
    if (!dictionary) return;

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      const key = element.dataset.i18n;
      if (dictionary[key] !== undefined) element.innerHTML = dictionary[key];
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (element) {
      const key = element.dataset.i18nAlt;
      if (dictionary[key] !== undefined) element.alt = dictionary[key];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (element) {
      const key = element.dataset.i18nAria;
      if (dictionary[key] !== undefined) element.setAttribute("aria-label", dictionary[key]);
    });
    document.querySelectorAll("[data-i18n-content]").forEach(function (element) {
      const key = element.dataset.i18nContent;
      if (dictionary[key] !== undefined) element.setAttribute("content", dictionary[key]);
    });

    document.title = dictionary.title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (ogTitle) ogTitle.setAttribute("content", dictionary.title);
    if (ogDescription) ogDescription.setAttribute("content", dictionary.ogDescription);
    if (ogLocale) ogLocale.setAttribute("content", language === "en" ? "en_US" : "es_CR");
    if (canonical) canonical.setAttribute("href", language === "en" ? "https://narecafe.org/en/" : "https://narecafe.org/");

    const toggle = document.getElementById("language-toggle");
    if (toggle) {
      toggle.querySelector(".flag").className = "flag " + (language === "en" ? "flag-us" : "flag-cr");
      toggle.querySelector(".language-name").textContent = language === "en" ? "EN" : "ES";
    }

    document.querySelectorAll("[data-language]").forEach(function (link) {
      link.setAttribute("aria-current", link.dataset.language === language ? "page" : "false");
    });

    window.dispatchEvent(new CustomEvent("narecafe-language-change", { detail: { language: language } }));
  }

  applyLanguage(currentLanguage);

  const languageLinks = document.querySelectorAll("[data-language]");
  languageLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const language = link.dataset.language;
      saveLanguage(language);
      window.history.pushState({}, "", language === "en" ? "/en/" : "/");
      applyLanguage(language);
    });
  });

  const languageToggle = document.getElementById("language-toggle");
  if (languageToggle) {
    languageToggle.addEventListener("click", function () {
      const nextLanguage = currentLanguage === "es" ? "en" : "es";
      saveLanguage(nextLanguage);
      window.history.pushState({}, "", nextLanguage === "en" ? "/en/" : "/");
      applyLanguage(nextLanguage);
    });
  }

  const siteHeader = document.querySelector(".site-header");
  let lastScrollPosition = window.scrollY;
  let headerTicking = false;

  function updateHeader() {
    const currentScrollPosition = window.scrollY;
    const menuIsOpen = document.body.classList.contains("menu-open");
    const dialogIsOpen = document.body.classList.contains("dialog-open");
    const movingDown = currentScrollPosition > lastScrollPosition;
    const scrollAmount = Math.abs(currentScrollPosition - lastScrollPosition);

    if (!menuIsOpen && !dialogIsOpen && scrollAmount > 6) {
      if (movingDown && currentScrollPosition > 88) {
        siteHeader.classList.add("header-hidden");
      } else if (!movingDown) {
        siteHeader.classList.remove("header-hidden");
      }
    }

    lastScrollPosition = currentScrollPosition;
    headerTicking = false;
  }

  window.addEventListener("scroll", function () {
    if (!headerTicking) {
      window.requestAnimationFrame(updateHeader);
      headerTicking = true;
    }
  }, { passive: true });

  const menu = document.getElementById("mobile-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuBackdrop = document.querySelector(".menu-backdrop");
  const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
  let menuLabels = currentLanguage === "en"
    ? { open: "Open menu", close: "Close menu" }
    : { open: "Abrir menú", close: "Cerrar menú" };
  let menuTrigger = null;

  window.addEventListener("narecafe-language-change", function (event) {
    menuLabels = event.detail.language === "en"
      ? { open: "Open menu", close: "Close menu" }
      : { open: "Abrir menú", close: "Cerrar menú" };
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-label", isOpen ? menuLabels.close : menuLabels.open);
  });

  function setMenu(open) {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? menuLabels.close : menuLabels.open);
    menuBackdrop.hidden = !open;
    document.body.classList.toggle("menu-open", open);

    if (open) {
      menuTrigger = document.activeElement;
      window.requestAnimationFrame(function () {
        menu.querySelector("button").focus();
      });
    } else if (menuTrigger) {
      menuTrigger.focus();
    }
  }

  menuToggle.addEventListener("click", function () {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  menuCloseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setMenu(false);
    });
  });

  menu.querySelectorAll("a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (element) {
      observer.observe(element);
    });
  } else {
    reveals.forEach(function (element) {
      element.classList.add("visible");
    });
  }

  const galleryGrid = document.getElementById("gallery-grid");
  const galleryMore = document.getElementById("gallery-more");
  const initialGalleryCount = 12;
  const totalPhotos = 41;
  const pathPrefix = "/";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const photoRatios = [
    "2200/1467", "2200/1467", "2200/1467", "2200/1467", "2200/1467",
    "2200/1467", "2200/1467", "2200/1467", "2200/1467", "2200/1467",
    "2200/1467", "2200/1467", "2200/1467", "2200/1467", "2200/1467",
    "2200/1467", "2200/1467", "2200/1467", "1467/2200", "2200/1467",
    "2200/1467", "2200/1467", "2200/1467", "2200/1467", "2200/1467",
    "2200/1467", "2200/1467", "2200/1467", "2200/1467", "2200/1467",
    "2200/1467", "2200/1467", "2200/1467", "2200/1467", "2200/1467",
    "2200/1467", "2200/1467", "2200/1467", "2200/1467", "2200/1467",
    "2200/1467"
  ];
  const galleryButtons = [];
  let galleryExpanded = false;

  const galleryLabels = {
    es: {
      open: "Ver fotografía {number}",
      more: "Ver más fotografías",
      less: "Volver a 12 fotografías"
    },
    en: {
      open: "View photograph {number}",
      more: "See more photographs",
      less: "Back to 12 photographs"
    }
  }[currentLanguage];

  function updateGalleryLanguage(language) {
    const labels = language === "en"
      ? { open: "View photograph {number}", more: "See more photographs", less: "Back to 12 photographs" }
      : { open: "Ver fotografía {number}", more: "Ver más fotografías", less: "Volver a 12 fotografías" };
    galleryMore.textContent = galleryExpanded ? labels.less : labels.more;
    galleryButtons.forEach(function (button, index) {
      button.setAttribute("aria-label", labels.open.replace("{number}", index + 1));
      const image = button.querySelector("img");
      if (image) image.alt = language === "en"
        ? "NARECAFÉ photograph " + (index + 1)
        : "Fotografía de NARECAFÉ " + (index + 1);
    });
    if (dialog.open) updateDialog(activePhoto);
  }

  window.addEventListener("narecafe-language-change", function (event) {
    updateGalleryLanguage(event.detail.language);
  });

  for (let index = 1; index <= totalPhotos; index += 1) {
    const number = String(index).padStart(2, "0");
    const item = document.createElement("li");
    item.className = "gallery-item";
    item.hidden = index > initialGalleryCount;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-button";
    button.dataset.photoIndex = String(index - 1);
    button.style.aspectRatio = photoRatios[index - 1];
    button.setAttribute("aria-label", galleryLabels.open.replace("{number}", index));

    const image = document.createElement("img");
    image.src = pathPrefix + "assets/images/foto-" + number + ".webp";
    image.alt = currentLanguage === "en" ? "NARECAFÉ photograph " + index : "Fotografía de NARECAFÉ " + index;
    image.loading = index <= initialGalleryCount ? "eager" : "lazy";
    image.decoding = "async";
    image.style.aspectRatio = photoRatios[index - 1];
    image.addEventListener("load", function () {
      image.classList.add("loaded");
    });

    button.appendChild(image);
    item.appendChild(button);
    galleryGrid.appendChild(item);
    galleryButtons.push(button);
  }

  galleryMore.textContent = galleryLabels.more;
  galleryMore.addEventListener("click", function () {
    galleryExpanded = !galleryExpanded;
    Array.from(galleryGrid.children).forEach(function (item, index) {
      item.hidden = !galleryExpanded && index >= initialGalleryCount;
    });
    galleryMore.setAttribute("aria-expanded", String(galleryExpanded));
    galleryMore.textContent = galleryExpanded ? galleryLabels.less : galleryLabels.more;
  });

  const dialog = document.getElementById("image-dialog");
  const dialogImage = document.getElementById("dialog-image");
  const dialogCounter = document.getElementById("image-counter");
  const thumbnails = document.getElementById("dialog-thumbnails");
  let activePhoto = 0;
  let galleryTrigger = null;

  function photoPath(index, large) {
    const number = String(index + 1).padStart(2, "0");
    return pathPrefix + "assets/images/foto-" + number + (large ? "-lg" : "") + ".webp";
  }

  function updateDialog(index) {
    activePhoto = (index + totalPhotos) % totalPhotos;
    dialogImage.src = photoPath(activePhoto, true);
    dialogImage.alt = currentLanguage === "en"
      ? "NARECAFÉ photograph " + (activePhoto + 1)
      : "Fotografía de NARECAFÉ " + (activePhoto + 1);
    dialogCounter.textContent = (currentLanguage === "en" ? "Image " : "Imagen ")
      + (activePhoto + 1) + (currentLanguage === "en" ? " of " : " de ") + totalPhotos;

    Array.from(thumbnails.children).forEach(function (thumbnail, thumbnailIndex) {
      thumbnail.setAttribute("aria-current", String(thumbnailIndex === activePhoto));
    });

    const activeThumbnail = thumbnails.children[activePhoto];
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    }
  }

  galleryButtons.forEach(function (button, index) {
    const thumbnail = document.createElement("button");
    thumbnail.type = "button";
    thumbnail.className = "thumbnail";
    thumbnail.setAttribute("aria-label", galleryLabels.open.replace("{number}", index + 1));

    const image = document.createElement("img");
    image.src = photoPath(index, false);
    image.alt = "";
    image.loading = "lazy";
    thumbnail.appendChild(image);
    thumbnail.addEventListener("click", function () {
      updateDialog(index);
    });
    thumbnails.appendChild(thumbnail);

    button.addEventListener("click", function () {
      galleryTrigger = button;
      updateDialog(index);
      dialog.showModal();
      document.body.classList.add("dialog-open");
    });
  });

  dialog.querySelector("[data-dialog-close]").addEventListener("click", function () {
    dialog.close();
  });

  dialog.querySelector("[data-previous]").addEventListener("click", function () {
    updateDialog(activePhoto - 1);
  });

  dialog.querySelector("[data-next]").addEventListener("click", function () {
    updateDialog(activePhoto + 1);
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateDialog(activePhoto - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      updateDialog(activePhoto + 1);
    }
  });

  dialog.addEventListener("close", function () {
    document.body.classList.remove("dialog-open");
    if (galleryTrigger) {
      galleryTrigger.focus();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
    }

    if (event.key === "Tab" && menuToggle.getAttribute("aria-expanded") === "true") {
      const focusable = Array.from(menu.querySelectorAll("a, button"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}());
