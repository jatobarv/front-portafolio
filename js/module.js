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
            'Authorization': token ? token : null
        },
        method,
        body: body ? JSON.stringify(body) : null
    }

    try {
        
        const response = await fetch('http://localhost:8000' + url, options)

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

async function getPerm(){
    const token = localStorage.getItem('Token')
    const perms = [];
    const response = await apiRequest({
        url: '/login',
        method: 'GET',
        action: 'get perm',
        token
    })

    Object.values(response).forEach(element => {
        perms.push(element["NOMBRE"])
    });

    console.log(perms)
    return perms
}

async function logout(){
    const token = localStorage.getItem('Token');
    const response = await apiRequest({
        url: '/logout/'+token,
        method: 'GET',
        action: 'get logout',
        token
    })

    if (response || localStorage.getItem('Token')){
        localStorage.removeItem('Token')

        location.replace(window.location.origin + '/index.html')
    }
}

export {
    apiRequest,
    getPerm,
    logout
}