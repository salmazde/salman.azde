(async function () {
  const KEY_B64 = "k8YN+5NGTPcTH12iKP8D98UPEt060zbyKcGv17Xvcik=";
  try {
    const res = await fetch('bundle.enc', { cache: 'no-store' });
    const b64 = await res.text();
    const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const iv = raw.slice(0, 12);
    const data = raw.slice(12); // ciphertext + auth tag, as Web Crypto expects

    const keyBytes = Uint8Array.from(atob(KEY_B64), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, data);
    const html = new TextDecoder().decode(plainBuf);

    document.open();
    document.write(html);
    document.close();
  } catch (err) {
    document.body.innerHTML =
      '<p style="font-family:sans-serif;padding:60px;text-align:center;color:#888">' +
      "Couldn't load the page — please refresh.</p>";
    console.error(err);
  }
})();
