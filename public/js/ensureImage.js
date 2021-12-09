// client-side validation

const checkImgs = () => {
    const imgs = document.getElementsByName('deleteImages[]'); // all existing images
    let deleteCount = 0;
    imgs.forEach(img => {if (img.checked) deleteCount += 1 });
    if (imgs.length === deleteCount) { // selected all images to delete
        return true;
    }
    else { // not all images selected
        return false;
    }
}



const form = document.querySelector('form');

// prevents cafe from being edited to delete all existing images
form.addEventListener('submit', (event) => {
    const deleteAll = checkImgs();
    if (deleteAll) { // selected all imgs to delete
        const feedback = document.querySelector('#imgsFeedback');
        feedback.classList.remove('d-none');
        event.preventDefault();
        event.stopPropagation();
    }
})