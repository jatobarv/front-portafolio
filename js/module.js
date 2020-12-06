const d = document;

async function apiRequest(params){
    const {url, method ,token, body, action} = params;

    const validations = () => {
        if (!action || !url || !method) return false
    
        switch (method) {
            case 'POST':
            case 'GET':
            case 'PUT':
            case 'DELETE':
                if (method === 'POST' || method === 'PUT'){
                    if (!body) return false;
                }
                break;
            default:
                return false
        }
        
        return true;
    }

    if(!validations()) throw ('params error');

    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? 'Token '+token : null
        },
        method,
        body: body ? JSON.stringify(body) : null
    }

    try {
        
        const response = await fetch(url, options)

        const json = response.json();

        if (!response.ok) throw new Error(action)

        return json

    } catch (error) {
        errorController(action)
    }
}

function errorController(action){
    switch (action) {
        case 'params error':
            console.log('Los parametros enviados son invalidos');
            break;
        case 'post login':
            console.log('Usuario y/o Contraseña Invadilos');
            break;
        case 'post token':
            console.log('Usuario y/o Contraseña Invadilos');
            break;
        default:
            console.warn('La Action no se encuentra registrada o es inválida por lo que no se puede mostrar un error personalizado')
            break;
    }
}

async function getPerm(permNumber){
    const token = localStorage.getItem('Token')
    
    let response = await apiRequest({
        url: 'http://127.0.0.1:8000/'+token,
        method: 'GET',
        action: 'get token'
    })
    
    if (!response.length) return -1
    
    const user_id = response[0].user_id
    localStorage.setItem('user_id', user_id)

    response = await apiRequest({
        url: 'http://127.0.0.1:8000/usuarios/'+user_id,
        method: 'GET',
        action: 'get perm',
        token
    })

    if (!response.is_superuser){
        response = await apiRequest({
            url: 'http://127.0.0.1:8000/roles/'+response.rol_usuario,
            method: 'GET',
            action: 'get perm',
            token
        })
    }else{
        response = {
            name: 'Dueño'
        }
    }

    return response.name
}

async function logout(){
    const token = localStorage.getItem('Token');
    const response = await apiRequest({
        url: 'http://127.0.0.1:8000/logout/'+token,
        method: 'GET',
        action: 'get logout',
        token
    })

    if (response || localStorage.getItem('Token')){
        localStorage.removeItem('Token')

        location.replace('/index.html')
    }
}

export {
    apiRequest,
    getPerm,
    logout
}