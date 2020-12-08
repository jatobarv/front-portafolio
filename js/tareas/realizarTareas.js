import { apiRequest } from "../module.js";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idURL = urlParams.get("id");
const token = localStorage.getItem("Token");
let id_tarea;
const d = document;
const okBtn = d.getElementById("ok");
let condIndicacion = [];
function checkIndicacion(indicacion) {
  return indicacion === true;
}

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

getIndicaciones()
  .then((indicaciones) => {
    for (const indicacion of indicaciones.results) {
      id_tarea = indicacion.tarea;
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
      condIndicacion.push(indicacion.terminada);
      if (indicacion.terminada) {
        $terminada.checked = true;
        $terminada.disabled = true;
      } else {
        false;
      }
      $formGroup.appendChild($nombreIndic);
      $formGroup.appendChild($terminada);
      $formGroup.appendChild($label);
      $indicacion.appendChild($formGroup);
    }
  })
  .then(() => {
    if (condIndicacion.every(checkIndicacion)) {
      async function update_tarea(tarea, terminada) {
        const response = await apiRequest({
          url: `http://127.0.0.1:8000/tareas_asignadas/${idURL}/`,
          method: "PUT",
          token: token,
          body: {
            tarea,
            terminada,
          },
          action: "put tarea_asignada",
        });
        localStorage.setItem("Token", token);

        if (response) {
          location.replace(`/templates/flujos/flujos.html`);
        }
      }
      update_tarea(id_tarea, true);
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
    $("#myModal").modal("show");
    $("#myModal").on("hidden.bs.modal", function () {
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
