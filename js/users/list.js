import { apiRequest } from '../module.js'

const d = document;
const okBtn = d.getElementById("ok");
let users;

//DOM Content
const $userId = d.querySelector('#userId')
const $username = d.querySelector('#username')
const $password = d.querySelector('#password')
const $rut = d.querySelector('#rut')
const $nombre = d.querySelector('#nombre')
const $apellido = d.querySelector('#apellido')
const $email = d.querySelector('#email')
const $telefono = d.querySelector('#telefono')
const $direccion = d.querySelector('#direccion')
const $region = d.querySelector('#region')
const $rol = d.querySelector('#rol')
const $is_active = d.querySelector('#is_active')
const $btnSubmit = d.querySelector('#btnSubmit')

//Functions
function limpiarTodo (){
    $userId.value = ''
    $username.value = ''
    $password.value = ''
    $rut.value = ''
    $nombre.value = ''
    $apellido.value = ''
    $email.value = ''
    $telefono.value = ''
    $region.value = ''
    $direccion.value = ''
    $rol.value = ''
    $is_active.checked = true
    $btnSubmit.textContent = "Aceptar"
}

function loadUserList(){
    const $tbody = d.querySelector('tbody')
    $tbody.innerHTML = ""
    const $template = d.querySelector('#userTemplate')
    const $fragment = new DocumentFragment()
    users.forEach(user => {
        const $clone = $template.content.cloneNode(true)
        const $tr = $clone.querySelector('tr')
        const $td = $tr.querySelectorAll('td')
        const $button = d.createElement('button')
        
        $button.textContent = "EDITAR"
				$button.name = "editarUsuario"
				$button.className = "btn btn-secondary";

        $button.setAttribute("data-user-id",user.id)

        $td[0].textContent = user.username
        $td[1].textContent = user.email
        $td[2].insertAdjacentElement('beforeend',$button)

        $fragment.append($tr)
    }); 

    $tbody.append($fragment)
}
d.addEventListener('DOMContentLoaded', async (event) => {
    const $fragment = new DocumentFragment()
    const token = localStorage.getItem('Token')
    
    const response = await apiRequest({
        url: 'http://127.0.0.1:8000/usuarios/',
        method: "GET",
        token,
        action: "get users"
    });
    
    users = response.results
    
    await loadUserList()

    const roles = await apiRequest({
        url: 'http://127.0.0.1:8000/roles/',
        method: "GET",
        token,
        action: "get roles"
    });

    $fragment.innerHTML = '';
    roles.results.forEach(rol => {
        const $option = d.createElement('option')
        $option.value = rol.id
        $option.textContent = rol.name
        $fragment.append($option)
    })

    $rol.append($fragment)
})

d.addEventListener('click', event => {
    const target = event.target;
    if(target.name == 'editarUsuario' || target.name == 'cancelar'){

        if (target.dataset.userId){
            const id = target.dataset.userId
            let userFound;
            $btnSubmit.textContent = "Editar"

            users.forEach(user =>{
                if (user.id == id){
                    userFound = user
                }
            })
            if (userFound){
                console.log(userFound)
                $userId.value = userFound.id || ''
                $username.value = userFound.username || ''
                $rut.value = userFound.rut || ''
                $nombre.value = userFound.nombre || ''
                $apellido.value = userFound.apellido || ''
                $email.value = userFound.email || ''
                $telefono.value = userFound.telefono || ''
                $direccion.value = userFound.direccion || ''
                $region.value = userFound.region || ''
                $rol.value = userFound.rol_usuario || ''
                $is_active.checked = userFound.is_active
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
    if (target.id == "userForm"){
        const body = {
            username: $username.value,
            rut: $rut.value,
            nombre: $nombre.value,
            apellido: $apellido.value,
            email: $email.value,
            telefono: $telefono.value,
            password: $password.value,
            direccion: $direccion.value,
            region: $region.value,
            rol_usuario: $rol.value,
            is_active: $is_active.checked
        }
        const response = await apiRequest({
            url: $userId.value ? 'http://127.0.0.1:8000/usuarios/'+$userId.value+'/' : 'http://127.0.0.1:8000/usuarios/',
            method: $userId.value ? 'PUT' : 'POST',
            token: localStorage.getItem('Token'),
            body,
						action: 'postUser'
				})
				
            if (response) {
                $('#myModal').modal('show');
                $('#myModal').on('hidden.bs.modal', function () {
                    location.replace("./list.html");
                });
              }
        if (users.find((user) => user.id == response.id)){
            users[users.findIndex(user => user.id == response.id)] = response
            loadUserList()
        }
    }
})
const user = localStorage.getItem('username');
const div = d.getElementById('alerta');
if (user === 'admin'){
    div.style.display = 'block'
}