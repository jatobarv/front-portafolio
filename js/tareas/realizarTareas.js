import { apiRequest } from "../module.js";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idURL = urlParams.get("id");
const token = localStorage.getItem("Token");
const d = document;

function getIndicaciones() {
  const promise = axios.get(
    `http://127.0.0.1:8000/indicacion_tarea/?id_tarea=${idURL}`,
    {
      headers: {
        Authorization: "Token " + token,
        "Content-Type": "application/json",
      },
    }
  );

  const dataPromise = promise.then((response) => response.data);

  return dataPromise;
}


getIndicaciones().then((indicaciones) => {
  for (const indicacion of indicaciones.results) {
    console.log(indicacion);
    const $indicacion = d.getElementById("indicaciones");
    const $formGroup = d.createElement("div");
    const $label = d.createElement("label");
    const $nombreIndic = d.createElement("h5");
    const $terminada = d.createElement("input");
    const $nombreUsuario = d.getElementById("nombreUsuario");
    const $nombreTarea = d.getElementById("nombreTarea");
    const $idIndicacion = d.createElement("input");
    $formGroup.className = "form-check mb-2";
    $label.className = "form-check-label";
    $nombreIndic.innerText = indicacion.indicaciones;
    $terminada.type = "checkbox";
    $terminada.className = "form-check-input";
    $terminada.id = 'terminada'
    $label.innerHTML = "Terminada";
    $nombreUsuario.value = indicacion.nombre_usuario;
    $nombreTarea.value = indicacion.nombre_tarea;
    $idIndicacion.hidden = true;
    $idIndicacion.className = 'idIndicaciones';
    $idIndicacion.value = indicacion.id;
    indicacion.terminada
      ? (($terminada.checked = true), ($terminada.disabled = true))
      : false;
    $formGroup.appendChild($nombreIndic);
    $formGroup.appendChild($terminada);
    $formGroup.appendChild($label);
    $formGroup.appendChild($idIndicacion);
    $indicacion.appendChild($formGroup);
  }
});

async function indicacion_tarea(id, terminada) {
  const response = await apiRequest({
      url: `http://127.0.0.1:8000/indicacion_tarea/${id}/`,
      method: "PUT",
      token: token,
      body: {
          id,
          terminada,
      },
      action: "put indicacion",
  });
  localStorage.setItem("Token", token);

  if (response) {
    location.replace(`./realizarTareas.html?id=${idURL}`);
  } else {
      alert("Datos incorrectos");
  }
}

d.addEventListener("submit", (event) => {
  event.preventDefault();
  const target = event.target;
  var checkedValue = null;
  var idIndicacion = null;
  var inputElements = document.getElementsByClassName("form-check-input");
  var inputId = d.getElementsByClassName("idIndicaciones");

  for (let i = 0; i < inputId.length; ++i) {
    for (var j = 0; inputElements[j]; ++j) {
      if (inputElements[j].checked) {
        checkedValue = inputElements[j].checked;
        idIndicacion = inputId[i];
      }
    }
    if (target.id === "indicaciones-form") {
      indicacion_tarea(idIndicacion.value, checkedValue);
    }
  }
});
