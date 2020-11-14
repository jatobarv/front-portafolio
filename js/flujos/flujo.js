const token = localStorage.getItem("Token");
function getTareasAsignadas() {
    const promise = axios.get(`http://127.0.0.1:8000/tareas_asignadas/`, {
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

getTareasAsignadas().then((Tareas) => {
    for (const tarea of Tareas.results) {
        console.log(tarea);
        var sel = document.getElementById("table-body");
        var tr = document.createElement("tr");
        var tdId = document.createElement("td");
        var tdName = document.createElement("td");
        var tdDescripcion = document.createElement("td");
        var tdFechaInicio = document.createElement("td");
        var tdFechaTermino = document.createElement("td");
        var tdTarea = document.createElement("td");
        var tdAsignado = document.createElement("td");
        var tdFuncion = document.createElement("td");
        tdId.appendChild(document.createTextNode(tarea.id));
        tdName.appendChild(document.createTextNode(tarea.nombre_tarea));
        tdDescripcion.appendChild(document.createTextNode(tarea.descripcion_tarea));
        tdFechaInicio.appendChild(document.createTextNode(tarea.fecha_inicio));
        tdFechaTermino.appendChild(document.createTextNode(tarea.fecha_termino));
        tdTarea.appendChild(document.createTextNode(tarea.nombre_tarea));
        tdAsignado.appendChild(document.createTextNode(tarea.nombre_usuario));
        tdFuncion.appendChild(document.createTextNode(tarea.nombre_funcion));

        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdFechaInicio);
        tr.appendChild(tdFechaTermino);
        tr.appendChild(tdTarea);
        tr.appendChild(tdAsignado);
        tr.appendChild(tdFuncion);
        sel.appendChild(tr);

        
    let fecInicio = new Date(tarea.fecha_inicio);
    let fecTermino = new Date(tarea.fecha_termino);

    let diffTiempo = fecTermino.getTime() - fecInicio.getTime();
    let diffDias = diffTiempo / (1000 * 3600 * 24);

    console.log(diffDias);

    if (diffDias < 0) {
      tr.style.backgroundColor = "red";
    } else if (diffDias >= 7) {
      tr.style.backgroundColor = "green";
    } else if (diffDias < 7) {
      tr.style.backgroundColor = "yellow";
    }
    }
});
