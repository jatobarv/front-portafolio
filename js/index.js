import { apiRequest, getPerm } from './module.js'

const d = document;

d.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('Token');

    const perm = await getPerm();

    if (perm != -1){
        location.replace('./principal.html')
    }else{
        localStorage.removeItem('Token')
    }
})

async function login(username, password){
    const response = await apiRequest({
        url: 'http://127.0.0.1:8000/login/',
        method: 'POST',
        body: {
            username,
            password
        },
        action: 'post login'
    })

    localStorage.setItem('Token', response.token)

    location.replace('./principal.html')
}

d.addEventListener('submit', event => {
    event.preventDefault();
    const target = event.target

    if (target.id === 'login'){
        login(target.username.value, target.password.value)
    }
    
})

