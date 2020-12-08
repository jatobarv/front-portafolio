const token = localStorage.getItem("Token");

const d = document;
const deleteBtn = d.getElementById("borrar");

function getUnidades() {
  const promise = axios.get(`http://127.0.0.1:8000/unidades/`, {
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

getUnidades().then((data) => {
  for (const unidad of data.results) {
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
    ckbox.id = unidad.id;
    label.className = "custom-control-label";
    label.setAttribute("for", unidad.id);
    label.appendChild(document.createTextNode(unidad.id));
    tdName.appendChild(document.createTextNode(unidad.nombre));

    div.appendChild(ckbox);
    div.appendChild(label);
    td.appendChild(div);
    tr.appendChild(td);
    tr.appendChild(tdName);
    sel.appendChild(tr);
  }
});

async function deleteUnidades(id) {
  const promise = axios.delete(`http://127.0.0.1:8000/unidades/${id}/`, {
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  });

  const dataPromise = promise.then((response) => response.data);

  localStorage.setItem("Token", token);

  location.replace("./deleteUnidades.html");
  return dataPromise;
}

d.addEventListener("submit", (event) => {
  event.preventDefault();
  const target = event.target;
  var inputElements = document.getElementsByClassName("custom-control-input");

  if (target.id === "unidad-form-delete") {
    deleteBtn.onclick = function () {
      for (let j = 0; j < inputElements.length; j++) {
        if (inputElements[j].checked) {
          const element = inputElements[j];
          deleteUnidades(element.id);
        }
      }
    };
  }
});
