import { apiRequest, getPerm } from './module.js'

const d = document;

const token = localStorage.getItem("Token")
    
var nPermisos;
var nPags;
var permisos = [];

// axios({
//     method: 'GET',
//     url: 'http://127.0.0.1:8000/permisos/',
//     headers: {
//         'Authorization': 'Token ' + token,
//         'Content-Type': 'application/json'
//     }
//     })
//     .then(res => {
//         nPermisos = res.data.count;
//         nPags = Math.round(nPermisos / 10)

//         for (let i=1; i <= nPags; i++) {
//             let response = axios.get(`http://127.0.0.1:8000/permisos/?page=${i}`, {
//                 headers: {
//                     'Authorization': 'Token ' + token,
//                     'Content-Type': 'application/json'
//                 }
//             }).then(res => {
//                 data.push(res.data.results)
//                 console.log(data);
//             })}
//         });    
            
function getPermisos() {
    const promise = axios.get(`http://127.0.0.1:8000/permisos/`, {
        headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json'
        }})

    const dataPromise = promise.then((response) => response.data)

    return dataPromise
}

// window.onbeforeunload = function() {    
//     return false;
// };

getPermisos()
    .then(data => {
        nPermisos = data.count;
        nPags = Math.round(nPermisos / 10)
        for (let i=1; i <= nPags; i++) {
            axios.get(`http://127.0.0.1:8000/permisos/?page=${i}`, {
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                permisos = (res.data.results)
                console.log(permisos)

                for (const permiso of permisos) {
                    var sel = document.getElementById('select-permisos');
    
                    var opt = document.createElement('option');

                    opt.id = 'permiso_' + permiso.codename
    
                    opt.appendChild(document.createTextNode(permiso.name));
    
                    opt.value = permiso.id; 
    
                    sel.appendChild(opt);
                }
            })}
        })
    .catch(err => console.log(err))


// function addRol() {
//     const promise = axios.post(`http://127.0.0.1:8000/roles/`, {
//         headers: {
//             'Authorization': 'Token ' + token,
//             'Content-Type': 'application/json'
//         },
//         body: {
//             "name": 'caca',
//             "permissions": 1
//         }
//     })

//     const dataPromise = promise.then((response) => response.data)

//     return dataPromise
// }

async function addRol(name, permisos){
    axios({
        url: 'http://127.0.0.1:8000/roles/',
        method: 'POST',
        body: {
            name,
            permisos
        },
        action: 'post roles'
    })

    localStorage.setItem('Token', token)

    location.replace('./roles.html')
}

d.addEventListener('submit', event => {
    event.preventDefault();
    const target = event.target

    if (target.id === 'roles-form'){
        addRol(target.name.value, target.permisos.value)
    }
})