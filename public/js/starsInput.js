const stars = document.querySelectorAll('.star-icon');
const container = document.querySelector('.stars-input');
const starInput = document.querySelector('#review-stars');
const form = document.querySelector('#starForm');
const feedback = document.querySelector('#starFeedback');

const fillStars = (fillIndex) => {
  stars.forEach((star, i) => {
    const starIndex = star.id.slice(-1);
    if (starIndex <= fillIndex) { // fill stars to the left
      document.querySelector(`#review-star-${starIndex}`).classList.remove('bi-star');
      document.querySelector(`#review-star-${starIndex}`).classList.add('bi-star-fill');
    } else { // don't fill stars to the right
      document.querySelector(`#review-star-${starIndex}`).classList.add('bi-star');
      document.querySelector(`#review-star-${starIndex}`).classList.remove('bi-star-fill');
    }
  })
}

const emptyStars = () => {
  stars.forEach((star, i) => {
    const starIndex = star.id.slice(-1);
      document.querySelector(`#review-star-${starIndex}`).classList.add('bi-star');
      document.querySelector(`#review-star-${starIndex}`).classList.remove('bi-star-fill');
  });
};

stars.forEach(star => star.addEventListener('click', (e) => {
  const fillIndex = e.target.id.slice(-1); // #1-5
  fillStars(fillIndex); // fill all stars including that value
  selectedStar = fillIndex; // note the selected
  starInput.value = fillIndex; // set the hidden input for form submission
  feedback.classList.add('d-none'); // remove the feedback msg if applicable
}));

stars.forEach(star => star.addEventListener('mouseover', (e) => {
  const fillIndex = e.target.id.slice(-1);
  fillStars(fillIndex);
}));

container.addEventListener('mouseleave', (e) => {
  emptyStars();
  fillStars(starInput.value); // revert back to the previous value
});



// CLIENT-SIDE VALIDATIONS

// preventing review form from being submitted without a star rating
form.addEventListener('submit', (e) => {
  if (starInput.value === '0') {
      feedback.classList.remove('d-none'); // show feedback msg
      e.preventDefault();
      e.stopPropagation();
  }
});



