import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;
const okBtn = d.getElementById("ok");

let tareas;

//DOM Conetent
const $tareaId = d.querySelector('#tareaId')
const $nombre = d.querySelector('#nombre')
const $descripcion = d.querySelector('#descripcion')
const $btnSubmit = d.querySelector('#confirmar')

async function postTareas(nombre, descripcion) {
    const response = await apiRequest({
        url: "http://127.0.0.1:8000/tareas/",
        method: "POST",
        token: token,
        body: {
            nombre,
            descripcion,
        },
        action: "post tareas",
    });
    localStorage.setItem("Token", token);

    if (response) {
        $('#myModal').modal('show');
        $('#myModal').on('hidden.bs.modal', function () {
            location.replace("./tareas.html");
        });
    } else {
        alert("Datos incorrectos");
    }
}

async function getTareas(){
    const promise = await apiRequest({
        url: "http://127.0.0.1:8000/tareas/",
        method: "GET",
        token: token,
        action: "get tareas", 
    })

    return Object.values(promise.results)
}

d.addEventListener("DOMContentLoaded", async () =>{
    const $tbody = d.querySelector('tbody')
    $tbody.innerHTML = ""
    const $template = d.querySelector('#internalDrivesTemplate')
    const $fragment = new DocumentFragment()

    try {
        tareas = await getTareas();
        tareas.forEach(tarea => {
            console.log(tarea.id)
            const $clone = $template.content.cloneNode(true)
            const $tr = $clone.querySelector('tr')
            const $td = $tr.querySelectorAll('td')
            const $button = d.createElement('button')
    
            $button.textContent = "EDITAR"
            $button.name = "editarTarea"
            $button.className = "btn btn-secondary"
            $button.setAttribute("data-tarea-id",tarea.id)
    
            $td[0].textContent = tarea.id
            $td[1].textContent = tarea.nombre
            $td[2].textContent = tarea.descripcion
            $td[3].insertAdjacentElement('beforeend',$button)
    
            $fragment.append($tr)
        });

        $tbody.append($fragment)

    } catch (error) {
        console.log(error)
    }
})  
d.addEventListener("submit", async (event) => {
    event.preventDefault();
    const target = event.target;

    if (target.id === "tareas") {
        if ($tareaId.value){
            const body = {
                nombre: $nombre.value,
                descripcion: $descripcion.value,
            }
            const response = await apiRequest({
                url: 'http://127.0.0.1:8000/tareas/'+$tareaId.value+'/',
                method: 'PUT',
                token,
                body,
                action: "put tarea"
            })
            location.reload()
        }else{
            postTareas(target.nombre.value, target.descripcion.value);
        }
    }
});

d.addEventListener("click", event => {
    const target = event.target

    if (target.getAttribute("name") === "editarTarea") {
        const tarea = tareas.find( tarea => tarea.id == target.dataset.tareaId);
        
        if (tarea){
            $btnSubmit.textContent = "EDITAR"
            $tareaId.value = tarea.id
            $nombre.value = tarea.nombre
            $descripcion.value = tarea.descripcion
        }
    }
})
