import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;
const okBtn = d.getElementById("ok");

var nPags;
let tareas;
let usuarios;
let tareas_asignadas;
let funciones;
let unidades;

async function getTareas() {
    const promise = await apiRequest({
        url: '/tareas',
        method: 'GET',
        token,
        action: 'get tareas'
    });

    return Object.values(promise);
}

async function getTareasAsignadas() {
    const promise = await apiRequest({
        url: '/tareas_asignadas',
        method: 'GET',
        token,
        action: 'get asignar tareas'
    }); 

    return Object.values(promise)
}

async function getUsuarios(){
    const promise = await apiRequest({
        url: '/usuarios',
        method: 'GET',
        token,
        action: 'get usuarios'
    });

    return Object.values(promise)
}


async function getFunciones() {
    const promise = await apiRequest({
        url: '/funciones',
        method: 'GET',
        token,
        action: 'get funciones'
    })

    return Object.values(promise)
}

async function getUnidades() {
    const promise = await apiRequest({
        url: '/unidades',
        method: 'GET',
        token,
        action: 'get unidades'
    })

    return Object.values(promise)
}

d.addEventListener("DOMContentLoaded", async () => {
    try {
        tareas = await getTareas();
        tareas_asignadas = await getTareasAsignadas();
        usuarios = await getUsuarios();
        funciones = await getFunciones();
        unidades = await getUnidades();

        tareas.forEach( tarea => {
            var selAsignado = document.getElementById(
                "select-tarea"
            );
            var opt = document.createElement("option");
            opt.text = tarea["NOMBRE"];
            opt.value = tarea["ID"];
            selAsignado.appendChild(opt);
        });

        usuarios.forEach(usuario => {
            var selAsignado = document.getElementById(
                "select-asignado"
            );
            var opt = document.createElement("option");
            opt.text = `${usuario["NOMBRE"]} ${usuario["APELLIDO"]}`;
            opt.value = usuario["ID"];
            selAsignado.appendChild(opt);
        });

        funciones.forEach(funcion => {
            var selCreador = document.getElementById(
                "select-funcion"
            );
            var opt = document.createElement("option");
            opt.text = funcion["NOMBRE"];
            opt.value = funcion["ID"];
            selCreador.appendChild(opt);
        });

    } catch (error) {
        console.log(error)
    }
})

async function asignarTareas(params) {
    const {
        terminada,
        id_tarea,
        id_usuario,
        id_funcion,
    } = params;

    const response = await apiRequest({
        url: "/tareas_asignadas",
        method: "POST",
        token: token,
        body: {
            terminada,
            id_tarea,
            id_usuario,
            id_funcion,
        },
        action: "post tareas_asignadas",
    });

    if (response) {
        $('#myModal').modal('show');
        $('#myModal').on('hidden.bs.modal', function () {
            const idTarea = response.id;
            location.reload();
        });
    } else {
        alert("Datos incorrectos");
    }
}

d.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = event.target;
    var selTarea = document.getElementById("select-tarea");
    var selAsignado = document.getElementById("select-asignado");
    var selFuncion = document.getElementById("select-funcion");

    const terminada = target.terminada.checked
    const id_tarea = selTarea.value
    const id_usuario = selAsignado.value
    const id_funcion = selFuncion.value
    
    if (target.id === "tareas_asignadas") {
        asignarTareas({
            terminada,
            id_tarea,
            id_funcion,
            id_usuario
        });
    }
});
