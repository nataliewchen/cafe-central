const searchLink = document.querySelector('#search'); // navbar link
const cancel = document.querySelector('.cancel-btn'); // button in dropdown form

const searchBar = document.querySelector('#searchBar');
const inputName = document.querySelector('#inputName');
const inputLoc = document.querySelector('#inputLoc');


// collapse search bar when closing whole navbar
const toggler = document.querySelector('.navbar-toggler');
toggler.addEventListener('click', () => {
  if (!searchBar.classList.contains('d-none')) {
    searchBar.classList.add('d-none');
  }
})


searchLink.addEventListener('click', () => {
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
