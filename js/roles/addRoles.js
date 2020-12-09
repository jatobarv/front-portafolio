import { apiRequest } from "../module.js";

const d = document;
const okBtn = d.getElementById("ok");

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
    console.log(data);


          data.sort((a, b) => a.codename > b.codename ? -1 : a.codename < b.codename ? 1 : 0).forEach(permiso => {
            var sel = document.getElementById("select-permisos");

            var opt = document.createElement("option");

            opt.id = "permiso_" + permiso.codename;

            opt.appendChild(document.createTextNode(permiso.name));

            opt.value = permiso.id;

            sel.appendChild(opt);

          })
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

  localStorage.setItem("Token", token);

  if (response) {
    $('#myModal').modal('show');
    $('#myModal').on('hidden.bs.modal', function () {
      location.replace("./addRoles.html");
  });
  }
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
