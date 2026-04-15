const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes";

const apiKey = "TU_API_KEY_AQUI";

const url = "https://yrmzpdbszroiuhyicnwo.supabase.co/rest/v1/mensajes";

const apiKey = "TU_API_KEY_AQUI";

fetch(url, {
  method: "GET",
  headers: {
    "apikey": apiKey,
    "Authorization": "Bearer " + apiKey
  }
})
  .then(res => res.json())
  .then(data => {

    data.forEach((item, index) => {

      const div = document.createElement("div");
      div.className = "mensaje";

      if (item.link && item.link !== "") {
        div.innerHTML = `
          ${item.texto}
          <br>
          <a href="${item.link}" target="_blank" class="link-btn">→</a>
        `;
      } else {
        div.innerText = item.texto;
      }

      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;

      div.style.left = x + "px";
      div.style.top = y + "px";

      if (index < 3) {
        div.style.fontSize = "38px";
      } else {
        div.style.fontSize = (14 + Math.random() * 28) + "px";
      }

      document.body.appendChild(div);

    });

  })
  .catch(err => {
    console.error("Error:", err);
  });