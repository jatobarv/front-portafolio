import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;

var nCreadores;
var nPags;
var usuarios = [];

function getCreadores() {
    const promise = axios.get(`http://127.0.0.1:8000/usuarios/`, {
        headers: {
            Authorization: "Token " + token,
            "Content-Type": "application/json",
        },
    });

    const dataPromise = promise.then((response) => response.data);

    return dataPromise;
}

getCreadores()
    .then((data) => {
        nCreadores = data.count;
        console.log(data);
        nPags = Math.round(nCreadores / 10);
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
                        var selCreador = document.getElementById(
                            "select-creador"
                        );
                        var opt = document.createElement("option");
                        opt.text = usuario.username;
                        opt.value = usuario.id;
                        selCreador.appendChild(opt);
                    }
                });
        }
    })
    .catch((err) => console.log(err));

var nUnidades;
var nPags;
var unidades = [];

function getUnidades() {
    const promise = axios.get(`http://127.0.0.1:8000/unidades/`, {
        headers: {
            Authorization: "Token " + token,
            "Content-Type": "application/json",
        },
    });

    const dataPromise = promise.then((response) => response.data);

    return dataPromise;
}

getUnidades()
    .then((data) => {
        nUnidades = data.count;
        console.log(data);
        nPags = Math.round(nUnidades / 10);
        if (nPags === 0) {
            nPags = 1;
        }
        for (let i = 1; i <= nPags; i++) {
            axios
                .get(`http://127.0.0.1:8000/unidades/?page=${i}`, {
                    headers: {
                        Authorization: "Token " + token,
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    unidades = res.data.results;
                    console.log(unidades);

                    for (const unidad of unidades) {
                        var selCreador = document.getElementById(
                            "select-unidad"
                        );
                        var opt = document.createElement("option");
                        opt.text = unidad.nombre;
                        opt.value = unidad.id;
                        selCreador.appendChild(opt);
                        console.log(opt.value);
                    }
                });
        }
    })
    .catch((err) => console.log(err));

async function funcion(
    nombre,
    descripcion,
    fecha_inicio,
    fecha_termino,
    porcentaje_realizacion,
    creador,
    unidad
) {
    const response = await apiRequest({
        url: "http://127.0.0.1:8000/funciones/",
        method: "POST",
        token: token,
        body: {
            nombre,
            descripcion,
            fecha_inicio,
            fecha_termino,
            porcentaje_realizacion,
            creador,
            unidad,
        },
        action: "post unidades",
    });
    localStorage.setItem("Token", token);

    if (response) {
        localStorage.setItem("Token", response.token);
        // location.replace("./principal.html");
    } else {
        alert("Datos incorrectos");
    }
}

d.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = event.target;

    var selCreador = document.getElementById("select-creador");
    var selUnidad = document.getElementById("select-unidad");
    if (target.id === "unidades") {
        funcion(
            target.nombre.value,
            target.descripcion.value,
            target.fecha_inicio.value,
            target.fecha_termino.value,
            target.porcentaje_realizacion.value,
            selCreador.value,
            selUnidad.value
        );
    }
});
