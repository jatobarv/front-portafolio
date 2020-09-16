let USER_TOKEN = '';
let ref = window.location.href;
let principal = './principal.html'

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    axios.post('http://127.0.0.1:8000/login/', {
            username: username,
            password: password
        })
        .then((response) => {
            USER_TOKEN = response.data.token;

            localStorage.setItem("TOKEN", USER_TOKEN);
            localStorage.setItem("username", username);
            console.log(response)
            window.location.href = principal;
        }, (error) => {
            console.log(error);
        });
}