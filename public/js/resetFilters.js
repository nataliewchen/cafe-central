const forms = document.querySelectorAll('.sortAndFilter');
forms.forEach (form => {
  form.addEventListener('change', function () { // automatically submits when changed (filters applied immediately)
    if (window.innerWidth >= 992) { // only for lg screens (when options bar is always visible)
        this.submit();
    }
  });
})


const resets = document.querySelectorAll('.reset-filters'); // multiple resets since buttons show in modal also

resets.forEach(reset => { reset.addEventListener('click', () => {
  forms.forEach(form => {
    form.elements.pf.forEach(checkbox => checkbox.checked = false); // reset price filters
    form.elements.cf.forEach(checkbox => checkbox.checked = false); // reset category filters
    form.elements.mult.checked = false;
    if (form.elements.df) {
      form.elements.df.forEach(checkbox => checkbox.checked = false); // reset distance filters (search results only)
    }
    form.elements.srt.value = '';
    form.submit();
  })
})});