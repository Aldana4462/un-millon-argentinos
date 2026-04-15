const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes";
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybXpwZGJzenJvaXVoeWljbndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTc4OTUsImV4cCI6MjA5MTc5Mzg5NX0.XC4iOw3VhVHYiUtLEXGYVbKBtWzslfHSZaaaCvB3D88";

const TOTAL_PUNTOS = 400;
const margenTop = 150;
const margenBottom = 100;
const margenLateral = 50;
const VELOCIDAD_MAX = 0.35;
const REFRESH_MS = 5000;

const puntos = [];
let popupActual = null;

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

    puntos.push({
      el: punto,
      x,
      y,
      vx: (Math.random() * 2 - 1) * VELOCIDAD_MAX,
      vy: (Math.random() * 2 - 1) * VELOCIDAD_MAX
    });
  }
}

function animarPuntos() {
  const minX = margenLateral;
  const maxX = window.innerWidth - margenLateral;
  const minY = margenTop;
  const maxY = window.innerHeight - margenBottom;

  puntos.forEach((punto) => {
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

  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    ${item.nombre || ""}
    <br>
    ${item.texto || ""}
    <br>
    ${item.link ? `<a href="${item.link}" target="_blank" style="color:white;">→</a>` : ""}
  `;

  popup.style.left = punto.el.style.left;
  popup.style.top = punto.el.style.top;
  document.body.appendChild(popup);
  popupActual = popup;
}

function sincronizarPuntos(data) {
  puntos.forEach((punto, index) => {
    const item = data[index];

    if (!item) {
      punto.el.classList.remove("ocupado");
      punto.el.classList.add("vacio");
      punto.el.style.background = "";
      punto.el.onclick = null;
      return;
    }

    punto.el.classList.remove("vacio");
    punto.el.classList.add("ocupado");
    punto.el.style.background = item.color || "#000";
    punto.el.onclick = () => mostrarPopup(punto, item);
  });
}

function cargarMensajes() {
  fetch(url, {
    headers: {
      "apikey": apiKey,
      "Authorization": "Bearer " + apiKey
    }
  })
  .then(res => res.json())
  .then(data => sincronizarPuntos(data));
}

crearPuntosVacios();
animarPuntos();
cargarMensajes();
setInterval(cargarMensajes, REFRESH_MS);
