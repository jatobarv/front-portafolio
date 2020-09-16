function register() {
    let username = document.getElementById('username').value;
    let rut = document.getElementById('rut').value;
    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let email = document.getElementById('email').value;
    let telefono = document.getElementById('telefono').value;
    let direccion = document.getElementById('direccion').value;
    let region = document.getElementById('region').value;
    let password = document.getElementById('password').value;
    let rol_usuario = document.getElementById('rol').value;

    axios({
        method: 'post',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem("TOKEN"),
            'Content-type': 'application/json'
        },
        url: 'http://127.0.0.1:8000/usuarios/',
        data: {
            username: username,
            rut: rut,
            nombre: nombre,
            apellido: apellido,
            email: email,
            telefono: telefono,
            direccion: direccion,
            region: region,
            rol_usuario: rol_usuario,
            password: password,
            is_active: true
        }

    }).then(() => {
        window.location.href = '/'
    });

}