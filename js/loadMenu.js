import { 
    getPerm, 
    logout 
} from './module.js'

const d = document;

const menus = [  //ARREGLO DE LOS MENUS QUE VAS A CARGAR
    {label: 'Inicio', id: 'navInicio', url: 'http://127.0.0.1:5500/templates/principal.html', perms:[0]}, // OBJETO CON LABEL (LO QUE SE MOSTRARA EN EL MENU) URL (DIRECCION DEL HTML)  PERM (EL USUARIO QUE LOS PUEDE VER)
    {label: 'Usuarios', id:'navUsuario', url: 'http://127.0.0.1:5500/templates/users/list.html', perms:[1]},
    {label: 'Mantenedores', id:'navMantenedores', url: '#', perms:[1]},
    {label: 'Cuenta', id:'navCuenta', url: '#', perms:[1]},
    {label: 'Cerrer Sesion', id: 'navLogout',url: '#', perms:[0]}
]


d.addEventListener('DOMContentLoaded', (event) => {
    (async function loadMenu(){
        const $fragment = new DocumentFragment() //FRAGMENTO DE HTML PARA AGREGARLE PARAMETROS ANTES DE INSERTARLO TODO EN EL HTML
        const $nav = d.querySelector('#nav');   //DIV CON ID NAV PARA INTERSAR LOS MENUS
        const $ul = d.createElement('ul');  //UL PARA AGREGAR LA LISTA

        
        
        const userPerm = await getPerm();

        let menuLoadedCount = 0;
        menus.forEach(menu => {
            if(menu.perms.includes(userPerm) || menu.perms.includes(0) && userPerm != -1){
                menu.perms.includes(userPerm)
                const $li = document.createElement('li')
                const $a = document.createElement('a')

                $a.href = menu.url
                $a.innerText = menu.label
                $a.classList.add('nav-link')
                
                if(menu.id === 'navLogout') $a.onclick = navLogout

                $li.insertAdjacentElement('beforeend',$a)
                $li.classList.add('nav-item')

                $ul.insertAdjacentElement('beforeend',$li)
                menuLoadedCount++;
            }
        });


        if (!menuLoadedCount) location.replace('./error.html')

        $ul.classList.add('nav','justify-content-center')
        $fragment.append($ul)

        $nav.append($fragment)

    })();

    async function navLogout(){
        await logout();
    }

})