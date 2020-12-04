import { apiRequest } from '../module.js'

const d = document;
const okBtn = d.getElementById("ok");
let internalDrives;
let empresas;

//DOM Content
const $internalDriveId = d.querySelector('#internalDriveId')
const $nombre = d.querySelector('#nombre')
const $descripcion = d.querySelector('#descripcion')
const $empresa = d.querySelector('#empresa')
const $btnSubmit = d.querySelector('#btnSubmit')

//Functions
function limpiarTodo (){
    $internalDriveId.value = ''
    $nombre.value = ''
    $descripcion.value = ''
    $empresa.value = ''
    $btnSubmit.textContent = "Aceptar"
}

function loadInternalDrivesList(){
    const $tbody = d.querySelector('tbody')
    $tbody.innerHTML = ""
    const $template = d.querySelector('#internalDrivesTemplate')
    const $fragment = new DocumentFragment()

    internalDrives.forEach(internalDrive => {
        const $clone = $template.content.cloneNode(true)
        const $tr = $clone.querySelector('tr')
        const $td = $tr.querySelectorAll('td')
        const $button = d.createElement('button')

        $button.textContent = "EDITAR"
				$button.name = "editarUnidadInterna"
				$button.className = "btn btn-secondary"
        $button.setAttribute("data-internal-drive-id",internalDrive.id)

        $td[0].textContent = internalDrive.nombre
        $td[1].textContent = internalDrive.descripcion
        $td[2].textContent = empresas.find(empresa => empresa.id == internalDrive.empresa).nombre
        $td[3].insertAdjacentElement('beforeend',$button)

        $fragment.append($tr)
    }); 

    $tbody.append($fragment)
}

d.addEventListener('DOMContentLoaded', async (event) => {
    const $fragment = new DocumentFragment()
    const token = localStorage.getItem('Token')
    
    let response = await apiRequest({
        url: 'http://127.0.0.1:8000/unidades/',
        method: "GET",
        token,
        action: "get internal drives"
    });
    
    internalDrives = response.results
    
    
    response = await apiRequest({
        url: 'http://127.0.0.1:8000/empresas/',
        method: "GET",
        token,
        action: "get empresas"
    });
    
    empresas = response.results
    
    $fragment.innerHTML = '';
    empresas.forEach(empresa => {
        const $option = d.createElement('option')
        $option.value = empresa.id
        $option.textContent = empresa.nombre
        $fragment.append($option)
    })
    
    $empresa.append($fragment)

    await loadInternalDrivesList()
})

d.addEventListener('click', event => {
    const target = event.target;

    if(target.name == 'editarUnidadInterna'){
        if (target.dataset.internalDriveId){
            const id = target.dataset.internalDriveId
            let internalDriveFound;
            $btnSubmit.textContent = "Editar"
            
            internalDrives.forEach(internalDrive =>{
                if (internalDrive.id == id){
                    internalDriveFound = internalDrive
                }
            })

            if (internalDriveFound){
                $internalDriveId.value = internalDriveFound.id
                $nombre.value = internalDriveFound.nombre
                $descripcion.value = internalDriveFound.descripcion
                $empresa.value = internalDriveFound.empresa
            }
        }
    }
    
    if(target.name == 'cancelar'){
        limpiarTodo()
    }

})

d.addEventListener('submit', async (event) => {
    event.preventDefault()
    const target = event.target;

    if (target.id == "internalDriveForm"){

        const body = {
            nombre: $nombre.value,
            descripcion: $descripcion.value,
            empresa: $empresa.value
        }
        const response = await apiRequest({
            url: $internalDriveId.value ? 'http://127.0.0.1:8000/unidades/'+$internalDriveId.value+'/' : 'http://127.0.0.1:8000/unidades/',
            method: $internalDriveId.value ? 'PUT' : 'POST',
            token: localStorage.getItem('Token'),
            body,
            action: internalDriveId ? 'postInternalDrive' : 'putInternalDrive'
        })

        if (response) {
            $('#myModal').modal('show');
            $('#myModal').on('hidden.bs.modal', function () {
                location.replace("./unidades.html");
            });
        }
        loadInternalDrivesList()
    }
})
const user = localStorage.getItem('username');
const div = d.getElementById('alerta');
if (user === 'admin'){
    div.style.display = 'block';
}