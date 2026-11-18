(function () {
  "use strict";

  const storageKey = "narecafe-motif-editor-v1";
  const selectors = [
    ".hero-motif-left",
    ".story-motif-hummingbird",
    ".story-motif-ramita",
    ".service-motif",
    ".gallery-motif",
    ".contact-motif",
    ".motif-custom"
  ];

  let activeElement = null;
  let dragOffset = { x: 0, y: 0 };
  let states = loadStates();

  function loadStates() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (error) {
      return {};
    }
  }

  function saveStates() {
    localStorage.setItem(storageKey, JSON.stringify(states));
  }

  function elementKey(element) {
    if (element.dataset.motifId) return element.dataset.motifId;
    for (const selector of selectors) {
      if (element.matches(selector)) return selector.replace(".", "");
    }
    return null;
  }

  function ensureOriginalSrc(element) {
    if (!element.dataset.originalSrc) {
      element.dataset.originalSrc = element.src;
    }
  }

  function recolorImage(element, color) {
    ensureOriginalSrc(element);
    if (!color) {
      element.src = element.dataset.originalSrc;
      return;
    }

    const original = new Image();
    original.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = original.naturalWidth;
      canvas.height = original.naturalHeight;
      const context = canvas.getContext("2d");
      context.drawImage(original, 0, 0);
      context.globalCompositeOperation = "source-in";
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      element.src = canvas.toDataURL("image/png");
    };
    original.src = element.dataset.originalSrc;
  }

  function applyState(element) {
    const key = elementKey(element);
    if (!key) return;
    const state = states[key];
    if (!state) return;

    if (state.hidden) {
      element.style.display = "none";
      return;
    }

    element.style.display = "";
    if (state.left !== undefined) {
      element.style.position = "absolute";
      element.style.left = state.left + "px";
      element.style.top = state.top + "px";
      element.style.right = "auto";
      element.style.bottom = "auto";
    }
    if (state.width) element.style.width = state.width + "px";
    if (state.rotation !== undefined) {
      element.style.transform = "rotate(" + state.rotation + "deg)";
    }
    if (state.color) recolorImage(element, state.color);
  }

  function collectEditableElements() {
    const elements = [];
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        elements.push(element);
      });
    });
    return elements;
  }

  function openEditor() {
    document.body.classList.add("motif-editor-active");
    panel.classList.add("open");
  }

  function closeEditor() {
    document.body.classList.remove("motif-editor-active");
    panel.classList.remove("open");
  }

  function selectElement(element) {
    if (activeElement) activeElement.classList.remove("motif-editor-selected");
    activeElement = element;
    activeElement.classList.add("motif-editor-selected");

    const key = elementKey(element);
    const state = states[key] || {};
    const rect = element.getBoundingClientRect();
    rotation.value = state.rotation !== undefined ? state.rotation : 0;
    size.value = state.width !== undefined ? state.width : Math.round(rect.width);
    color.value = state.color || "#1281aa";
    status.textContent = "Seleccionado: " + (key || "motivo");
  }

  function setElementPosition(element, left, top) {
    const offsetParent = element.offsetParent || document.body;
    const parentRect = offsetParent.getBoundingClientRect();
    const localLeft = left - parentRect.left + (offsetParent === document.body ? window.scrollX : 0);
    const localTop = top - parentRect.top + (offsetParent === document.body ? window.scrollY : 0);

    element.style.position = "absolute";
    element.style.left = localLeft + "px";
    element.style.top = localTop + "px";
    element.style.right = "auto";
    element.style.bottom = "auto";

    const key = elementKey(element);
    states[key] = states[key] || {};
    states[key].left = Math.round(localLeft);
    states[key].top = Math.round(localTop);
  }

  const launch = document.createElement("button");
  launch.type = "button";
  launch.className = "motif-editor-launch";
  launch.textContent = "Editar motivos";

  const panel = document.createElement("div");
  panel.className = "motif-editor-panel";
  panel.innerHTML =
    '<div class="motif-editor-head"><strong>Editor de motivos</strong>' +
    '<button type="button" class="motif-editor-close" aria-label="Cerrar editor">×</button></div>' +
    '<div class="motif-editor-field"><label for="motif-size">Tamaño</label><input id="motif-size" type="range" min="24" max="260" value="100"></div>' +
    '<div class="motif-editor-field"><label for="motif-rotation">Rotación</label><input id="motif-rotation" type="range" min="-180" max="180" value="0"></div>' +
    '<div class="motif-editor-field"><label for="motif-color">Color</label><input id="motif-color" type="color" value="#1281aa"></div>' +
    '<button type="button" class="motif-editor-add" data-add="1">Añadir motivo azul</button>' +
    '<div class="motif-editor-actions">' +
    '<button type="button" data-action="save">Guardar</button>' +
    '<button type="button" data-action="export">Exportar CSS</button>' +
    '<button type="button" data-action="delete">Eliminar</button>' +
    '<button type="button" data-action="reset">Restaurar todo</button>' +
    '</div><p class="motif-editor-status">Seleccione un motivo.</p>';

  document.body.appendChild(launch);
  document.body.appendChild(panel);

  const size = panel.querySelector("#motif-size");
  const rotation = panel.querySelector("#motif-rotation");
  const color = panel.querySelector("#motif-color");
  const status = panel.querySelector(".motif-editor-status");

  launch.addEventListener("click", openEditor);
  panel.querySelector(".motif-editor-close").addEventListener("click", closeEditor);

  collectEditableElements().forEach(function (element) {
    element.classList.add("motif-editable");
    element.dataset.originalSrc = element.src;
    applyState(element);
  });

  collectEditableElements().forEach(function (element) {
    element.addEventListener("click", function () {
      if (document.body.classList.contains("motif-editor-active")) {
        selectElement(element);
      }
    });
    element.addEventListener("pointerdown", function (event) {
      if (!document.body.classList.contains("motif-editor-active")) return;
      event.preventDefault();
      selectElement(element);
      const rect = element.getBoundingClientRect();
      dragOffset.x = event.clientX - rect.left;
      dragOffset.y = event.clientY - rect.top;
      try {
        element.setPointerCapture(event.pointerId);
      } catch (error) {
        // Synthetic pointer events cannot establish pointer capture.
      }
    });

    element.addEventListener("pointermove", function (event) {
      if (!element.hasPointerCapture(event.pointerId)) return;
      setElementPosition(element, event.clientX - dragOffset.x, event.clientY - dragOffset.y);
    });

    element.addEventListener("pointerup", function (event) {
      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }
    });
  });

  size.addEventListener("input", function () {
    if (!activeElement) return;
    activeElement.style.width = size.value + "px";
    const key = elementKey(activeElement);
    states[key] = states[key] || {};
    states[key].width = Number(size.value);
  });

  rotation.addEventListener("input", function () {
    if (!activeElement) return;
    activeElement.style.transform = "rotate(" + rotation.value + "deg)";
    const key = elementKey(activeElement);
    states[key] = states[key] || {};
    states[key].rotation = Number(rotation.value);
  });

  color.addEventListener("input", function () {
    if (!activeElement) return;
    recolorImage(activeElement, color.value);
    const key = elementKey(activeElement);
    states[key] = states[key] || {};
    states[key].color = color.value;
  });

  panel.querySelector('[data-action="save"]').addEventListener("click", function () {
    saveStates();
    status.textContent = "Posiciones guardadas.";
  });

  panel.querySelector('[data-action="delete"]').addEventListener("click", function () {
    if (!activeElement) return;
    const key = elementKey(activeElement);
    activeElement.style.display = "none";
    states[key] = states[key] || {};
    states[key].hidden = true;
    status.textContent = "Motivo eliminado.";
  });

  panel.querySelector('[data-action="export"]').addEventListener("click", function () {
    saveStates();
    let css = "/* Posiciones exportadas del editor NARECAFÉ */\n";
    Object.keys(states).forEach(function (key) {
      const state = states[key];
      css += "." + key + " {\n";
      if (state.hidden) css += "  display: none;\n";
      if (state.left !== undefined) {
        css += "  position: absolute;\n";
        css += "  left: " + state.left + "px;\n";
        css += "  top: " + state.top + "px;\n";
        css += "  right: auto;\n";
        css += "  bottom: auto;\n";
      }
      if (state.width) css += "  width: " + state.width + "px;\n";
      if (state.rotation !== undefined) css += "  transform: rotate(" + state.rotation + "deg);\n";
      css += "}\n";
    });
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "motivos-narecafe.css";
    link.click();
    URL.revokeObjectURL(url);
  });

  panel.querySelector('[data-action="reset"]').addEventListener("click", function () {
    localStorage.removeItem(storageKey);
    window.location.reload();
  });

  panel.querySelector('[data-add="1"]').addEventListener("click", function () {
    const image = document.createElement("img");
    image.className = "motif-editable motif-custom";
    image.dataset.motifId = "motivo-" + Date.now();
    image.src = (document.documentElement.lang === "en" ? "../" : "") + "assets/graphics/grano_cafe.webp";
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.style.position = "absolute";
    image.style.left = (window.scrollX + window.innerWidth / 2 - 40) + "px";
    image.style.top = (window.scrollY + window.innerHeight / 2 - 40) + "px";
    image.style.width = "80px";
    image.style.pointerEvents = "auto";
    document.body.appendChild(image);
    ensureOriginalSrc(image);
    image.addEventListener("pointerdown", function (event) {
      if (!document.body.classList.contains("motif-editor-active")) return;
      event.preventDefault();
      selectElement(image);
      const rect = image.getBoundingClientRect();
      dragOffset.x = event.clientX - rect.left;
      dragOffset.y = event.clientY - rect.top;
      image.setPointerCapture(event.pointerId);
    });
    image.addEventListener("pointermove", function (event) {
      if (!image.hasPointerCapture(event.pointerId)) return;
      setElementPosition(image, event.clientX - dragOffset.x, event.clientY - dragOffset.y);
    });
    image.addEventListener("pointerup", function (event) {
      if (image.hasPointerCapture(event.pointerId)) image.releasePointerCapture(event.pointerId);
    });
    selectElement(image);
  });

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "m") {
      document.body.classList.contains("motif-editor-active") ? closeEditor() : openEditor();
    }
  });
}());
