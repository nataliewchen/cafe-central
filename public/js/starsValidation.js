// CLIENT-SIDE VALIDATIONS

const findChecked = (arr) => {
    for (let el of arr) {
        if (el.checked) {
            return el.value;
        }
    }
}


const form = document.querySelector('#starForm');
const feedback = document.querySelector('#starFeedback');

// preventing review form from being submitted without a star rating
form.addEventListener('submit', (event) => {
    const starBtns = document.getElementsByName('review[rating]');
    const rating = findChecked(starBtns);
    if (rating === '0') {
        feedback.classList.remove('d-none'); // show feedback msg
        event.preventDefault();
        event.stopPropagation();
    }
});

// removing the feedback message once a rating is selected
const stars = document.querySelector('fieldset');
stars.addEventListener('input', () => {
    feedback.classList.add('d-none');
});



