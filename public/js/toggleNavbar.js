const search = document.querySelector('#search'); // button
const cancel = document.querySelector('#cancel');

const searchBar = document.querySelector('#searchBar');
const inputName = document.querySelector('#inputName');
const inputLoc = document.querySelector('#inputLoc');

const navLinks = document.querySelector('#navLinks');



search.addEventListener('click', () => {
    if (window.location.href.includes('cafes/s?')) { // search results page
        const inputNameSticky = document.querySelector('#inputNameSticky');
        inputNameSticky.select(); // focus on sticky search bar
    }
    else {
        searchBar.classList.toggle('d-none'); // show/hide search bar
    }
});


cancel.addEventListener('click', () => {
    searchBar.classList.add('d-none'); // hide search bar
});


inputName.addEventListener('focus', () => {
    inputName.select(); // highlight text when clicking
});


inputLoc.addEventListener('focus', () => {
    inputLoc.select(); // highlight text when clicking
});
