import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

let emps;

const d = document;
const okBtn = d.getElementById("ok");


//DOM Content
const $empId = d.querySelector('#empId')
const $rut = d.querySelector('#rut')
const $nombre = d.querySelector('#nombre')
const $email = d.querySelector('#email')
const $telefono = d.querySelector('#telefono')
const $direccion = d.querySelector('#direccion')
const $region = d.querySelector('#region')
const $btnSubmit = d.querySelector('#btnSubmit')

//Functions
function limpiarTodo (){
    $empId.value = ''
    $rut.value = ''
    $nombre.value = ''
    $email.value = ''
    $telefono.value = ''
    $region.value = ''
    $direccion.value = ''
    $btnSubmit.textContent = "Aceptar"
}

const user = localStorage.getItem('username');
const div = d.getElementById('alerta');
if (user === 'admin'){
    div.style.display = 'block'
}

function loadEmpresasList(){
    const $tbody = d.querySelector('tbody')
    $tbody.innerHTML = ""
    const $template = d.querySelector('#userTemplate')
    const $fragment = new DocumentFragment()
    emps.forEach(emp => {
        const $clone = $template.content.cloneNode(true)
        const $tr = $clone.querySelector('tr')
        const $td = $tr.querySelectorAll('td')
        const $button = d.createElement('button')
        
        $button.textContent = "EDITAR"
				$button.name = "editarEmpresa"
				$button.className = "btn btn-secondary";

        $button.setAttribute("data-emp-id",emp.id)

        $td[0].textContent = emp.rut
        $td[1].textContent = emp.nombre
        $td[2].insertAdjacentElement('beforeend',$button)

        $fragment.append($tr)
    }); 

    $tbody.append($fragment)
}

d.addEventListener('DOMContentLoaded', async (event) => {
    const $fragment = new DocumentFragment()
    const token = localStorage.getItem('Token')
    
    const response = await apiRequest({
        url: 'http://127.0.0.1:8000/empresas/',
        method: "GET",
        token,
        action: "get empresas"
    });
    
    emps = response.results
    
    await loadEmpresasList()
})


d.addEventListener('click', event => {
    const target = event.target;
    if(target.name == 'editarEmpresa' || target.name == 'cancelar'){

        if (target.dataset.empId){
            const id = target.dataset.empId
            let empFound;
            $btnSubmit.textContent = "Editar"

            emps.forEach(emp =>{
                if (emp.id == id){
                    empFound = emp
                }
            })
            if (empFound){
                console.log(empFound)
                $empId.value = empFound.id || ''
                $rut.value = empFound.rut || ''
                $nombre.value = empFound.nombre || ''
                $email.value = empFound.email || ''
                $telefono.value = empFound.telefono || ''
                $direccion.value = empFound.direccion || ''
                $region.value = empFound.region || ''
            }
        }

        if(target.name == 'cancelar'){
            limpiarTodo()
        }
    }
})

d.addEventListener('submit', async (event) => {
    event.preventDefault()
    const target = event.target;
    console.log(target)
    if (target.id == "empForm"){
        const body = {
            rut: $rut.value,
            nombre: $nombre.value,
            email: $email.value,
            telefono: $telefono.value,
            direccion: $direccion.value,
            region: $region.value,
        }
        const response = await apiRequest({
            url: $empId.value ? 'http://127.0.0.1:8000/empresas/'+$empId.value+'/' : 'http://127.0.0.1:8000/empresas/',
            method: $empId.value ? 'PUT' : 'POST',
            token: localStorage.getItem('Token'),
            body,
						action: 'postEmp'
				})
				
            if (response) {
                okBtn.onclick = function () {
                  location.replace("./empresas.html");
                };
              }
        if (emps.find((emp) => emp.id == response.id)){
            emps[emps.findIndex(emp => emp.id == response.id)] = response
            loadUserList()
        }
    }
})