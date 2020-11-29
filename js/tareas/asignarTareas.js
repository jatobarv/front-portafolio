import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;

var nTareas;
var nPags;
var tareas = [];

function getTareas() {
    const promise = axios.get(`http://127.0.0.1:8000/tareas/`, {
        headers: {
            Authorization: "Token " + token,
            "Content-Type": "application/json",
        },
    });

    const dataPromise = promise.then((response) => response.data);

    return dataPromise;
}

getTareas()
    .then((data) => {
        nTareas = data.count;
        console.log(data);
        nPags = Math.round(nTareas / 10);
        if (nPags === 0) {
            nPags = 1;
        }
        for (let i = 1; i <= nPags; i++) {
            axios
                .get(`http://127.0.0.1:8000/tareas/?page=${i}`, {
                    headers: {
                        Authorization: "Token " + token,
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    tareas = res.data.results;
                    console.log(tareas);

                    for (const tarea of tareas) {
                        var selAsignado = document.getElementById(
                            "select-tarea"
                        );
                        var opt = document.createElement("option");
                        opt.text = tarea.nombre;
                        opt.value = tarea.id;
                        selAsignado.appendChild(opt);
                    }
                });
        }
    })
    .catch((err) => console.log(err));

var nAsignado;
var nPags;
var usuarios = [];

function getAsignados() {
    const promise = axios.get(`http://127.0.0.1:8000/usuarios/`, {
        headers: {
            Authorization: "Token " + token,
            "Content-Type": "application/json",
        },
    });

    const dataPromise = promise.then((response) => response.data);

    return dataPromise;
}

getAsignados()
    .then((data) => {
        nAsignado = data.count;
        console.log(data);
        nPags = Math.round(nAsignado / 10);
        if (nPags === 0) {
            nPags = 1;
        }
        for (let i = 1; i <= nPags; i++) {
            axios
                .get(`http://127.0.0.1:8000/usuarios/?page=${i}`, {
                    headers: {
                        Authorization: "Token " + token,
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    usuarios = res.data.results;
                    console.log(usuarios);

                    for (const usuario of usuarios) {
                        var selAsignado = document.getElementById(
                            "select-asignado"
                        );
                        var opt = document.createElement("option");
                        opt.text = usuario.username;
                        opt.value = usuario.id;
                        selAsignado.appendChild(opt);
                    }
                });
        }
    })
    .catch((err) => console.log(err));

var nFunciones;
var nPags;
var funciones = [];

function getFunciones() {
    const promise = axios.get(`http://127.0.0.1:8000/funciones/`, {
        headers: {
            Authorization: "Token " + token,
            "Content-Type": "application/json",
        },
    });

    const dataPromise = promise.then((response) => response.data);

    return dataPromise;
}

getFunciones()
    .then((data) => {
        nFunciones = data.count;
        console.log(data);
        nPags = Math.round(nFunciones / 10);
        if (nPags === 0) {
            nPags = 1;
        }
        for (let i = 1; i <= nPags; i++) {
            axios
                .get(`http://127.0.0.1:8000/funciones/?page=${i}`, {
                    headers: {
                        Authorization: "Token " + token,
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    funciones = res.data.results;
                    console.log(funciones);

                    for (const funcion of funciones) {
                        var selCreador = document.getElementById(
                            "select-funcion"
                        );
                        var opt = document.createElement("option");
                        opt.text = funcion.nombre;
                        opt.value = funcion.id;
                        selCreador.appendChild(opt);
                        console.log(opt.value);
                    }
                });
        }
    })
    .catch((err) => console.log(err));

async function asignarTareas(
    fecha_inicio,
    fecha_termino,
    terminada,
    tarea,
    usuario,
    funcion,
    indicacion
) {
    const response = await apiRequest({
        url: "http://127.0.0.1:8000/tareas_asignadas/",
        method: "POST",
        token: token,
        body: {
            fecha_inicio,
            fecha_termino,
            terminada,
            tarea,
            usuario,
            funcion,
            indicacion
        },
        action: "post tareas_asignadas",
    });
    localStorage.setItem("Token", token);

    if (response) {
        // localStorage.setItem("Token", response.token);
        location.replace("./asignarTareas.html");
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
    if (target.id === "tareas_asignadas") {
        asignarTareas(
            target.fecha_inicio.value,
            target.fecha_termino.value,
            target.terminada.value,
            selTarea.value,
            selAsignado.value,
            selFuncion.value
        );
    }
});
