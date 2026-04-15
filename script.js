const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes";
const apiKey = "TU_API_KEY_AQUI";

const margenTop = 150;
const margenBottom = 100;
const margenLateral = 50;

function obtenerPosicionAleatoria() {
  let x = Math.random() * (window.innerWidth - margenLateral * 2) + margenLateral;
  let y = Math.random() * (window.innerHeight - margenTop - margenBottom) + margenTop;

  return { x, y };
}

// 1. TRAER DATOS DE SUPABASE
fetch(url, {
  headers: {
    "apikey": apiKey,
    "Authorization": "Bearer " + apiKey
  }
})
.then(res => res.json())
.then(data => {
  let popupActual = null;

  data.forEach((item) => {
    const punto = document.createElement("div");
    punto.className = "punto ocupado";
    punto.style.background = item.color || "#000";

    const { x, y } = obtenerPosicionAleatoria();
    punto.style.left = x + "px";
    punto.style.top = y + "px";

    // CLICK → mostrar info
    punto.addEventListener("click", () => {
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

      popup.style.left = punto.style.left;
      popup.style.top = punto.style.top;

      document.body.appendChild(popup);
      popupActual = popup;
    });

    document.body.appendChild(punto);
  });
});
