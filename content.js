// Safe Zone Overlay: draws the 1080 x 1920 safe-zone margins on top of the largest video on the page.
// Margins (px at 1080 x 1920): top 270, bottom 480, right 140, left 60. Everything runs locally; nothing is sent anywhere.
(function () {
  var ID = '__safe_zone_overlay__';
  if (window.__szoToggle) { window.__szoToggle(); return; }

  var M = { w: 1080, h: 1920, top: 270, bottom: 480, right: 140, left: 60 };
  var root = null, raf = 0, last = '';

  function visibleVideos() {
    return Array.prototype.slice.call(document.querySelectorAll('video')).filter(function (v) {
      var r = v.getBoundingClientRect();
      return r.width > 80 && r.height > 80 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight;
    });
  }
  function area(v) { var r = v.getBoundingClientRect(); return r.width * r.height; }

  // The rectangle where the picture is actually drawn (a player can letterbox it inside a bigger box).
  function pictureRect(v) {
    var r = v.getBoundingClientRect();
    var fit = getComputedStyle(v).objectFit;
    if (!v.videoWidth || !v.videoHeight || (fit !== 'contain' && fit !== 'scale-down')) {
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    var ar = v.videoWidth / v.videoHeight, w = r.width, h = r.height;
    if (w / h > ar) { w = h * ar; } else { h = w / ar; }
    return { x: r.left + (r.width - w) / 2, y: r.top + (r.height - h) / 2, w: w, h: h };
  }

  function fallbackRect() {
    var h = Math.round(innerHeight * 0.9), w = Math.round(h * 9 / 16);
    return { x: Math.round((innerWidth - w) / 2), y: Math.round((innerHeight - h) / 2), w: w, h: h };
  }

  function build() {
    var el = document.createElement('div');
    el.id = ID;
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;z-index:2147483647;pointer-events:none;box-sizing:border-box;margin:0;padding:0;';
    var strips = ['top', 'bottom', 'left', 'right'].map(function (k) {
      var s = document.createElement('div');
      s.dataset.k = k;
      s.style.cssText = 'position:absolute;background:rgba(255,40,70,.36);';
      el.appendChild(s);
      return s;
    });
    var box = document.createElement('div');
    box.style.cssText = 'position:absolute;box-sizing:border-box;border:2px dashed #fff;outline:1px solid rgba(0,0,0,.55);';
    el.appendChild(box);
    var tag = document.createElement('div');
    tag.style.cssText = 'position:absolute;left:6px;top:6px;max-width:calc(100% - 12px);padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.72);color:#fff;font:600 11px/1.35 system-ui,Segoe UI,Arial,sans-serif;white-space:normal;';
    el.appendChild(tag);
    document.documentElement.appendChild(el);
    return { el: el, strips: strips, box: box, tag: tag };
  }

  function place() {
    if (!root) return;
    var vids = visibleVideos().sort(function (a, b) { return area(b) - area(a); });
    var v = vids[0], pr = v ? pictureRect(v) : fallbackRect();
    var ratio = pr.w / pr.h, off = Math.abs(ratio - 9 / 16) > 0.03;
    var key = [pr.x, pr.y, pr.w, pr.h, !!v].map(function (n) { return Math.round(n); }).join(',');
    if (key === last) return;
    last = key;
    var s = root.el.style;
    s.left = pr.x + 'px'; s.top = pr.y + 'px'; s.width = pr.w + 'px'; s.height = pr.h + 'px';
    var t = M.top / M.h * pr.h, b = M.bottom / M.h * pr.h, l = M.left / M.w * pr.w, r = M.right / M.w * pr.w;
    var st = root.strips, mid = (pr.h - t - b) + 'px';
    Object.assign(st[0].style, { left: '0', top: '0', width: '100%', height: t + 'px' });
    Object.assign(st[1].style, { left: '0', bottom: '0', width: '100%', height: b + 'px' });
    Object.assign(st[2].style, { left: '0', top: t + 'px', width: l + 'px', height: mid });
    Object.assign(st[3].style, { right: '0', top: t + 'px', width: r + 'px', height: mid });
    var bs = root.box.style;
    bs.left = l + 'px'; bs.top = t + 'px'; bs.width = (pr.w - l - r) + 'px'; bs.height = (pr.h - t - b) + 'px';
    var msg = 'Keep text and logos inside the dashed box. Margins at 1080 x 1920: top 270, bottom 480, right 140, left 60 px.';
    if (!v) msg = 'No video found on this page. Showing a centered 9:16 frame instead. ' + msg;
    else if (off) msg = 'This picture is not 9:16, so the margins are scaled to it and only approximate. ' + msg;
    root.tag.textContent = msg;
  }

  function loop() { place(); raf = requestAnimationFrame(loop); }

  function show() { if (root) return; root = build(); last = ''; loop(); }
  function hide() { cancelAnimationFrame(raf); if (root && root.el.parentNode) root.el.parentNode.removeChild(root.el); root = null; }

  window.__szoToggle = function () { if (root) hide(); else show(); return !!root; };
  window.__szoState = function () { return !!root; };
  show();
})();
