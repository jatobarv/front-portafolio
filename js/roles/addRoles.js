import { apiRequest } from "../module.js";

const d = document;
const okBtn = d.getElementById("ok");

const token = localStorage.getItem("Token");

var nPermisos;
var nPags;
var permisos = [];
let roles;
let permissions;
let selected = [];

const $rolId = d.querySelector('#rolId');
const $rolName = d.querySelector('#rolName');
const $btnSubmit = d.querySelector('#confirmar')

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


async function getRoles () {
  const promise = await apiRequest({
    url: "http://127.0.0.1:8000/roles/",
    method: "GET",
    token,
    action: 'get roles'
  });

  return Object.values(promise)
}

// window.onbeforeunload = function() {
//     return false;
// };

getPermisos()
  .then((data) => {
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
    location.reload();
  });
  }
}

d.addEventListener("submit", async (event) => {
  if (!$rolId.value){
    event.preventDefault();
    const target = event.target;

    for (var option of document.getElementById("select-permisos-elegidos")
      .options) {
      selected.push(option.value);
    }
    if (target.id === "roles-form") {
      addRol(target.rolName.value, selected);
    }
  }else{
    try {
      await apiRequest({
        url: "http://127.0.0.1:8000/roles/"+$rolId.value+'/',
        method: "PUT",
        token,
        body: {
          name: $rolName.value,
          permissions: selected
        },
        action: "put rol",
      });
      location.reload();
    } catch (error) {
      alert("Datos incorrectos");
    }
  }
});

d.addEventListener("DOMContentLoaded", async () => {
  const $tbody = d.querySelector('tbody')
  $tbody.innerHTML = ""
  const $template = d.querySelector('#rolTemplate')
  const $fragment = new DocumentFragment()
  try {
    roles = await getRoles();
    
    roles.forEach(rol => {
      const $clone = $template.content.cloneNode(true)
      const $tr = $clone.querySelector('tr')
      const $td = $tr.querySelectorAll('td')
      const $button = d.createElement('button')

      $button.textContent = "EDITAR"
      $button.name = "editarRol"
      $button.className = "btn btn-secondary"
      $button.setAttribute("data-rol-id",rol.id)
      $td[0].textContent = rol.id;
      $td[1].textContent = rol.name;
      $td[2].insertAdjacentElement('beforeend',$button);
      selected = rol.permissions

      $fragment.append($tr)
    });

    $tbody.append($fragment)
  } catch (error) {
    console.log(error)
  }
})

d.addEventListener('click', event => {
  const target = event.target;

  if (target.getAttribute("name") == "editarRol"){
    const rol = roles.find(rol => rol.id == target.dataset.rolId)
    if (rol){
      $rolId.value = rol.id
      $rolName.value = rol.name
      $btnSubmit.textContent = "EDITAR"
    }
  }
})