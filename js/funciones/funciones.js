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
let tareas = [];
let tareasAsignadas = [];
let unidades = [];
let funciones = [];
let creadores = [];

async function getTareas() {
    const promise = await apiRequest({
        url: "/tareas",
        method:"GET",
        token,
        action: "get tareas"
    })

    return Object.values(promise)
}


async function getCreadores() {
    const promise = await apiRequest({
        url: '/usuarios',
        method: 'GET',
        token,
        action: 'get usuarios'
    });


    return Object.values(promise);
}

async function getUnidades() {
    const promise = await apiRequest({
        url: '/unidades',
        method: 'GET',
        token,
        action: 'get unidades'
    });

    return Object.values(promise);
}

async function getFunciones() {
    const promise = await apiRequest({
        url: '/funciones',
        method: 'GET',
        token,
        action: 'get funciones'
    });

    return Object.values(promise);
}

async function getTareasAsignadas() {
    const promise = await apiRequest({
        url: '/tareas_asignadas',
        method: 'GET',
        token,
        action: 'get tareas asigandas'
    });

    return Object.values(promise)
}

async function loadFunciones() {
    funciones.forEach(funcion => {
        var sel = document.getElementById("table-body");
        var tr = document.createElement("tr");
        var tdId = document.createElement("td");
        var tdName = document.createElement("td");
        var tdDescripcion = document.createElement("td");
        var tdFechaInicio = document.createElement("td");
        var tdFechaTermino = document.createElement("td");
        var tdPorcentaje = document.createElement("td");
        var tdUnidad = document.createElement("td");
        var tdBtn = document.createElement("td");
        var btn = document.createElement("button");

        tdId.appendChild(document.createTextNode(funcion["ID"]));
        tdName.appendChild(document.createTextNode(funcion["NOMBRE"]));
        tdDescripcion.appendChild(
            document.createTextNode(funcion["DESCRIPCION"])
        );

        tdFechaInicio.appendChild(
            document.createTextNode(`${new Date(funcion["FECHA_INICIO"]).getDay()}/${new Date(funcion["FECHA_INICIO"]).getMonth()}/${new Date(funcion["FECHA_INICIO"]).getFullYear()}`)
        );
        tdFechaTermino.appendChild(
            document.createTextNode(`${new Date(funcion["FECHA_TERMINO"]).getDay()}/${new Date(funcion["FECHA_TERMINO"]).getMonth()}/${new Date(funcion["FECHA_TERMINO"]).getFullYear()}`)
        );

        let tareasAsigandasDeFuncion = []
        tareasAsignadas.forEach(tarea => tarea["ID_FUNCION"] == funcion["ID"] ? tareasAsigandasDeFuncion.push(tarea) : '')

        if (tareasAsigandasDeFuncion.length > 0){
            const terminadas = tareasAsigandasDeFuncion.reduce((actual, element) =>{
                if (element["TERMINADA"]){
                   return actual + 1;
                }else{
                    return actual
                };
            }, 0);

            tdPorcentaje.appendChild(
                document.createTextNode(`%${Math.round(terminadas/tareasAsigandasDeFuncion.length) * 100}`)
            );
        }else{
            tdPorcentaje.appendChild(
                document.createTextNode('NO TIENE TAREAS')
            );
        }
        let unidad = unidades.find(unidad => unidad["ID"] == funcion["ID_UNIDAD"])
        if (unidad){
            tdUnidad.appendChild(
                document.createTextNode(unidad["NOMBRE"])
            );
        }

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
        tr.appendChild(tdUnidad);
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

            const fecha_inicio = {
                dia: new Date(funcion["FECHA_INICIO"]).getDay() > 9 ? new Date(funcion["FECHA_INICIO"]).getDay() : `0${new Date(funcion["FECHA_INICIO"]).getDay()}`,
                mes: new Date(funcion["FECHA_INICIO"]).getMonth > 9 ? new Date(funcion["FECHA_INICIO"]).getMonth : `0${new Date(funcion["FECHA_INICIO"]).getMonth()}`,
                anio: new Date(funcion["FECHA_INICIO"]).getFullYear()
            }

            const fecha_termino = {
                dia: new Date(funcion["FECHA_TERMINO"]).getDay() > 9 ? new Date(funcion["FECHA_TERMINO"]).getDay() : `0${new Date(funcion["FECHA_TERMINO"]).getDay()}`,
                mes: new Date(funcion["FECHA_TERMINO"]).getMonth > 9 ? new Date(funcion["FECHA_TERMINO"]).getMonth : `0${new Date(funcion["FECHA_TERMINO"]).getMonth()}`,
                anio: new Date(funcion["FECHA_TERMINO"]).getFullYear()
            }

            selid.value = funcion.id;
            selNombre.value = funcion["NOMBRE"];
            selDescripcion.value = funcion["DESCRIPCION"];
            selFechaInicio.value = `${fecha_inicio.anio}-${fecha_inicio.mes}-${fecha_inicio.dia}`;
            selFechaTermino.value = `${fecha_termino.anio}-${fecha_termino.mes}-${fecha_termino.dia}`;
            selUnidad.value = funcion["ID_UNIDAD"];
            selEdit = funcion["ID"];
        });
    })
}

d.addEventListener("DOMContentLoaded", async () => {
    
    try {
        tareas = await getTareas();
        creadores = await getCreadores();
        unidades = await getUnidades();
        funciones = await getFunciones();
        tareasAsignadas = await getTareasAsignadas();

        tareas.forEach(tarea => {
            var selAsignado = document.getElementById(
                "select-tarea"
            );
            var opt = document.createElement("option");
            opt.text = tarea["NOMBRE"];
            opt.value = tarea["ID"];
            selAsignado.appendChild(opt);
        });
    
        creadores.forEach(usuario => {
            var selCreador = document.getElementById(
                "select-creador"
            );
    
            var opt = document.createElement("option");
            opt.text = `${usuario["NOMBRE"]} ${usuario["APELLIDO"]}`;
            opt.value = usuario["ID"];
            selCreador.appendChild(opt);
        });

        unidades.forEach(unidad => {
            var selCreador = document.getElementById(
                "select-unidad"
            );
            var opt = document.createElement("option");
            opt.text = unidad["NOMBRE"];
            opt.value = unidad["ID"];
            selCreador.appendChild(opt);
        })

        await loadFunciones()
    } catch (error) {
        console.log(error)
    }
})

async function addFuncion(params) {
    const {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_termino,
        id_unidad
    } = params;

    console.log(params)

    const response = await apiRequest({
        url: "/funciones",
        method: "POST",
        token: token,
        body: {
            nombre,
            descripcion,
            fecha_inicio,
            fecha_termino,
            id_unidad,
        },
        action: "post funciones",
    });

    if (response) {
        $('#myModal').modal('show');
        $('#myModal').on('hidden.bs.modal', function () {
            location.replace("./funciones.html");
        });
    } else {
        alert("Datos incorrectos");
    }
}


let selEdit = document.getElementById("select-id").value;



async function editFuncion(params) {
    const {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_termino,
        id_unidad
    } = params;
    const response = await apiRequest({
        url: `/funciones/${selEdit}/`,
        method: "PUT",
        token: token,
        body: {
            nombre,
            descripcion,
            fecha_inicio,
            fecha_termino,
            id_unidad,
        },
        action: "put funciones",
    });
    
    console.log(response)
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
        const nombre = $nombre.value;
        const descripcion = $descripcion.value;
        const fecha_inicio =`${new Date($fechaInicio.value).getDay()}/${new Date($fechaInicio.value).getMonth()}/${new Date($fechaInicio.value).getFullYear()}`;
        const fecha_termino = `${new Date($fechaTermino.value).getDay()}/${new Date($fechaTermino.value).getMonth()}/${new Date($fechaTermino.value).getFullYear()}`;
        const id_unidad = $unidad.value;
        editFuncion({
            nombre,
            descripcion,
            fecha_inicio,
            fecha_termino,
            id_unidad
        });
    }
});

d.getElementById("agregar_tarea").addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.id === "agregar_tarea") {
        const nombre = $nombre.value;
        const descripcion = $descripcion.value;
        const fecha_inicio =`${new Date($fechaInicio.value).getDay()}/${new Date($fechaInicio.value).getMonth()}/${new Date($fechaInicio.value).getFullYear()}`;
        const fecha_termino = `${new Date($fechaTermino.value).getDay()}/${new Date($fechaTermino.value).getMonth()}/${new Date($fechaTermino.value).getFullYear()}`;
        const id_unidad = $unidad.value;
        addFuncion({
            nombre,
            descripcion,
            fecha_inicio,
            fecha_termino,
            id_unidad
        });
    }
});

const user = localStorage.getItem('username');
const div = d.getElementById('alerta');
if (user === 'admin'){
    div.style.display = 'block'
}