import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

let arrTareas = [];
const username = localStorage.getItem("username");
const rol = localStorage.getItem("rol");

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

async function getUsuarios(){
  const promise = await apiRequest({
    url: "http://127.0.0.1:8000/usuarios/",
    method: 'GET',
    token,
    action: 'get usuarios'
  });

  return Object.values(promise.results)
}

function sendEmail(params) {
  const {
    email,
    subject,
    body
  } = params;

  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "proccess.sa@gmail.com",
    Password : "5C159BE8B9DAA9955D372885DC8031796AF4",
    To : email,
    From : "proccess.sa@gmail.com",
    Subject : subject,
    Body : body
  }).then(
    message => location.replace("./flujos.html");
  )
};

getTareasAsignadas().then((data) => {
  for (const tarea of data) {
    if (username === tarea.nombre_usuario || rol === "Administrador") {
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
      link.id = tarea.id;
      link.textContent = "Finalizada ✔";
      link.className = "btn btn-light m-1";
      link.onclick = function () {
        document.getElementById("tarea").value = tarea.id;
      };
      if (tarea.terminada === false) {
        link.textContent = "Reportar";
        tdReporte.appendChild(realizar);
        link.setAttribute("data-toggle", "modal");
        link.setAttribute("data-target", "#myModal");
        realizar.textContent = "Realizar";
        realizar.className = "btn btn-light m-1";
        realizar.style = "width: 88px;";

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


      if (diffDias < 0) {
        tr.style.backgroundColor = "#E6ADB2";
      } else if (diffDias >= 7) {
        tr.style.backgroundColor = "#ACE6AF";
      } else if (diffDias < 7) {
        tr.style.backgroundColor = "#D8E6AD";
      }
    }
  }
});

const d = document;
const user_id = localStorage.getItem("user_id");

let usuarios;

d.addEventListener("DOMContentLoaded", async () => {
  try {
    usuarios = await getUsuarios();

  } catch (error) {
    console.log(error)
  }
});

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

  const usuarioActual = usuarios.find(urs => urs.id == localStorage.getItem('user_id'))

  console.log(usuarioActual)
  if (response) {
    await sendEmail({
      email:'Liive2woo@gmail.com',
      subject: `Reporte de tarea ${tarea}: ${nombre}`,
      body: `${usuarioActual.nombre} ${usuarioActual.apellido} (${usuarioActual.username}): ${detalle}`
    })
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
