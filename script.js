const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes";

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybXpwZGJzenJvaXVoeWljbndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTc4OTUsImV4cCI6MjA5MTc5Mzg5NX0.XC4iOw3VhVHYiUtLEXGYVbKBtWzslfHSZaaaCvB3D88";

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

      // texto + link opcional
      if (item.link) {
        div.innerHTML = `
          ${item.texto}
          <br>
          <a href="${item.link}" target="_blank">ver</a>
        `;
      } else {
        div.innerText = item.texto;
      }

      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;

      div.style.left = x + "px";
      div.style.top = y + "px";

      div.style.fontSize = (12 + Math.random() * 12) + "px";
      div.style.opacity = 0.4 + Math.random() * 0.6;
      div.style.transform = `rotate(${Math.random() * 4 - 2}deg)`;

      document.body.appendChild(div);

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