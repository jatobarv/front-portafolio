import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;
const okBtn = d.getElementById("ok");

async function tareas(nombre, descripcion) {
    const response = await apiRequest({
        url: "http://127.0.0.1:8000/tareas/",
        method: "POST",
        token: token,
        body: {
            nombre,
            descripcion,
        },
        action: "post tareas",
    });
    localStorage.setItem("Token", token);

    if (response) {
        okBtn.onclick = function () {
          location.replace("./tareas.html");
        };
    } else {
        alert("Datos incorrectos");
    }
}

d.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = event.target;

    if (target.id === "tareas") {
        tareas(target.nombre.value, target.descripcion.value);
    }
});
