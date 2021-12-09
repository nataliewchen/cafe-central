const form = document.querySelector('#sortAndFilter');
form.addEventListener('change', function () { // automatically submits when changed (filters applied immediately)
    if (window.innerWidth > 992) { // only for lg screens (when options bar is always visible)
        this.submit();
    }
});

const reset = document.querySelector('#reset');
reset.addEventListener('click', function () {
    form.elements.pf.forEach(checkbox => checkbox.checked = false); // reset price filters
    form.elements.cf.forEach(checkbox => checkbox.checked = false); // reset category filters
    form.elements.mult.checked = false;
    form.elements.df.forEach(checkbox => checkbox.checked = false); // reset distance filters
    form.submit();
})