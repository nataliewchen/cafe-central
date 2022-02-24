// const toggleOptions = document.querySelector('#toggleOptions');
// const options = document.querySelector('#options');
// const results = document.querySelector('#results');
// const resultsContainer = document.querySelector('#resultsContainer');
// const mapContainer = document.querySelector('#mapContainer');
// const resultsColumn = document.querySelectorAll('.resultsColumn');

// document.querySelector('main').classList.remove('mt-lg-5', 'mt-2', 'mt-md-3');

// toggleOptions.addEventListener('click', () => {
//     options.classList.toggle('d-none');
//     if (window.innerWidth <= 576 && window.scrollY) { //sm: scroll to options bar if already past it
//         window.scrollTo(0, document.querySelector('#searchBarSticky').getBoundingClientRect().bottom)
//     }
//     else if (window.innerWidth > 576) { // md: shift results over to show options bar (col3)
//         resultsContainer.classList.toggle('col-md-5');
//         resultsContainer.classList.toggle('col-md-6'); // moving results section to the right
//         mapContainer.classList.toggle('col-md-6');
//         mapContainer.classList.toggle('col-md-4');
        
//     }
// })

// const toggleList = document.querySelector('#toggleList');
// const toggleMap = document.querySelector('#toggleMap');

// toggleList.addEventListener('click', ()=> {
//     toggleList.classList.toggle('active');
//     toggleMap.classList.toggle('active');
//     results.classList.remove('d-none');
//     mapContainer.classList.add('d-none');
// })

// toggleMap.addEventListener('click', () => {
//     toggleList.classList.toggle('active');
//     toggleMap.classList.toggle('active');
//     results.classList.add('d-none');
//     mapContainer.classList.remove('d-none');
// })