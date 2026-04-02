(function() {
  var toggle = document.querySelector('.header-search-toggle');
  var dropdown = document.querySelector('.header-search-dropdown');
  if (!toggle || !dropdown) return;

  var initialized = false;

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!dropdown.hidden) {
      dropdown.hidden = true;
      return;
    }
    dropdown.hidden = false;

    if (!initialized) {
      new PagefindUI({
        element: '#header-pagefind',
        showSubResults: true,
        showImages: false
      });
      initialized = true;
    }

    setTimeout(function() {
      var input = dropdown.querySelector('.pagefind-ui__search-input');
      if (input) input.focus();
    }, 100);
  });

  document.addEventListener('click', function(e) {
    if (!dropdown.hidden && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
      dropdown.hidden = true;
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !dropdown.hidden) {
      dropdown.hidden = true;
    }
  });
})();
