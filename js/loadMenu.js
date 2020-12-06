import { 
    getPerm, 
    logout 
} from './module.js'

const d = document;

const menus = [  //ARREGLO DE LOS MENUS QUE VAS A CARGAR
    {label: 'Inicio', id: 'navInicio', url: '/templates/principal.html', perms:['Todos']}, // OBJETO CON LABEL (LO QUE SE MOSTRARA EN EL MENU) URL (DIRECCION DEL HTML)  PERM (EL USUARIO QUE LOS PUEDE VER)
    // {label: 'Mantenedores', id:'navMantenedores', url: '#', perms:[0]},
    // {label: 'Cuenta', id:'navCuenta', url: '#', perms:[0]},
    {label: 'Roles', id:'navAddRoles', url: '/templates/roles/addRoles.html', perms:'can_get_rol_usuario'},
    {label: 'Usuarios', id:'navUsuario', url: '/templates/users/list.html', perms:'can_get_usuario'},
    {label: 'Empresas', id:'navUsuario', url: '/templates/empresas/empresas.html', perms:'can_get_empresa'},
    {label: 'Unidades', id:'navUnidades', url: '/templates/unidades/unidades.html', perms:'can_get_unidad'},
    {label: 'Tareas', id: 'navTareas',url: '/templates/tareas/tareas.html', perms:'can_get_tarea'},
    {label: 'Funciones', id:'navFunciones', url: '/templates/funciones/funciones.html', perms:'can_get_funcion'},
    {label: 'Asignar Tareas', id: 'navAsignarTarea',url: '/templates/tareas/asignarTareas.html', perms:'can_get_asignar_tarea'},
    {label: 'Flujos', id:'navFlujos', url: '/templates/flujos/flujos.html', perms:'can_get_flujo'},
    {label: 'Cerrar Sesion', id: 'navLogout',url: '/index.html', perms:'Todos'}
]


d.addEventListener('DOMContentLoaded', (event) => {
    (async function loadMenu(){
        const $fragment = new DocumentFragment() //FRAGMENTO DE HTML PARA AGREGARLE PARAMETROS ANTES DE INSERTARLO TODO EN EL HTML
        const $nav = d.querySelector('#nav');   //DIV CON ID NAV PARA INTERSAR LOS MENUS
        const $ul = d.createElement('ul');  //UL PARA AGREGAR LA LISTA

        
        
        const userPerm = await getPerm();
        let menuLoadedCount = 0;
        menus.forEach(menu => {
            if (!userPerm.admin){
                if (window.location.href.includes(menu.url) && !userPerm.includes(menu.perms) && menu.perms != "Todos" ) location.replace(window.location.origin + '/templates/error.html')
            }

            if(userPerm.admin || userPerm.includes(menu.perms) || menu.perms.includes('Todos') && userPerm != -1){
                menu.perms.includes(userPerm)
                const $li = document.createElement('li')
                const $a = document.createElement('a')

                $a.href = window.location.origin+menu.url
                $a.innerText = menu.label
                $a.classList.add('nav-link')
                $a.style = "color: #fff"
                
                if(menu.id === 'navLogout') $a.onclick = navLogout

                $li.insertAdjacentElement('beforeend',$a)
                $li.classList.add('nav-item')

                $ul.insertAdjacentElement('beforeend',$li)
                menuLoadedCount++;
            }
        });


        if (!menuLoadedCount) location.replace(window.location.origin+'/templates/error.html')

        $ul.classList.add('nav','justify-content-center')
        $fragment.append($ul)

        $nav.append($fragment)

    })();

    async function navLogout(){
        await logout();
    }
})