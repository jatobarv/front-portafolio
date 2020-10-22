var select = document.getElementById("select-permisos");
var elegido = document.getElementById("select-permisos-elegidos");

function addPermiso() {
    var selItem = select.selectedIndex;
    var newOption = select[selItem].cloneNode(true);
    select.remove(selItem);
    elegido.append(newOption);
}

function removePermiso() {
    var eleItem = elegido.selectedIndex;
    var newOption = elegido[eleItem].cloneNode(true);
    elegido.remove(eleItem);
    select.append(newOption);
}
