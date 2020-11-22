import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");
const user = localStorage.getItem("username");

function getTareasAsignadas() {
  const promise = axios.get(`http://127.0.0.1:8000/tareas_asignadas/`, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });

  const dataPromise = promise.then((response) => response.data);

  return dataPromise;
}

// window.onbeforeunload = function() {
//     return false;
// };

getTareasAsignadas().then((Tareas) => {
  for (const tarea of Tareas.results) {
    console.log(tarea);
    var sel = document.getElementById("table-body");
    var tr = document.createElement("tr");
    var tdId = document.createElement("td");
    var tdName = document.createElement("td");
    var tdDescripcion = document.createElement("td");
    var tdFechaInicio = document.createElement("td");
    var tdFechaTermino = document.createElement("td");
    var tdAsignado = document.createElement("td");
    var tdFuncion = document.createElement("td");
    var tdReporte = document.createElement("td");
    var link = document.createElement("a");

    if (user === tarea.nombre_usuario) {
      tdId.appendChild(document.createTextNode(tarea.id));
      tdName.appendChild(document.createTextNode(tarea.nombre_tarea));
      tdDescripcion.appendChild(
        document.createTextNode(tarea.descripcion_tarea)
      );
      tdFechaInicio.appendChild(document.createTextNode(tarea.fecha_inicio));
      tdFechaTermino.appendChild(document.createTextNode(tarea.fecha_termino));
      tdAsignado.appendChild(document.createTextNode(tarea.nombre_usuario));
      tdFuncion.appendChild(document.createTextNode(tarea.nombre_funcion));
      tdReporte.appendChild(link);
      link.textContent = "Reportar";
      link.id = tarea.id;
      // link.setAttribute('href', 'reporte.html');
      link.setAttribute("data-toggle", "modal");
      link.setAttribute("data-target", "#myModal");
      link.className = "btn btn-warning";
      link.onclick = function () {
        document.getElementById("tarea").value = tarea.id;
      };

      tr.appendChild(tdId);
      tr.appendChild(tdName);
      tr.appendChild(tdDescripcion);
      tr.appendChild(tdFechaInicio);
      tr.appendChild(tdFechaTermino);
      tr.appendChild(tdAsignado);
      tr.appendChild(tdFuncion);
      tr.appendChild(tdReporte);
      sel.appendChild(tr);
    } else if (user === "admin") {
      tdId.appendChild(document.createTextNode(tarea.id));
      tdName.appendChild(document.createTextNode(tarea.nombre_tarea));
      tdDescripcion.appendChild(
        document.createTextNode(tarea.descripcion_tarea)
      );
      tdFechaInicio.appendChild(document.createTextNode(tarea.fecha_inicio));
      tdFechaTermino.appendChild(document.createTextNode(tarea.fecha_termino));
      tdAsignado.appendChild(document.createTextNode(tarea.nombre_usuario));
      tdFuncion.appendChild(document.createTextNode(tarea.nombre_funcion));
      tdReporte.appendChild(link);
      link.textContent = "Reportar";
      link.id = tarea.id;
      // link.setAttribute('href', 'reporte.html');
      link.setAttribute("data-toggle", "modal");
      link.setAttribute("data-target", "#myModal");
      link.className = "btn btn-warning";
      link.onclick = function () {
        document.getElementById("tarea").value = tarea.id;
      };
      tr.appendChild(tdId);
      tr.appendChild(tdName);
      tr.appendChild(tdDescripcion);
      tr.appendChild(tdFechaInicio);
      tr.appendChild(tdFechaTermino);
      tr.appendChild(tdAsignado);
      tr.appendChild(tdFuncion);
      tr.appendChild(tdReporte);
      sel.appendChild(tr);
    }

    let fecInicio = new Date(tarea.fecha_inicio);
    let fecTermino = new Date(tarea.fecha_termino);

    let diffTiempo = fecTermino.getTime() - fecInicio.getTime();
    let diffDias = diffTiempo / (1000 * 3600 * 24);

    console.log(diffDias);

    if (diffDias < 0) {
      tr.style.backgroundColor = "red";
    } else if (diffDias >= 7) {
      tr.style.backgroundColor = "green";
    } else if (diffDias < 7) {
      tr.style.backgroundColor = "yellow";
    }
  }
});

const d = document;
const user_id = localStorage.getItem("user_id");

async function reporte(nombre, detalle, tarea, usuario) {
  const response = await apiRequest({
    url: "http://127.0.0.1:8000/reportes/",
    method: "POST",
    token: token,
    body: {
      nombre,
      detalle,
      tarea,
      usuario,
    },
    action: "post reporte",
  });
  localStorage.setItem("Token", token);

  if (response) {
    // localStorage.setItem("Token", response.token);
    location.replace("./flujos.html");
  } else {
    alert("Datos incorrectos");
  }
}

d.addEventListener("submit", (event) => {
  event.preventDefault();
  const target = event.target;

  if (target.id === "reporte") {
    reporte(
      target.nombre.value,
      target.detalle.value,
      target.tarea.value,
      user_id
    );
  }
});
