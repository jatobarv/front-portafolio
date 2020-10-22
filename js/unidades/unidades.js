import { apiRequest } from "../module.js";
const token = localStorage.getItem("Token");

const d = document;

var nEmpresas;
var nPags;
var empresas = [];

function getEmpresas() {
    const promise = axios.get(`http://127.0.0.1:8000/empresas/`, {
        headers: {
            Authorization: "Token " + token,
            "Content-Type": "application/json",
        },
    });

    const dataPromise = promise.then((response) => response.data);

    return dataPromise;
}

// window.onbeforeunload = function() {
//     return false;
// };

getEmpresas()
    .then((data) => {
        nEmpresas = data.count;
        nPags = Math.round(nEmpresas / 10);
        if (nPags === 0) {
            nPags = 1;
        }
        for (let i = 1; i <= nPags; i++) {
            axios
                .get(`http://127.0.0.1:8000/empresas/?page=${i}`, {
                    headers: {
                        Authorization: "Token " + token,
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    empresas = res.data.results;
                    console.log(empresas);

                    for (const empresa of empresas) {
                        var sel = document.getElementById("select-empresas");
                        var opt = document.createElement("option");
                        opt.text = empresa.nombre;
                        opt.value = empresa.id;
                        sel.appendChild(opt);
                    }
                });
        }
    })
    .catch((err) => console.log(err));

async function unidades(nombre, descripcion, empresa) {
    const response = await apiRequest({
        url: "http://127.0.0.1:8000/unidades/",
        method: "POST",
        token: token,
        body: {
            nombre,
            descripcion,
            empresa,
        },
        action: "post unidades",
    });
    localStorage.setItem("Token", token);

    if (response) {
        localStorage.setItem("Token", response.token);
        // location.replace("./principal.html");
    } else {
        alert("Datos incorrectos");
    }
}

d.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = event.target;

    var selEmpresa = document.getElementById("select-empresas");
    if (target.id === "unidades") {
        unidades(
            target.nombre.value,
            target.descripcion.value,
            selEmpresa.value
        );
    }
});
