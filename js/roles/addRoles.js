import { apiRequest } from "../module.js";

const d = document;

const token = localStorage.getItem("Token");

var nPermisos;
var nPags;
var permisos = [];

function getPermisos() {
    const promise = axios.get(`http://127.0.0.1:8000/permisos/`, {
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

getPermisos()
    .then((data) => {
        nPermisos = data.count;
        nPags = Math.round(nPermisos / 10);
        if (nPags === 0) {
            nPags = 1;
        }
        for (let i = 1; i <= nPags; i++) {
            axios
                .get(`http://127.0.0.1:8000/permisos/?page=${i}`, {
                    headers: {
                        Authorization: "Token " + token,
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    permisos = res.data.results;
                    console.log(permisos);

                    for (const permiso of permisos) {
                        var sel = document.getElementById("select-permisos");

                        var opt = document.createElement("option");

                        opt.id = "permiso_" + permiso.codename;

                        opt.appendChild(document.createTextNode(permiso.name));

                        opt.value = permiso.id;

                        sel.appendChild(opt);
                    }
                });
        }
    })
    .catch((err) => console.log(err));

async function addRol(name, permissions) {
    const response = await apiRequest({
        url: "http://127.0.0.1:8000/roles/",
        method: "POST",
        token: token,
        body: {
            name,
            permissions,
        },
        action: "post roles",
    });
    console.log(response);

    localStorage.setItem("Token", token);

    location.replace("./addRoles.html");
}

d.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = event.target;

    var selected = [];
    for (var option of document.getElementById("select-permisos-elegidos")
        .options) {
        selected.push(option.value);
    }
    if (target.id === "roles-form") {
        addRol(target.rolName.value, selected);
    }
});
