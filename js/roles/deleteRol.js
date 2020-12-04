const token = localStorage.getItem("Token");

const d = document;
const deleteBtn = d.getElementById("borrar");

function getPermisos() {
  const promise = axios.get(`http://127.0.0.1:8000/roles/`, {
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

getPermisos().then((data) => {
  for (const permiso of data.results) {
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
    ckbox.id = permiso.id;
    label.className = "custom-control-label";
    label.setAttribute("for", permiso.id);
    label.appendChild(document.createTextNode(permiso.id));
    tdName.appendChild(document.createTextNode(permiso.name));

    div.appendChild(ckbox);
    div.appendChild(label);
    td.appendChild(div);
    tr.appendChild(td);
    tr.appendChild(tdName);
    sel.appendChild(tr);
  }
});

async function deleteRol(id) {
  const promise = axios.delete(`http://127.0.0.1:8000/roles/${id}/`, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });

  const dataPromise = promise.then((response) => response.data);

  localStorage.setItem("Token", token);

  location.replace("./deleteRol.html");
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
      if (target.id === "roles-form-delete") {
        deleteBtn.onclick = function () {
          deleteRol(checkedValue);
        };
      }
    }
  }
});
