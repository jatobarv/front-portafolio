import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;
const okBtn = d.getElementById("ok");

var nCreadores;
var nPags;
var usuarios = [];
var nFunciones;
var datos = [];

var $nombre = d.getElementById("select-nombre");
var $descripcion = document.getElementById("select-descripcion");
var $fechaInicio = document.getElementById("select-fecha_inicio");
var $fechaTermino = d.getElementById("select-fecha_termino");
var $porcentaje = d.getElementById("select-porcentaje");
var $tarea = d.getElementById("select-tarea");
var $creador = d.getElementById("select-creador");
var $unidad = d.getElementById("select-unidad");

var nTareas;
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

                    for (const unidad of unidades) {
                        var selCreador = document.getElementById(
                            "select-unidad"
                        );
                        var opt = document.createElement("option");
                        opt.text = unidad.nombre;
                        opt.value = unidad.id;
                        selCreador.appendChild(opt);
                    }
                });
        }
    })
    .catch((err) => console.log(err));

async function addFuncion(
    nombre,
    descripcion,
    fecha_inicio,
    fecha_termino,
    porcentaje_realizacion,
    tarea,
    usuario,
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
            tarea,
            usuario,
            unidad,
        },
        action: "post funciones",
    });
    localStorage.setItem("Token", token);

    if (response) {
        $('#myModal').modal('show');
        $('#myModal').on('hidden.bs.modal', function () {
            location.replace("./funciones.html");
        });
    } else {
        alert("Datos incorrectos");
    }
}

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
let selEdit = document.getElementById("select-id").value;

getFunciones().then((funciones) => {
    nFunciones = funciones.count;
    nPags = Math.ceil(nFunciones / 10);
    
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
                datos = res.data.results;
                for (const funcion of datos) {
                    var sel = document.getElementById("table-body");
                    var tr = document.createElement("tr");
                    var tdId = document.createElement("td");
                    var tdName = document.createElement("td");
                    var tdDescripcion = document.createElement("td");
                    var tdFechaInicio = document.createElement("td");
                    var tdFechaTermino = document.createElement("td");
                    var tdPorcentaje = document.createElement("td");
                    var tdTarea = document.createElement("td");
                    var tdUnidad = document.createElement("td");
                    var tdCreador = document.createElement("td");
                    var tdBtn = document.createElement("td");
                    var btn = document.createElement("button");

                    tdId.appendChild(document.createTextNode(funcion.id));
                    tdName.appendChild(document.createTextNode(funcion.nombre));
                    tdDescripcion.appendChild(
                        document.createTextNode(funcion.descripcion)
                    );
                    tdFechaInicio.appendChild(
                        document.createTextNode(funcion.fecha_inicio)
                    );
                    tdFechaTermino.appendChild(
                        document.createTextNode(funcion.fecha_termino)
                    );
                    tdPorcentaje.appendChild(
                        document.createTextNode(funcion.porcentaje_realizacion)
                    );
                    tdTarea.appendChild(
                        document.createTextNode(funcion.nombre_tarea)
                    );
                    tdUnidad.appendChild(
                        document.createTextNode(funcion.nombre_unidad)
                    );
                    tdCreador.appendChild(
                        document.createTextNode(funcion.nombre_usuario)
                    );
                    btn.className = "btn btn-secondary";
                    btn.type = "submit";
                    btn.id = "btn " + funcion.id;
                    btn.appendChild(document.createTextNode("Editar"));

                    tr.appendChild(tdId);
                    tr.appendChild(tdName);
                    tr.appendChild(tdDescripcion);
                    tr.appendChild(tdFechaInicio);
                    tr.appendChild(tdFechaTermino);
                    tr.appendChild(tdPorcentaje);
                    tr.appendChild(tdTarea);
                    tr.appendChild(tdUnidad);
                    tr.appendChild(tdCreador);
                    tr.appendChild(tdBtn);
                    tdBtn.appendChild(btn);
                    sel.appendChild(tr);

                    btn.addEventListener("click", (event) => {
                        event.preventDefault();
                        var selNombre = document.getElementById(
                            "select-nombre"
                        );
                        var selDescripcion = document.getElementById(
                            "select-descripcion"
                        );
                        var selFechaInicio = document.getElementById(
                            "select-fecha_inicio"
                        );
                        var selFechaTermino = document.getElementById(
                            "select-fecha_termino"
                        );
                        var selPorcentaje = document.getElementById(
                            "select-porcentaje"
                        );
                        var selTarea = document.getElementById(
                            "select-tarea"
                        );
                        var selCreador = document.getElementById(
                            "select-creador"
                        );
                        var selUnidad = document.getElementById(
                            "select-unidad"
                        );
                        var selid = document.getElementById("select-id");
                        (selid.value = funcion.id),
                            (selNombre.value = funcion.nombre),
                            (selDescripcion.value = funcion.descripcion),
                            (selFechaInicio.value = funcion.fecha_inicio),
                            (selFechaTermino.value = funcion.fecha_termino),
                            (selPorcentaje.value =
                                funcion.porcentaje_realizacion),
                            (selTarea.value = funcion.tarea),
                            (selUnidad.value = funcion.unidad);
                            (selCreador.value = funcion.usuario),
                        selEdit = funcion.id;
                    });
                }
            });
    }
    for (const funcion of funciones.results) {
    }
});

async function editFuncion(
    nombre,
    descripcion,
    fecha_inicio,
    fecha_termino,
    porcentaje_realizacion,
    usuario,
    unidad
) {
    const response = await apiRequest({
        url: `http://127.0.0.1:8000/funciones/${selEdit}/`,
        method: "PUT",
        token: token,
        body: {
            nombre,
            descripcion,
            fecha_inicio,
            fecha_termino,
            porcentaje_realizacion,
            usuario,
            unidad,
        },
        action: "put funciones",
    });
    localStorage.setItem("Token", token);

    if (response) {
        location.replace("./funciones.html");
    } else {
        alert("Datos incorrectos");
    }
}

d.getElementById("modificar_tarea").addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.id === "modificar_tarea") {
        editFuncion(
            $nombre.value,
            $descripcion.value,
            $fechaInicio.value,
            $fechaTermino.value,
            $porcentaje.value,
            $tarea.value,
            $creador.value,
            $unidad.value
        );
    }
});

d.getElementById("agregar_tarea").addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.id === "agregar_tarea") {
        addFuncion(
            $nombre.value,
            $descripcion.value,
            $fechaInicio.value,
            $fechaTermino.value,
            $porcentaje.value,
            $tarea.value,
            $creador.value,
            $unidad.value
        );
    }
});

const user = localStorage.getItem('username');
const div = d.getElementById('alerta');
if (user === 'admin'){
    div.style.display = 'block'
}