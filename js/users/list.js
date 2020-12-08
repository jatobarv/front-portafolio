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
    Object.values(users).forEach(user => {
        const $clone = $template.content.cloneNode(true)
        const $tr = $clone.querySelector('tr')
        const $td = $tr.querySelectorAll('td')
        const $button = d.createElement('button')
        
        $button.textContent = "EDITAR"
				$button.name = "editarUsuario"
				$button.className = "btn btn-secondary";

        $button.setAttribute("data-user-id",user["ID"])

        $td[0].textContent = user["USERNAME"]
        $td[1].textContent = user["EMAIL"]
        $td[2].insertAdjacentElement('beforeend',$button)

        $fragment.append($tr)
    }); 

    $tbody.append($fragment)
}
d.addEventListener('DOMContentLoaded', async (event) => {
    const $fragment = new DocumentFragment()
    const token = localStorage.getItem('Token')
    
    const response = await apiRequest({
        url: '/usuarios',
        method: "GET",
        token,
        action: "get users"
    });
    
    users = response
    
    await loadUserList()

    const roles = await apiRequest({
        url: '/roles',
        method: "GET",
        token,
        action: "get roles"
    });

    $fragment.innerHTML = '';
    Object.values(roles).forEach(rol => {
        const $option = d.createElement('option')
        $option.value = rol["ID"]
        $option.textContent = rol["NOMBRE"]
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

            Object.values(users).forEach(user =>{
                if (user["ID"] == id){
                    userFound = user
                }
            })
            if (userFound){
                console.log(userFound)
                $userId.value = userFound["ID"] || ''
                $username.value = userFound["USERNAME"] || ''
                $rut.value = userFound["RUT"] || ''
                $nombre.value = userFound["NOMBRE"] || ''
                $apellido.value = userFound["APELLIDO"] || ''
                $email.value = userFound["EMAIL"] || ''
                $telefono.value = userFound["TELEFONO"] || ''
                $direccion.value = userFound["DIRECCION"] || ''
                $region.value = userFound["REGION"] || ''
                $rol.value = userFound["ID_ROL_USUARIO"] || ''
                $is_active.checked = userFound["ACTIVO"]
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
            rut: $rut.value,
            username: $username.value,
            password: $password.value,
            nombre: $nombre.value,
            apellido: $apellido.value,
            email: $email.value,
            telefono: $telefono.value,
            direccion: $direccion.value,
            region: $region.value,
            activo: $is_active.checked ? 1 : 0,
            id_rol_usuario: $rol.value
        }

        console.log(body)
        const response = await apiRequest({
            url: $userId.value ? '/usuarios/'+$userId.value+'/' : '/usuarios',
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