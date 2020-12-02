import { apiRequest, getPerm } from './module.js'

const d = document;

d.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('Token');

    const perm = await getPerm();

    if (perm != -1){
        location.replace('./templates/principal.html')
    }else{
        localStorage.removeItem('Token')
    }
})

async function login(username, password){
    const response = await apiRequest({
        url: '/login',
        method: 'POST',
        body: {
            username,
            password
        },
        action: 'post login'
    })

    if (response) {
        localStorage.setItem('Token', response.token )
        localStorage.setItem('username', username )
        location.replace('./templates/principal.html')
    }else{
        alert('Usuario y/o Contraseña Inválidos')
    }
}

d.addEventListener('submit', event => {
    event.preventDefault();
    const target = event.target

    if (target.id === 'login'){
        login(target.username.value, target.password.value)
    }
    
})


