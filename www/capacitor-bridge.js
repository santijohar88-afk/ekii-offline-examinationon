/* Makes <a download> file saves work inside the Android app.
   Android WebView ignores blob:/data: downloads, so we catch them,
   write the file to app cache, and open the Android Share sheet
   (choose "Save to Files", Drive, Messenger, Bluetooth, etc.). */
(function () {
  function isNative() {
    return window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  }
  function blobToBase64(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(String(r.result).split(',')[1] || ''); };
      r.onerror = function () { rej(r.error); };
      r.readAsDataURL(blob);
    });
  }
  var origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    var a = this;
    if (!isNative() || !a.hasAttribute('download')) return origClick.apply(a, arguments);
    var href = a.href, name = a.getAttribute('download') || 'file';
    var P = window.Capacitor.Plugins || {};
    if (!P.Filesystem || !P.Share) return origClick.apply(a, arguments);
    fetch(href)
      .then(function (r) { return r.blob(); })
      .then(blobToBase64)
      .then(function (b64) {
        return P.Filesystem.writeFile({ path: name, data: b64, directory: 'CACHE', recursive: true });
      })
      .then(function (f) {
        return P.Share.share({ title: name, url: f.uri, dialogTitle: 'Save or send ' + name });
      })
      .catch(function (e) {
        if (e && /cancel/i.test(String(e.message || e))) return;
        alert('Could not save file: ' + (e && e.message ? e.message : e));
      });
  };
})();
