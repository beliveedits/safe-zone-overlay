(function () {
  var btn = document.getElementById('toggle'), status = document.getElementById('status');
  function setLabel(on) { btn.textContent = on ? 'Hide the safe zone' : 'Show the safe zone'; }
  function tab() { return chrome.tabs.query({ active: true, currentWindow: true }).then(function (t) { return t[0]; }); }

  function readState(id) {
    return chrome.scripting.executeScript({ target: { tabId: id }, func: function () { return typeof window.__szoState === 'function' && window.__szoState(); } })
      .then(function (r) { return !!(r && r[0] && r[0].result); });
  }

  tab().then(function (t) {
    if (!t || !t.id) { btn.disabled = true; status.textContent = 'Open a page with a video first.'; return; }
    return readState(t.id).then(setLabel).catch(function () {
      btn.disabled = true;
      status.textContent = 'The overlay cannot run on this kind of page. Try a normal web page.';
    });
  });

  btn.addEventListener('click', function () {
    tab().then(function (t) {
      return chrome.scripting.executeScript({ target: { tabId: t.id }, files: ['content.js'] }).then(function () { return readState(t.id); });
    }).then(function (on) { setLabel(on); status.textContent = on ? 'Overlay is on for this page.' : 'Overlay is off.'; })
      .catch(function () { status.textContent = 'The overlay cannot run on this page.'; });
  });
})();
