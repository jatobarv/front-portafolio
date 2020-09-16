document.getElementById("mensaje").innerHTML = "<h2>'" + localStorage.getItem("username") + "' Ha iniciado sesión </h2>";

let id_rol;

document.addEventListener("DOMContentLoaded", event => {
    axios({
        method: 'get',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem("TOKEN"),
            'Content-type': 'application/json'
        },
        url: 'http://127.0.0.1:8000/' + localStorage.getItem("TOKEN"),
    }).then((res) => {
        console.log(res)
        let id = res.data[0].user_id;
        console.log(id)
        axios({
            method: 'get',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("TOKEN"),
            },
            url: 'http://127.0.0.1:8000/usuarios/' + id,
        }).then(res => {
            id_rol = res.data.rol_usuario
        }).then(() => {
            if (id_rol === 2) {
                document.getElementById("rol").innerHTML = "<h2> Rol: Funcionario</h2>";
            }
            if (id_rol === 1) {
                document.getElementById("rol").innerHTML = `
                <a style="display: flex; font: 20px sans-serif; justify-content: center; padding-top: 30px; color: blue;"
                        href="./register.html">Registra un usuario</a>
                <h2> Rol: admin</h2>`;
            }
        })

        // window.location.href = '/'
    });
})