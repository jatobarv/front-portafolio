import { apiRequest } from "../module.js";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idURL = urlParams.get("id");
const token = localStorage.getItem("Token");
const d = document;
const okBtn = d.getElementById("ok");

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
    $formGroup.className = "form-check mb-2";
    $label.className = "form-check-label";
    $nombreIndic.innerText = indicacion.indicaciones;
    $terminada.type = "checkbox";
    $terminada.className = "form-check-input";
    $terminada.value = indicacion.id;
    $label.innerHTML = "Terminar";
    $nombreUsuario.value = indicacion.nombre_usuario;
    $nombreTarea.value = indicacion.nombre_tarea;
    indicacion.terminada
      ? (($terminada.checked = true), ($terminada.disabled = true))
      : false;
    $formGroup.appendChild($nombreIndic);
    $formGroup.appendChild($terminada);
    $formGroup.appendChild($label);
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
    $('#myModal').modal('show');
    $('#myModal').on('hidden.bs.modal', function () {
      location.replace(`./realizarTareas.html?id=${idURL}`);
  });
  } else {
    alert("Datos incorrectos");
  }
}

d.addEventListener("submit", (event) => {
  event.preventDefault();
  const target = event.target;
  var checkedValue = null;
  let inputElements = document.getElementsByClassName("form-check-input");

  if (target.id === "indicaciones-form") {
    for (let j = 0; j < inputElements.length; j++) {
      checkedValue = inputElements[j].checked;
      if (checkedValue) {
        indicacion_tarea(inputElements[j].value, checkedValue);
      }
    }
  }
});
