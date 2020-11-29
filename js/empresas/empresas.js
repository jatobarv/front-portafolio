import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;

async function empresas(rut, nombre, telefono, email, direccion, region) {
    const response = await apiRequest({
        url: "http://127.0.0.1:8000/empresas/",
        method: "POST",
        token: token,
        body: {
            rut,
            nombre,
            telefono,
            email,
            direccion,
            region,
        },
        action: "post empresas",
    });
    localStorage.setItem("Token", token);

    if (response) {
        // localStorage.setItem("Token", response.token);
        location.replace("./empresas.html");
    } else {
        alert("Datos incorrectos");
    }
}

d.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = event.target;

    if (target.id === "empresas") {
        empresas(
            target.rut.value,
            target.nombre.value,
            target.telefono.value,
            target.email.value,
            target.direccion.value,
            target.region.value
        );
    }
});
const user = localStorage.getItem('username');
const div = d.getElementById('alerta');
if (user === 'admin'){
    div.style.display = 'block'
}