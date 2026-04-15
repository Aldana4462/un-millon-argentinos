const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes";
const apiKey = "TU_API_KEY_AQUI";

// 👉 cantidad de puntos vacíos
const TOTAL_PUNTOS = 400;
const margenTop = 150;
const margenBottom = 100;
const margenLateral = 50;

let puntosLibres = [];

// 1. CREAR PUNTOS VACÍOS
for (let i = 0; i < TOTAL_PUNTOS; i++) {

  const punto = document.createElement("div");
  punto.className = "punto vacio";

  let x = Math.random() * (window.innerWidth - margenLateral * 2) + margenLateral;
  let y = Math.random() * (window.innerHeight - margenTop - margenBottom) + margenTop;

  punto.style.left = x + "px";
  punto.style.top = y + "px";

  document.body.appendChild(punto);

  puntosLibres.push(punto);
}

// 2. TRAER DATOS DE SUPABASE
fetch(url, {
  headers: {
    "apikey": apiKey,
    "Authorization": "Bearer " + apiKey
  }
})
.then(res => res.json())
.then(data => {

  let popupActual = null;

  data.forEach((item, index) => {

    setTimeout(() => {

      // agarrar un punto libre
      const punto = puntosLibres[index];
      if (!punto) return;

      // convertirlo en ocupado
      punto.classList.remove("vacio");
      punto.classList.add("ocupado");

      punto.style.background = item.color || "#000";

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

    }, index * 50); // aparición progresiva

  });

});
