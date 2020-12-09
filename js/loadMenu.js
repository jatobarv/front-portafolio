import { 
    getPerm, 
    logout 
} from './module.js'

const d = document;

const menus = [  //ARREGLO DE LOS MENUS QUE VAS A CARGAR
    // OBJETO CON LABEL (LO QUE SE MOSTRARA EN EL MENU) URL (DIRECCION DEL HTML)  PERM (EL USUARIO QUE LOS PUEDE VER)
    // {label: 'Mantenedores', id:'navMantenedores', url: '#', perms:[0]},
    // {label: 'Cuenta', id:'navCuenta', url: '#', perms:[0]},
    {label: 'Roles', id:'navAddRoles', url: '/templates/roles/addRoles.html', perms:['Administrador',]},
    {label: 'Usuarios', id:'navUsuario', url: '/templates/users/list.html', perms:['Administrador',]},
    {label: 'Empresas', id:'navUsuario', url: '/templates/empresas/empresas.html', perms:['Administrador',]},
    {label: 'Unidades', id:'navUnidades', url: '/templates/unidades/unidades.html', perms:['Administrador',]},
    {label: 'Tareas', id: 'navTareas',url: '/templates/tareas/tareas.html', perms:['Administrador',  'Diseñador',]},
    {label: 'Funciones', id:'navFunciones', url: '/templates/funciones/funciones.html', perms:['Administrador',]},
    {label: 'Asignar Tareas', id: 'navAsignarTarea',url: '/templates/tareas/asignarTareas.html', perms:['Administrador', 'Diseñador',]},
    {label: 'Flujos', id:'navFlujos', url: '/templates/flujos/flujos.html', perms:['Todos',]},
    {label: 'Cerrar Sesion', id: 'navLogout',url: '/index.html', perms:['Todos',]}
]


d.addEventListener('DOMContentLoaded', async (event) => {
    (async function loadMenu(){
        const $fragment = new DocumentFragment() //FRAGMENTO DE HTML PARA AGREGARLE PARAMETROS ANTES DE INSERTARLO TODO EN EL HTML
        const $nav = d.querySelector('#nav');   //DIV CON ID NAV PARA INTERSAR LOS MENUS
        const $ul = d.createElement('ul');  //UL PARA AGREGAR LA LISTA
        const $a = document.createElement('a');
        const $img = document.createElement('img');
        const $div = d.getElementById('navbar');
        $img.src = "/templates/ico.png"
        $img.width = 116;
        $img.height = 64;
        // $img.className = 'd-inline-block align-top'
        $a.appendChild($img)
        $nav.style = 'flex-wrap: nowrap; justify-content: flex-start;'
        
        
        const userPerm = await getPerm();

        localStorage.setItem("rol", userPerm);
        let menuLoadedCount = 0;
        menus.forEach(menu => {

            if (window.location.href.includes(menu.url) && !menu.perms.includes('Todos') && !menu.perms.includes(userPerm)) location.replace(window.location.origin + '/templates/error.html')
            
            if(menu.perms.includes(userPerm) || menu.perms.includes('Todos') && userPerm != -1){
                menu.perms.includes(userPerm)
                const $li = document.createElement('li')
                const $a = document.createElement('a')

                $a.href = window.location.origin+menu.url
                $a.innerText = menu.label
                $a.classList.add('nav-link')
                $a.style = "color: #000"

                if(menu.id === 'navLogout') $a.onclick = navLogout

                $li.insertAdjacentElement('beforeend',$a)
                $li.classList.add('nav-item')

                $ul.insertAdjacentElement('beforeend',$li)
                menuLoadedCount++;
            }
        });


        if (!menuLoadedCount) location.replace(window.location.origin+'/templates/error.html')

        // $ul.classList.add('nav','justify-content-center')
        $ul.className = "navbar-nav mr-auto"
        $ul.style = "margin: auto;"
        $div.insertAdjacentElement('afterbegin', $a)
        $fragment.append($ul)

        $nav.append($fragment)

    })();

    async function navLogout(){
        await logout();
    }
})