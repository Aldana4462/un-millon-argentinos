const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes?select=id,nombre,texto,link,color,created_at&order=id.asc";
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybXpwZGJzenJvaXVoeWljbndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTc4OTUsImV4cCI6MjA5MTc5Mzg5NX0.XC4iOw3VhVHYiUtLEXGYVbKBtWzslfHSZaaaCvB3D88";

const TOTAL_PUNTOS = 400;
const margenTop = 150;
const margenBottom = 100;
const margenLateral = 50;
const VELOCIDAD_MAX = 0.35;
const REFRESH_MS = 5000;

const puntos = [];
let popupActual = null;
let puntoActivo = null;

function obtenerPosicionAleatoria() {
  const anchoUtil = Math.max(window.innerWidth - margenLateral * 2, 1);
  const altoUtil = Math.max(window.innerHeight - margenTop - margenBottom, 1);

  let x = Math.random() * anchoUtil + margenLateral;
  let y = Math.random() * altoUtil + margenTop;

  return { x, y };
}

function crearPuntosVacios() {
  for (let i = 0; i < TOTAL_PUNTOS; i++) {
    const punto = document.createElement("div");
    punto.className = "punto vacio";

    const { x, y } = obtenerPosicionAleatoria();
    punto.style.left = x + "px";
    punto.style.top = y + "px";

    document.body.appendChild(punto);

    const puntoAnimado = {
      el: punto,
      x,
      y,
      vx: (Math.random() * 2 - 1) * VELOCIDAD_MAX,
      vy: (Math.random() * 2 - 1) * VELOCIDAD_MAX,
      pausado: false
    };

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
  const minX = margenLateral;
  const maxX = window.innerWidth - margenLateral;
  const minY = margenTop;
  const maxY = window.innerHeight - margenBottom;

  puntos.forEach((punto) => {
    if (punto.pausado) return;

    punto.x += punto.vx;
    punto.y += punto.vy;

    if (punto.x <= minX || punto.x >= maxX) punto.vx *= -1;
    if (punto.y <= minY || punto.y >= maxY) punto.vy *= -1;

    punto.x = Math.min(Math.max(punto.x, minX), maxX);
    punto.y = Math.min(Math.max(punto.y, minY), maxY);

    punto.el.style.left = punto.x + "px";
    punto.el.style.top = punto.y + "px";
  });

  requestAnimationFrame(animarPuntos);
}

function mostrarPopup(punto, item) {
  if (popupActual) popupActual.remove();
  if (puntoActivo) puntoActivo.pausado = false;

  const popup = document.createElement("div");
  popup.className = "popup";
  const bloques = [];

  if (item.nombre) bloques.push(`<strong>${item.nombre}</strong>`);
  if (item.texto) bloques.push(`<span>${item.texto}</span>`);
  if (item.link) bloques.push(`<a href="${item.link}" target="_blank" style="color:white;">ver link</a>`);
  if (bloques.length === 0) {
    return;
  }

  popup.innerHTML = bloques.join("<br>");
  popup.addEventListener("click", (event) => event.stopPropagation());

  popup.style.left = (punto.x + 10) + "px";
  popup.style.top = (punto.y + 10) + "px";
  document.body.appendChild(popup);
  popupActual = popup;
  puntoActivo = punto;
  puntoActivo.pausado = true;
}

function normalizarColor(color) {
  if (typeof color !== "string") return "#000000";

  const valor = color.trim();
  const esHexValido = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(valor);

  return esHexValido ? valor : "#000000";
}

function sincronizarPuntos(data) {
  puntos.forEach((punto, index) => {
    const item = data[index];

    if (!item) {
      punto.el.classList.remove("ocupado");
      punto.el.classList.add("vacio");
      punto.el.style.background = "";
      punto.el.textContent = "";
      punto.el.onclick = null;
      return;
    }

    punto.el.classList.remove("vacio");
    punto.el.classList.add("ocupado");
    punto.el.style.background = normalizarColor(item.color);
    punto.el.textContent = item.id ? String(item.id) : "";
    punto.el.onclick = (event) => {
      event.stopPropagation();
      mostrarPopup(punto, item);
    };
  });
}

function cargarMensajes() {
  fetch(url, {
    headers: {
      "apikey": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + apiKey
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Supabase respondió " + res.status + " " + res.statusText);
    }

    return res.json();
  })
  .then(data => sincronizarPuntos(Array.isArray(data) ? data : []))
  .catch(error => {
    console.error("Error cargando mensajes:", error.message);
    sincronizarPuntos([]);
  });
}

crearPuntosVacios();
animarPuntos();
cargarMensajes();
setInterval(cargarMensajes, REFRESH_MS);

document.addEventListener("click", () => {
  if (popupActual) popupActual.remove();
  popupActual = null;

  if (puntoActivo) {
    puntoActivo.pausado = false;
    puntoActivo = null;
  }
});
