function addPreviews() {
    const previews = document.querySelector('#imagePreviews');
    const input = document.querySelector('#imageUpload');
    if (input.files) { // files to upload
        for(let i=0; i<input.files.length; ++i) {
            let reader = new FileReader(); // async file reading
            reader.onload = function (e) { // triggered when new files
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('imagePreview');
                previews.appendChild(img);
            }
            reader.readAsDataURL(input.files[i]); // show image on form
        }
    }
}

function clearPreviews() {
    const previews = document.querySelector('#imagePreviews');
    previews.innerHTML = '';
}

// getting rid of old previews if user changes the file uploads
const imageUpload = document.querySelector('#imageUpload');
imageUpload.addEventListener('change', function() {
    clearPreviews();
    addPreviews();
});
