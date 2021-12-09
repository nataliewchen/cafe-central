let loadCount = 0;
const cards = document.querySelectorAll('.cafe-card');
const spinner = document.querySelector('#spinner');

window.onload = function() {
    if (cards.length < 12) {
        for (let card of cards) {
            card.classList.remove('d-none'); // show all cards
        }
    }
    else if (cards.length > 12) {
        for (let i=0; i<12; ++i) {
            cards[i].classList.remove('d-none'); // show the first 12 cards
        }
        spinner.classList.remove('d-none'); // show spinner
        const footer = document.querySelector('footer');
        footer.classList.add('d-none'); // hide footer temporarily
    }
}



window.onscroll = function () {
    setTimeout(function() {if (window.scrollY > document.documentElement.scrollHeight - window.innerHeight - 150) { // within 150px of the bottom (full spinner in view)
        loadCount += 1; // number of times to load more cards
        const start = 12*loadCount;
        let end = start + 12;
        if (end > cards.length) { // showing <12 with next load
            end = cards.length;
        }
        for (let i=start; i<end; ++i) {
            cards[i].classList.remove('d-none'); // show the first 16 cards
        }
        if (end === cards.length) { // all cards showing
            spinner.classList.add('d-none'); // hide spinner
            const footer = document.querySelector('footer');
            footer.classList.remove('d-none'); // show footer
        }
    }}, 2000); // slight delay for UI (to actually see spinner before new results load)
}
