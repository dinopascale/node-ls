'use strict'

const fileListContainer = document.querySelector('.file-list');

function handleLoaded() {

    fetch('/stream/Scrivania')
        .then(succ => succ.json())
        .then(json => console.log(json))
        .catch(err => console.log('ciao'))

}

window.onload = handleLoaded;