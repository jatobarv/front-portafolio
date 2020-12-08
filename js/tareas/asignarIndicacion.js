import { apiRequest } from "../module.js";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idURL = urlParams.get("id");
const tareaURL = urlParams.get("tarea");
const token = localStorage.getItem("Token");
const d = document;
const user_id = localStorage.getItem("user_id");
const ico = d.getElementById("add-ico");
const cln = d.getElementById("form");
d.getElementById("id-tarea").value = idURL;
d.getElementById("tarea").value = tareaURL;

ico.onclick = function () {
  ico.style = "margin: 12px 0; cursor: pointer"
  const form = d.createElement("input");
  form.setAttribute("placeholder", "Agregar indicación");
  form.setAttribute("name", "indicaciones[]");
  form.setAttribute("type", "text");
  form.className = "form-control indi";
  form.style = "margin: 12px 0"
  form.setAttribute("id", "newId");
  cln.appendChild(form);
};

async function addIndicacion(id_tarea, tarea, usuario, indicaciones) {
  const response = await apiRequest({
    url: "http://127.0.0.1:8000/indicacion_tarea/",
    method: "POST",
    token: token,
    body: {
      id_tarea,
      tarea,
      usuario,
      indicaciones,
    },
    action: "post indicacion",
  });
  localStorage.setItem("Token", token);

  if (response) {
    $("#myModal").modal("show");
    $("#myModal").on("hidden.bs.modal", function () {
      location.replace("../flujos/flujos.html");
    });
  } else {
    alert("Datos incorrectos");
  }
}

d.addEventListener("submit", (event) => {
  event.preventDefault();
  const target = event.target;

  if (target.id === "agregar-indicacion") {
    var inputs = document.getElementsByClassName("indi"),
      indicaciones = [].map.call(inputs, function (input) {
        return input.value;
      });
    for (let i = 0; i < indicaciones.length; i++) {
      const indicacion = indicaciones[i];
      addIndicacion(idURL, tareaURL, user_id, indicacion);
    }
  }
});
