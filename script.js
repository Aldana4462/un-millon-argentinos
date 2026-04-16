const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes?select=id,nombre,texto,link,color,created_at&order=id.asc";
const apiKey = "TU_API_KEY_AQUI";

const TOTAL_PUNTOS = 400;
let margenTop = 140;
const margenBottom = 20;
const margenLateral = 50;
const VELOCIDAD_MAX = 0.08;
const REFRESH_MS = 5000;
const ROTACION_MS = 9000;
const PROFUNDIDAD_MIN = 0.8;
const PROFUNDIDAD_MAX = 1.2;

const puntos = [];
let mensajes = [];
let offsetLote = 0;
let popupActual = null;
let puntoActivo = null;

function actualizarMargenTop() {
  const header = document.querySelector(".header");
  const altoHeader = header ? header.offsetHeight : 120;
  margenTop = altoHeader + 20;
}

function obtenerPosicionAleatoria() {
  const anchoUtil = Math.max(window.innerWidth - margenLateral * 2, 1);
  const altoUtil = Math.max(window.innerHeight - margenTop - margenBottom, 1);

  return {
    x: Math.random() * anchoUtil + margenLateral,
    y: Math.random() * altoUtil + margenTop
  };
}

function resetPuntoAnimacion(punto, desdeBorde = false) {
  const ancho = window.innerWidth;
  const alto = window.innerHeight;

  if (desdeBorde) {
    if (Math.random() > 0.5) {
      punto.x = Math.random() > 0.5 ? -20 : ancho + 20;
      punto.y = Math.random() * (alto - margenTop - margenBottom) + margenTop;
    } else {
      punto.x = Math.random() * (ancho - margenLateral * 2) + margenLateral;
      punto.y = Math.random() > 0.5 ? margenTop - 20 : alto + 20;
    }
  } else {
    const pos = obtenerPosicionAleatoria();
    punto.x = pos.x;
    punto.y = pos.y;
  }

  punto.z = 0;
  punto.scale = 1;
  punto.opacity = 1;
  punto.entrada = 0;
  punto.saliendoAtras = false;
}

function crearPuntosVacios() {
  for (let i = 0; i < TOTAL_PUNTOS; i++) {
    const punto = document.createElement("div");
    punto.className = "punto vacio";

    document.body.appendChild(punto);

    const { x, y } = obtenerPosicionAleatoria();

    const puntoAnimado = {
      el: punto,
      x,
      y,
      vx: (Math.random() * 2 - 1) * VELOCIDAD_MAX,
      vy: (Math.random() * 2 - 1) * VELOCIDAD_MAX,
      pausado: false,
      profundidad: Math.random() * (PROFUNDIDAD_MAX - PROFUNDIDAD_MIN) + PROFUNDIDAD_MIN,
      z: 0,
      scale: 1,
      opacity: 1,
      entrada: 0,
      saliendoAtras: false
    };

    resetPuntoAnimacion(puntoAnimado, false);

    punto.addEventListener("mouseenter", () => {
      if (!punto.classList.contains("ocupado")) return;
      puntoAnimado.pausado = true;
    });

    punto.addEventListener("mouseleave", () => {
      puntoAnimado.pausado = false;
    });

    puntos.push(puntoAnimado);
  }
}

function animarPuntos() {
  const ahora = performance.now();
  if (!animarPuntos.ultimo) animarPuntos.ultimo = ahora;
  const delta = Math.min((ahora - animarPuntos.ultimo) / 1000, 0.05);
  animarPuntos.ultimo = ahora;

  const minX = -28;
  const maxX = window.innerWidth + 28;
  const minY = margenTop - 28;
  const maxY = window.innerHeight + 28;

  puntos.forEach((punto) => {
    if (!punto.pausado) {
      if (punto.saliendoAtras) {
        punto.z += delta * 0.45;
        punto.scale = 1 - punto.z * 0.7;
        punto.opacity = 1 - punto.z;

        if (punto.opacity <= 0.05) {
          resetPuntoAnimacion(punto);
        }
      } else {
        punto.x += punto.vx * delta * 60 * punto.profundidad;
        punto.y += punto.vy * delta * 60 * punto.profundidad;

        if (Math.random() < 0.0007) {
          punto.saliendoAtras = true;
          punto.z = 0;
        }

        if (punto.x < minX || punto.x > maxX || punto.y < minY || punto.y > maxY) {
          resetPuntoAnimacion(punto, true);
        }
      }

      punto.entrada = Math.min(1, punto.entrada + delta * 2);
    }

    const easing = 1 - Math.pow(1 - punto.entrada, 2);
    const scale = punto.scale * (0.6 + easing * 0.4);
    const opacity = punto.opacity * easing;

    punto.el.style.transform = `translate(${punto.x}px, ${punto.y}px) scale(${scale})`;
    punto.el.style.opacity = opacity;
  });

  requestAnimationFrame(animarPuntos);
}

function mostrarPopup(punto, item) {
  if (popupActual) popupActual.remove();

  const popup = document.createElement("div");
  popup.className = "popup";

  popup.innerHTML = `
    <strong>${item.nombre || ""}</strong><br>
    ${item.texto || ""}<br>
    ${item.link ? `<a href="${item.link}" target="_blank">ver link</a>` : ""}
  `;

  popup.style.left = punto.x + 10 + "px";
  popup.style.top = punto.y + 10 + "px";

  document.body.appendChild(popup);
  popupActual = popup;
}

function normalizarColor(color) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color) ? color : "#000";
}

function aplicarItemAPunto(punto, item) {
  if (!item) return;

  punto.el.classList.remove("vacio");
  punto.el.classList.add("ocupado");

  punto.el.style.background = normalizarColor(item.color);
  punto.el.textContent = `#${item.id}`;

  punto.el.onclick = () => mostrarPopup(punto, item);
}

function obtenerLoteActual() {
  return mensajes.slice(offsetLote, offsetLote + TOTAL_PUNTOS);
}

function sincronizarPuntos(data) {
  puntos.forEach((punto, i) => {
    aplicarItemAPunto(punto, data[i]);
  });
}

function rotarLote() {
  if (mensajes.length <= TOTAL_PUNTOS) return;

  offsetLote = (offsetLote + TOTAL_PUNTOS) % mensajes.length;
  sincronizarPuntos(obtenerLoteActual());
}

function cargarMensajes() {
  fetch(url, {
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`
    }
  })
  .catch(error => {
    console.error("Error cargando mensajes:", error.message);
    mensajes = [];
    offsetLote = 0;
    sincronizarPuntos([]);
  });
}

actualizarMargenTop();
crearPuntosVacios();
animarPuntos();
cargarMensajes();
setInterval(cargarMensajes, REFRESH_MS);
setInterval(rotarLote, ROTACION_MS);

window.addEventListener("resize", actualizarMargenTop);

document.addEventListener("click", () => {
  if (popupActual) popupActual.remove();
});