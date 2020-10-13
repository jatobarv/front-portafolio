import { getPerm } from '../module.js'

const d = document;

const templatePerms = [1]

d.addEventListener('DOMContentLoaded', async () =>{
    if (!templatePerms.includes(await getPerm()) && !templatePerms.includes(0)) location.replace('../error.html')
})