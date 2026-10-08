(function () {
  /* ENDPOINT opsional: isi dengan URL Google Apps Script / Formspree agar kontak tersimpan otomatis. Kosongkan jika hanya lewat WhatsApp. */
  var CFG = { WA: "6289624493600", ENDPOINT: "" };
  document.querySelectorAll("form.lead-form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = f.nama.value.trim(), w = f.wa.value.replace(/[^\d+]/g, ""), er = f.querySelector(".err");
      if (n.length < 2) { er.textContent = "Mohon isi nama Anda."; return; }
      if (!/^(\+?62|0)8\d{7,12}$/.test(w)) { er.textContent = "Nomor WhatsApp belum valid. Contoh: 08123456789"; return; }
      if (!f.setuju.checked) { er.textContent = "Mohon centang persetujuan untuk dihubungi."; return; }
      er.textContent = "";
      var kind = f.dataset.kind;
      var msg = "Assalamualaikum, saya " + n + ". Saya ingin " + kind + ".\nNomor WhatsApp saya: " + w;
      if (CFG.ENDPOINT) {
        try { fetch(CFG.ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ nama: n, wa: w, jenis: kind, waktu: new Date().toISOString() }) }); } catch (x) {}
      }
      window.open("https://wa.me/" + CFG.WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  });
})();
