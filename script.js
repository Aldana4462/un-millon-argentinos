const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes";

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybXpwZGJzenJvaXVoeWljbndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTc4OTUsImV4cCI6MjA5MTc5Mzg5NX0.XC4iOw3VhVHYiUtLEXGYVbKBtWzslfHSZaaaCvB3D88";

console.log("Conectando a Supabase...");

fetch(url, {
  method: "GET",
  headers: {
    "apikey": apiKey,
    "Authorization": "Bearer " + apiKey,
    "Content-Type": "application/json"
  }
})
  .then(res => {
    if (!res.ok) {
      console.error("Error en la respuesta:", res.status);
      throw new Error("Error en fetch");
    }
    return res.json();
  })
  .then(data => {
    console.log("Datos recibidos:", data);

    if (!data || data.length === 0) {
      console.warn("No hay mensajes en la base");
      return;
    }

    data.forEach((item, index) => {

      const div = document.createElement("div");
      div.className = "mensaje";

      // contenido
      if (item.link && item.link !== "") {
        div.innerHTML = `
          ${item.texto}
          <a href="${item.link}" target="_blank">ver</a>
        `;
      } else {
        div.innerText = item.texto;
      }

      // posición random
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

      // animación de entrada
      div.style.opacity = 0;

      setTimeout(() => {
        div.style.transition = "opacity 1s ease";
        div.style.opacity = (index < 3) ? 1 : (0.4 + Math.random() * 0.6);
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

  })
  .catch(err => {
    console.error("ERROR GENERAL:", err);
  });