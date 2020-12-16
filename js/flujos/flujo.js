import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");
let usuario;
let roles;
let rol;
let funciones;
let tareas;
const username = localStorage.getItem("username");

async function getTareasAsignadas() {
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

async function getRoles(){
  const promise = await apiRequest({
    url: "http://127.0.0.1:8000/roles/",
    method: 'GET',
    token,
    action: 'get roles'
  });

  return Object.values(promise)
}

async function getFunciones(){
  const promise = await apiRequest({
    url: "http://127.0.0.1:8000/funciones/",
    method: 'GET',
    token,
    action: 'get roles'
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
  }).then( message => location.replace("./flujos.html"));
};

async function cargarTabla(data) {
  for (const tarea of data) {
    if (username === tarea.nombre_usuario || rol.name === "Administrador" || rol.name === "Diseñador") {
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
};

const d = document;
const user_id = localStorage.getItem("user_id");

let usuarios;

d.addEventListener("DOMContentLoaded", async () => {
  try {
    usuarios = await getUsuarios();
    roles = await getRoles();
    tareas = await getTareasAsignadas();
    funciones = await getFunciones();
    console.log(funciones)
    usuario = usuarios.find(usr => usr.username == localStorage.getItem('username'));
    rol = roles.find(rl => rl.id == usuario.rol_usuario);
    cargarTabla(tareas);
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
      email:'javiertobarvera@gmail.com',
      subject: `Reporte de tarea ${tarea}: ${nombre}`,
      body:`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body style="max-width: 600px; margin: auto; border: 1px solid rgb(230, 230, 230) font-family: 'Asap', sans-serif; font-size: 12px; text-align:center;">
          <h1 style="text-align: center; width: 100%;">Reporte de tarea</h1>
          <p>Usuario: ${usuarioActual.username}</p>
          <p>Nombre: ${usuarioActual.nombre} ${usuarioActual.apellido}</p>
          <label for="">Detalle:</label>
          <p>${detalle}</p>
      </body>
      </html>`
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

d.addEventListener("click", async (event) => {
  const target = event.target
  if (target.getAttribute("name") ) {
    const $table = d.getElementById("table");
    const printWindow = window.open('', '', 'height=1000 ,width=1000');
    printWindow.document.write(`<html><head><title>DIV Contents</title>`);
    printWindow.document.write('</head><body style="align-items: center;">');
    printWindow.document.write('<table>');
    printWindow.document.write(`
      <thead class="thead-light">
        <tr style="border: 1px solid black;">
          <th style="background-color: #add8e6; color: #000">ID Tarea</th>
          <th style="background-color: #add8e6; color: #000">
            Nombre Tarea
          </th>
          <th style="background-color: #add8e6; color: #000">
            Descripción Tarea
          </th>
          <th style="background-color: #add8e6; color: #000">
            Fecha Inicio
          </th>
          <th style="background-color: #add8e6; color: #000">
            Fecha Término
          </th>
          <th style="background-color: #add8e6; color: #000">Asignado</th>
          <th style="background-color: #add8e6; color: #000">Funcion</th>
        </tr>
      </thead>
      <tbody>
    `);
    tareas.forEach(tarea => {
      console.log(tarea)
      printWindow.document.write(`
      <tr>
        <td>${tarea.id}</td>
        <td>${tarea.nombre_tarea}</td>
        <td>${tarea.descripcion_tarea}</td>
        <td>${tarea.fecha_inicio}</td>
        <td>${tarea.fecha_termino}</td>
        <td>${tarea.nombre_usuario}</td>
        <td>${tarea.nombre_funcion}</td>
      </tr>
      `)
    })
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    setTimeout(function () {
      printWindow.print();
    }, 500);
  }
})
