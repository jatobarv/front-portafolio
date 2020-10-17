import { apiRequest } from '../module.js'
const d = document;
let users;


d.addEventListener('DOMContentLoaded', async (event) => {
    const $tbody = d.querySelector('tbody')
    const $fragment = new DocumentFragment()
    const token = localStorage.getItem('Token')
    const $rol = d.querySelector('#rol')

    const response = await apiRequest({
        url: 'http://127.0.0.1:8000/usuarios/',
        method: "GET",
        token,
        action: "get users"
    });
    
    users = response.results
    
    const $template = d.querySelector('#userTemplate')
    
    users.forEach(user => {
        const $clone = $template.content.cloneNode(true)
        const $tr = $clone.querySelector('tr')
        const $td = $tr.querySelectorAll('td')
        const $button = d.createElement('button')
        
        $button.textContent = "EDITAR"
        $button.name = "editarUsuario"
        $button.classList.add("btn", "btn-info");
        $button.setAttribute("data-toggle","modal")
        $button.setAttribute("data-target","#exampleModal")
        $button.setAttribute("data-user-id",user.id)

        $td[0].textContent = user.username
        $td[1].textContent = user.email
        $td[2].insertAdjacentElement('beforeend',$button)

        $fragment.append($tr)
    }); 

    $tbody.append($fragment)

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

    if(target.name == 'editarUsuario' || target.name == 'crearUsuario' ){
        d.querySelector('#userHeader').textContent = target.dataset.userId ? "EDITAR USUARIO" : "CREAR USUARIO"

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

        if (target.dataset.userId){
            const id = target.dataset.userId
            let userFound;
    
            users.forEach(user =>{
                if (user.id == id){
                    userFound = user
                }
            })
            if (userFound){
                console.log(userFound)
                $username.value = userFound.username || ''
                $rut.value = userFound.rut || ''
                $nombre.value = userFound.nombre || ''
                $apellido.value = userFound.apellido || ''
                $email.value = userFound.email || ''
                $telefono.value = userFound.telefono || ''
                $region.value = userFound.region || ''
                $rol.value = userFound.rol_usuario || ''
                $is_active.checked = userFound.is_active
            }
        }
    }
})

d.addEventListener('submit', async (event) => {
    const target = event.target;

    if (target.name == "crearUsuario"){
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

        $username.value = userFound.username
        $rut.value
        $nombre.value
        $apellido.value
        $email.value
        $telefono.value
        $region.value
        $rol.value
        $is_active.checked = true
    }
})