const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes";

const apiKey = "TU_API_KEY_AQUI";

fetch(url, {
  headers: {
    "apikey": apiKey,
    "Authorization": "Bearer " + apiKey
  }
})
  .then(res => res.json())
  .then(mensajes => {

    mensajes.forEach((item, index) => {

      const div = document.createElement("div");
      div.className = "mensaje";

      if (item.link) {
        div.innerHTML = `
          ${item.texto}
          <a href="${item.link}" target="_blank">ver</a>
        `;
      } else {
        div.innerText = item.texto;
      }

      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;

      div.style.left = x + "px";
      div.style.top = y + "px";

      // jerarquía visual
      if (index < 3) {
        div.style.fontSize = "38px";
        div.style.opacity = "1";
      } else {
        div.style.fontSize = (14 + Math.random() * 28) + "px";
        div.style.opacity = 0.4 + Math.random() * 0.6;
      }

      div.style.transform = `rotate(${Math.random() * 4 - 2}deg)`;

      document.body.appendChild(div);

      // animación entrada
      div.style.opacity = 0;

      setTimeout(() => {
        div.style.transition = "opacity 1s ease";
        div.style.opacity = 1;
      }, Math.random() * 2000);

      // movimiento suave
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

  });