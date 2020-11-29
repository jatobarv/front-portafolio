const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
const token = localStorage.getItem("Token");
const d = document;

function getIndicaciones() {
  const promise = axios.get(
    `http://127.0.0.1:8000/indicacion_tarea/?id_tarea=${id}`,
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

// window.onbeforeunload = function() {
//     return false;
// };

getIndicaciones().then((indicaciones) => {
  for (const indicacion of indicaciones.results) {
    console.log(indicacion);
    const $indicacion = d.getElementById("indicaciones");
    const $formGroup = d.createElement("div");
    const $h5 = d.createElement("h5");
    const $label2 = d.createElement("label");
    const $indic = d.createElement("h5");
    const $terminada = d.createElement("input");
    const $btn = d.createElement("button");
    const $nombreUsuario = d.getElementById("nombreUsuario");
    const $nombreTarea = d.getElementById("nombreTarea");
    $formGroup.className = "form-check  mb-2";
    $h5.innerHTML = "Indicación";
    $label2.className = "form-check-label";
    $indic.innerText = indicacion.indicaciones;
    $terminada.type = "checkbox";
    $terminada.className = "form-check-input";
    $btn.className = "btn btn-danger";
    $label2.innerHTML = "Terminada";
    $nombreUsuario.value = indicacion.nombre_usuario;
    $nombreTarea.value = indicacion.nombre_tarea;
    indicacion.terminada
      ? (($terminada.checked = true), ($terminada.disabled = true))
      : false;
    console.log(indicacion);
    // if (indicacion.nombre_tarea == 5) {
    $formGroup.appendChild($indic);
    $formGroup.appendChild($terminada);
    $formGroup.appendChild($label2);
    $indicacion.appendChild($formGroup);
    // }
  }
});
