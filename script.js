const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes";

const apiKey = "TU_API_KEY_AQUI";

let imagenAbierta = null;

fetch(url, {
  method: "GET",
  headers: {
    "apikey": apiKey,
    "Authorization": "Bearer " + apiKey,
    "Content-Type": "application/json"
  }
})
  .then(res => res.json())
  .then(data => {

    data.forEach((item, index) => {

      const div = document.createElement("div");
      div.className = "mensaje";

      // TEXTO + LINK
      if (item.link && item.link !== "") {
        div.innerHTML = `
          ${item.texto}
          <a href="${item.link}" target="_blank">ver</a>
        `;
      } else {
        div.innerText = item.texto;
      }

      // IMAGEN
      let img;

      if (item.imagen && item.imagen !== "") {
        img = document.createElement("img");
        img.src = item.imagen;
        img.className = "mensaje-img";
        div.appendChild(img);

        div.addEventListener("click", () => {

          if (imagenAbierta && imagenAbierta !== img) {
            imagenAbierta.style.display = "none";
          }

          if (img.style.display === "block") {
            img.style.display = "none";
            imagenAbierta = null;
          } else {
            img.style.display = "block";
            imagenAbierta = img;
          }

        });
      }

      // POSICIÓN RANDOM
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;

      div.style.left = x + "px";
      div.style.top = y + "px";

      // JERARQUÍA
      if (index < 3) {
        div.style.fontSize = "38px";
        div.style.opacity = "1";
      } else {
        div.style.fontSize = (14 + Math.random() * 28) + "px";
        div.style.opacity = 0.4 + Math.random() * 0.6;
      }

      div.style.transform = `rotate(${Math.random() * 4 - 2}deg)`;

      document.body.appendChild(div);

      // ANIMACIÓN ENTRADA
      div.style.opacity = 0;

      setTimeout(() => {
        div.style.transition = "opacity 1s ease";
        div.style.opacity = (index < 3) ? 1 : (0.4 + Math.random() * 0.6);
      }, Math.random() * 2000);

      // MOVIMIENTO SUAVE
      let angle = Math.random() * Math.PI * 2;

      function mover() {
        angle += 0.01;

        x += Math.sin(angle) * 0.3;
        y += Math.cos(angle) * 0.3;

        div.style.left = x + "px";
        div.style.top = y + "px";

        requestAnimationFrame(mover);
      }

      mover();

    });

  })
  .catch(err => {
    console.error("Error:", err);
  });