import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;

let tareas;
let usuarios;
let funciones;
let tareasAsignadas;

// DOM Content
const $tareaAsignadaId = d.querySelector('#tareaAsignadaId');
const $fechaInicio = d.querySelector('#fecha_inicio');
const $fechaTermino = d.querySelector('#fecha_termino');
const $selectTarea = d.querySelector('#select-tarea');
const $selectAsignado = d.querySelector('#select-asignado');
const $selectFuncion = d.querySelector('#select-funcion');
const $terminada = d.querySelector('#terminada');
const $btnSubmit = d.querySelector('#confirmar')

async function getTareas() {
    const promise = await apiRequest({
        url: 'http://127.0.0.1:8000/tareas/',
        method: "GET",
        token,
        action: "get tareas"
    })


    return Object.values(promise.results);
}

async function getUsuarios(){
    const promise = await apiRequest({
        url: 'http://127.0.0.1:8000/usuarios/',
        method: "GET",
        token,
        action: "get usuarios"
    });

    return Object.values(promise.results)
}

async function getFunciones(){
    const promise = await apiRequest({
        url: 'http://127.0.0.1:8000/funciones/',
        method: "GET",
        token,
        action: "get funciones"
    });

    return Object.values(promise.results)
}

async function getTareasAsignadas(){
    const promise = await apiRequest({
        url: 'http://127.0.0.1:8000/tareas_asignadas/',
        method: "GET",
        token,
        action: "get tareas asignadas"
    })

    return Object.values(promise)

}
d.addEventListener("DOMContentLoaded", async () => {
    const $tbody = d.querySelector('tbody')
    $tbody.innerHTML = ""
    const $template = d.querySelector('#internalDrivesTemplate')
    const $fragment = new DocumentFragment()

    try {
        tareas = await getTareas();
        usuarios = await getUsuarios();
        funciones = await getFunciones();
        tareasAsignadas = await getTareasAsignadas();

        for (const tarea of tareas) {
            var selAsignado = document.getElementById(
                "select-tarea"
            );
            var opt = document.createElement("option");
            opt.text = tarea.nombre;
            opt.value = tarea.id;
            selAsignado.appendChild(opt);
        }

        for (const usuario of usuarios) {
            var selAsignado = document.getElementById(
                "select-asignado"
            );
            var opt = document.createElement("option");
            opt.text = usuario.username;
            opt.value = usuario.id;
            selAsignado.appendChild(opt);
        }

        for (const funcion of funciones) {
            var selCreador = document.getElementById(
                "select-funcion"
            );
            var opt = document.createElement("option");
            opt.text = funcion.nombre;
            opt.value = funcion.id;
            selCreador.appendChild(opt);
        }

        tareasAsignadas.forEach(tareaAsignada => {
            const $clone = $template.content.cloneNode(true)
            const $tr = $clone.querySelector('tr')
            const $td = $tr.querySelectorAll('td')
            const $button = d.createElement('button')

            const tarea = tareas.find(tarea => tarea.id == tareaAsignada.tarea)
            const funcion = funciones.find(funcion => funcion.id == tareaAsignada.funcion)
            const usuario = usuarios.find(usuario => usuario.id == tareaAsignada.usuario)
    
            $button.textContent = "EDITAR"
            $button.name = "editarTareaAsignada"
            $button.className = "btn btn-secondary"
            $button.setAttribute("data-tarea-asignada-id",tareaAsignada.id)
    
            $td[0].textContent = tareaAsignada.id;
            $td[1].textContent = tareaAsignada.fecha_inicio;
            $td[2].textContent = tareaAsignada.fecha_termino;
            $td[3].textContent = tarea.nombre;
            $td[4].textContent = `${usuario.nombre} ${usuario.apellido}`;
            $td[5].textContent = funcion.nombre;
            $td[6].textContent = tareaAsignada.terminada ? 'SI' : 'NO';
            $td[7].insertAdjacentElement('beforeend',$button);
    
            $fragment.append($tr)
        });

        $tbody.append($fragment)

    } catch (error) {
        console.log(error)
    }
})

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
        token,
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

    if (response) {
        $('#myModal').modal('show');
        $('#myModal').on('hidden.bs.modal', function () {
            const idTarea = response.id;
            location.replace(`./asignarIndicacion.html?id=${idTarea}&tarea=${tarea}`);
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
    if (target.id === "tareas_asignadas") {
        asignarTareas(
            target.fecha_inicio.value,
            target.fecha_termino.value,
            target.terminada.checked,
            selTarea.value,
            selAsignado.value,
            selFuncion.value
        );
    }
});

d.addEventListener("click", event => {
    const target = event.target

    if (target.getAttribute("name") === "editarTareaAsignada") {
        const tareaAsignada = tareasAsignadas.find( tareaAsignada => tareaAsignada.id == target.dataset.tareaAsignadaId);

        if (tareaAsignada){
            $btnSubmit.textContent = "EDITAR"
            $tareaAsignadaId.value = tareaAsignada.id                      
            $fechaInicio.value = tareaAsignada.fecha_inicio                    
            $fechaTermino.value = tareaAsignada.fecha_termino                    
            $selectTarea.value = tareaAsignada.tarea                   
            $selectAsignado.value = tareaAsignada.usuario                 
            $selectFuncion.value = tareaAsignada.funcion                  
            $terminada.value = tareaAsignada.terminada                   
        }
    }
})
