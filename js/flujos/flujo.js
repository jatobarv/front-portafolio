import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");
const user = localStorage.getItem("username");

let arrTareas = [];
let nPags;
let nTareas;

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

getTareasAsignadas().then((data) => {
  nTareas = data.count;
  nPags = Math.round(nTareas / 10);
  console.log(nPags);
  if (nPags === 0) {
    nPags = 1;
  }
  for (let i = 1; i <= nPags; i++) {
    axios
      .get(`http://127.0.0.1:8000/tareas_asignadas/?page=${i}`, {
        headers: {
          Authorization: "Token " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        tareas = res.data.results;
        console.log(tareas);

        for (const tarea of tareas) {
          arrTareas.push(tarea.id);
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
          var realizar = document.createElement("a");
          var indicacion = document.createElement("a");

          tdId.appendChild(document.createTextNode(tarea.id));
          tdName.appendChild(document.createTextNode(tarea.nombre_tarea));
          tdDescripcion.appendChild(
            document.createTextNode(tarea.descripcion_tarea)
          );
          tdFechaInicio.appendChild(
            document.createTextNode(tarea.fecha_inicio)
          );
          tdFechaTermino.appendChild(
            document.createTextNode(tarea.fecha_termino)
          );
          tdAsignado.appendChild(document.createTextNode(tarea.nombre_usuario));
          tdFuncion.appendChild(document.createTextNode(tarea.nombre_funcion));
          tdReporte.appendChild(link);
          link.textContent = "Reportar";
          link.id = tarea.id;
          link.setAttribute("data-toggle", "modal");
          link.setAttribute("data-target", "#myModal");
          link.className = "btn btn-warning";
          link.onclick = function () {
            document.getElementById("tarea").value = tarea.id;
          };
          if (tarea.terminada === false) {
            tdReporte.appendChild(realizar);
            realizar.textContent = "Realizar";
            realizar.className = "btn btn-primary m-1";
            realizar.setAttribute(
              "href",
              `/templates/tareas/realizarTareas.html?id=${tarea.id}`
            );
            realizar.onclick = function () {};
          }
          tr.appendChild(tdId);
          tr.appendChild(tdName);
          tr.appendChild(tdDescripcion);
          tr.appendChild(tdFechaInicio);
          tr.appendChild(tdFechaTermino);
          tr.appendChild(tdAsignado);
          tr.appendChild(tdFuncion);
          tr.appendChild(tdReporte);
          sel.appendChild(tr);

          tdReporte.appendChild(indicacion);
          indicacion.textContent = "Indicacion";
          indicacion.id = tarea.id;
          indicacion.setAttribute("data-toggle", "modal");
          indicacion.setAttribute("data-target", "#addIndicacion");
          indicacion.className = "btn btn-success";
          indicacion.onclick = function () {
            document.getElementById("id_tarea").value = tarea.id;
            document.getElementById("tareas").value = tarea.tarea;
          };

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
    location.replace("./flujos.html");
  } else {
    alert("Datos incorrectos");
  }
}

d.addEventListener("submit", (event) => {
  event.preventDefault();
  const target = event.target;

  if (target.id === "agregar-indicacion") {
    addIndicacion(
      target.id_tarea.value,
      target.tarea.value,
      user_id,
      target.indicaciones.value
    );
  }
});
