import { apiRequest } from '../module.js'
const d = document;
let users;

d.addEventListener('DOMContentLoaded', async (event) => {
    const $tbody = d.querySelector('tbody')
    const $fragment = new DocumentFragment()
    
    const token = localStorage.getItem('Token')
    
    const response = await apiRequest({
        url: 'http://127.0.0.1:8000/usuarios/',
        method: "GET",
        token,
        action: "get users"
    });
    
    users = response.results
    
    const $template = d.querySelector('#userTemplate')
    
    users.forEach(user => {
        const $clone = $template.content.cloneNode(true)
        const $tr = $clone.querySelector('tr')
        const $td = $tr.querySelectorAll('td')
        const $button = d.createElement('button')
        
        $button.textContent = "EDITAR"
        $button.classList.add("btn", "btn-info");
        $button.setAttribute("data-toggle","modal")
        $button.setAttribute("data-target","#exampleModal")
        $button.setAttribute("data-user-id",user.id)

        $td[0].textContent = user.username
        $td[1].textContent = user.email
        $td[2].insertAdjacentElement('beforeend',$button)

        $fragment.append($tr)
    }); 

    $tbody.append($fragment)
})

d.addEventListener('click', event => {
    const target = event.target;

    
    if(target.dataset.userId){
        const user = users.find(element => element.id = target.dataset.userId);
        console.log(user)
    }
})