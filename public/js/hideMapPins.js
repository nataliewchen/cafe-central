// const pin = document.querySelector('.pin');
// console.log(pin);

// let pinLoadCount = 0;
// const pins = document.querySelectorAll('.pin');
// const cafeCards = document.querySelectorAll('.cafe-card');


// window.onload = function() {
//   if (cafeCards.length > 12) {
//     console.log(pins.length);
//     for (let i=0; i<12; ++i) {
//         pins[i].classList.remove('d-none'); // show the first 10 pins
//     }
//   }
// }



// window.onscroll = function () {
//     setTimeout(function() {if (window.scrollY > document.documentElement.scrollHeight - window.innerHeight - 150) { // within 150px of the bottom (full spinner in view)
//         pinLoadCount += 1; // number of times to load more cards
//         const start = 12*pinLoadCount;
//         let end = start + 12;
//         if (end > cards.length) { // showing <12 with next load
//             end = cards.length;
//         }
//         for (let i=start; i<end; ++i) {
//             cards[i].classList.remove('d-none'); // show the first 16 cards
//         }
//         if (end === cards.length) { // all cards showing
//             spinner.classList.add('d-none'); // hide spinner
//             const footer = document.querySelector('footer');
//             footer.classList.remove('d-none'); // show footer
//         }
//     }}, 2000); // slight delay for UI (to actually see spinner before new results load)
// }
