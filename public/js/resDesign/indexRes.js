const toggleOptions = document.querySelector('#toggleOptions');
const options = document.querySelector('#options');
const results = document.querySelector('#results');
const resultsColumn = document.querySelectorAll('.resultsColumn');

toggleOptions.addEventListener('click', () => {
    options.classList.toggle('d-none');
    if (window.innerWidth > 576) { // md: shift results over to show options bar
        results.classList.toggle('col-12');
        results.classList.toggle('col-md-8'); // moving results section to the right
        for (col of resultsColumn) {
        col.classList.toggle('col-md-4');
        col.classList.toggle('col-md-6'); // giving each card 1/2 of the row
    }
    }
})