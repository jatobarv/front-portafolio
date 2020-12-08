import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;
let tareasAsignadas;
let tareas;
let funciones;
let usuarios;

async function getTareasAsignadas() {
  const promise = await apiRequest({
    url: '/tareas_asignadas',
    method: 'GET',
    token,
    action: 'get tareas asignadas'
  });

  return Object.values(promise)
}

async function getTareas() {
  const promise = await apiRequest({
    url: '/tareas',
    method: 'GET',
    token,
    action: 'get tareas'
  });

  return Object.values(promise)
}

async function getFunciones(){
  const promise = await apiRequest({
    url: '/funciones',
    method: 'GET',
    token,
    action: 'get funciones'
  });

  return Object.values(promise);
}

async function getUsuarios(){
  const promise = await apiRequest({
    url: '/usuarios',
    method: 'GET',
    token,
    action: 'get usuarios'
  })

  return Object.values(promise);
}

function loadTable(){
  tareasAsignadas.forEach(tareaAignada => {
    console.log(tareaAignada)
    const tarea = tareas.find(tar => tar["ID"] == tareaAignada["ID_TAREA"]);
    const funcion = funciones.find(fun => fun["ID"] == tareaAignada["ID_FUNCION"]);
    const usuario = usuarios.find(usu => usu["ID"] == tareaAignada["ID_USUARIO"]);

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

    tdId.appendChild(document.createTextNode(tareaAignada["ID"]));
    tdName.appendChild(document.createTextNode(tarea["NOMBRE"]));
    console.log()
    tdDescripcion.appendChild(
      document.createTextNode(tarea["DESCRIPCION"])
    );
    tdFechaInicio.appendChild(
      document.createTextNode(funcion["FECHA_INICIO"])
    );
    tdFechaTermino.appendChild(
      document.createTextNode(funcion["FECHA_TERMINO"])
    );
    tdAsignado.appendChild(document.createTextNode(`${usuario["NOMBRE"]} ${usuario["APELLIDO"]}`));
    tdFuncion.appendChild(document.createTextNode(funcion["NOMBRE"]));
    tdReporte.appendChild(link);
    link.textContent = "Reportar";
    link.id = tarea.id;
    link.setAttribute("data-toggle", "modal");
    link.setAttribute("data-target", "#myModal");
    link.className = "btn btn-light m-1";
    link.style = "width: 88px;"
    link.onclick = function () {
      document.getElementById("tarea").value = tarea.id;
    };
    if (tarea.terminada === false) {
      tdReporte.appendChild(realizar);
      realizar.textContent = "Realizar";
      realizar.className = "btn btn-light m-1";
      realizar.style = "width: 88px;"

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

    let fecInicio = new Date(tarea.fecha_inicio);
    let fecTermino = new Date(tarea.fecha_termino);

    let diffTiempo = fecTermino.getTime() - fecInicio.getTime();
    let diffDias = diffTiempo / (1000 * 3600 * 24);

    console.log(diffDias);

    if (diffDias < 0) {
      tr.style.backgroundColor = "#E6ADB2";
    } else if (diffDias >= 7) {
      tr.style.backgroundColor = "#ACE6AF";
    } else if (diffDias < 7) {
      tr.style.backgroundColor = "#D8E6AD";
    }
  });
}

d.addEventListener('DOMContentLoaded', async () => {
  try {
    tareasAsignadas = await getTareasAsignadas();
    tareas = await getTareas();
    funciones = await getFunciones();
    usuarios = await getUsuarios();
    
    loadTable();

  } catch (error) {
    console.log(error);
  }
});

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
