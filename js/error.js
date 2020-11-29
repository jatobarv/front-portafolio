const d = document;

d.addEventListener('DOMContentLoaded', () => {
    const $timeOutReddirect = d.querySelector('#setTimeOutRedirect');
    let count = 10;

    setInterval(() => {
        $timeOutReddirect.innerText = (''+count+'');
        count -= 1;
    }, 1000);
    setTimeout( () =>{
        location.replace('http://127.0.0.1:5500/index.html')
    }, 10500)
})

d.querySelector('#errorButton').addEventListener('click', e =>{

    location.replace('http://127.0.0.1:5500/index.html')

})
