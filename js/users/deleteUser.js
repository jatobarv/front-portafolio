const token = localStorage.getItem("Token");

const d = document;
const deleteBtn = d.getElementById("borrar");

function getUsuarios() {
  const promise = axios.get(`http://127.0.0.1:8000/usuarios/`, {
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

getUsuarios().then((data) => {
  for (const usuario of data.results) {
    console.log(usuario);
    var sel = document.getElementById("table-body");
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var div = document.createElement("div");
    var ckbox = document.createElement("INPUT");
    var label = document.createElement("label");
    var tdName = document.createElement("td");
    div.className = "custom-control custom-checkbox";
    ckbox.setAttribute("type", "checkbox");
    ckbox.className = "custom-control-input";
    ckbox.id = usuario.id;
    label.className = "custom-control-label";
    label.setAttribute("for", usuario.id);
    label.appendChild(document.createTextNode(usuario.id));
    tdName.appendChild(document.createTextNode(usuario.username));

    div.appendChild(ckbox);
    div.appendChild(label);
    td.appendChild(div);
    tr.appendChild(td);
    tr.appendChild(tdName);
    sel.appendChild(tr);
  }
});

async function deleteUser(id) {
  const promise = axios.delete(`http://127.0.0.1:8000/usuarios/${id}/`, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });

  const dataPromise = promise.then((response) => response.data);

  localStorage.setItem("Token", token);

  location.replace("./deleteUser.html");
  return dataPromise;
}

d.addEventListener("submit", (event) => {
  event.preventDefault();
  const target = event.target;
  var checkedValue = null;
  var inputElements = document.getElementsByClassName("custom-control-input");

  for (var i = 0; inputElements[i]; ++i) {
    if (inputElements[i].checked) {
      checkedValue = inputElements[i].id;
      console.log(inputElements[i].id);
      if (target.id === "users-form-delete") {
        deleteBtn.onclick = function () {
          deleteUser(checkedValue);
        };
      }
    }
  }
});
