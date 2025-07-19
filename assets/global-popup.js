// Cookie helper
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? match[1] : null;
}

document.addEventListener('DOMContentLoaded', function() {
  const popup = document.querySelector('.global_popup_container');
  if (!popup) return;

  const COOKIE_NAME = 'globalPopShown';
  const closeBtn    = popup.querySelector('.close');
  const noThanks   = popup.querySelector('.no-thanks');

  // Exit-intent trigger (once per session)
  function onMouseLeave(e) {
    if (e.clientY <= 0 && !getCookie(COOKIE_NAME)) {
      popup.style.display = 'block';
      document.removeEventListener('mouseleave', onMouseLeave);
    }
  }
  document.addEventListener('mouseleave', onMouseLeave);

  // Shared close logic
  function hideAndSetCookie(e) {
    e.preventDefault();
    popup.style.display = 'none';
    document.cookie = COOKIE_NAME + '=1; path=/'; // session cookie
  }

  closeBtn?.addEventListener('click', hideAndSetCookie);
  noThanks?.addEventListener('click', hideAndSetCookie);
});
