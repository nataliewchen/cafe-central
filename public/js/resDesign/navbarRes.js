const toggler = document.querySelector('.navbar-toggler');
const login = document.querySelector('#login');
const register = document.querySelector('#register');
const hr = document.querySelector('.user-links-div');
const userLinks = document.querySelector('#user-dropdown');



const changeToBtn = (node) => {
    node.classList.remove('nav-link');
    node.classList.add('btn', 'btn-outline-dark');
}

const changeToLink = (node) => {
    node.classList.remove('btn', 'btn-outline-dark');
    node.classList.add('nav-link');
}

// changing styles based on screen width
toggler.addEventListener('click', () => { // collapsed nav
    if (login && login.classList.contains('btn')) {
        changeToLink(login);
        changeToLink(register);
        hr.classList.remove('d-none');
    }
    document.querySelector('#searchBar').classList.add('d-none');
})

window.onresize = function() {
    if (window.innerWidth < 768 && login && login.classList.contains('btn')) { // change to link styling for collapsed nav (sm/md)
        changeToLink(login);
        changeToLink(register);
        hr.classList.remove('d-none');
    }
    if (window.innerWidth >= 768 && login &&  login.classList.contains('nav-link')) { // change to btn styling for expanded nav (lg/xl)
        changeToBtn(login);
        changeToBtn(register);
        hr.classList.add('d-none');
    }
}
