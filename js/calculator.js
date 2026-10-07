(function () {
  /* ====== PENGATURAN: ubah angka di sini sesuai tarif dan kebijakan Anda ====== */
  var CFG = {
    WA: "6289624493600",
    kurs: 4757,            // 1 SAR dalam Rupiah (samakan dengan marketplace)
    fee: 20,               // tambahan per kamar per malam (SAR), sama dengan marketplace
    visa: 155 * 3.75 * 4757,   // USD 155 x 3,75 SAR x kurs, per jamaah
    tiket: 13000000,       // per jamaah, harga acuan
    handling: 185 * 4757,  // per jamaah: kedatangan SAR 100 + kepulangan SAR 85
    transport: [0, 2400 * 4757],            // tanpa / Hiace fulltrip (SAR 2400)
    muthawif: [0, 150 * 4757, 300 * 4757]   // tanpa / setengah hari / full day
  };
  var $ = function (i) { return document.getElementById(i); };
  if (!$("n") || !window.HOTELS) return;
  var rp = function (x) { return "Rp " + Math.round(x).toLocaleString("id-ID"); };
  var pad = function (x) { return (x < 10 ? "0" : "") + x; };
  var key = function (d) { return pad(d.getUTCFullYear() % 100) + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()); };

  function fill(sel, city) {
    var h = "";
    HOTELS.forEach(function (x, i) {
      if (x.c === city) h += '<option value="' + i + '">' + x.n + " (" + x.s + " bintang)</option>";
    });
    $(sel).innerHTML = h;
  }
  fill("hk", "makkah"); fill("hm", "madinah");

  function hotelCost(h, start, nights, tipe, rooms) {
    var sar = 0, miss = 0;
    for (var i = 0; i < nights; i++) {
      var d = new Date(start.getTime() + i * 864e5), k = key(d), r = null;
      for (var j = 0; j < h.p.length; j++) if (k >= h.p[j][0] && k < h.p[j][1]) { r = h.p[j][2 + tipe]; break; }
      if (r === null) miss++; else sar += (r + CFG.fee) * rooms;
    }
    return { sar: sar, miss: miss };
  }

  function calc() {
    var n = Math.max(1, Math.min(20, +$("n").value || 1));
    var size = +$("rt").value, tipe = size - 2, rooms = Math.ceil(n / size);
    var s = $("dt").value ? $("dt").value.split("-") : [2026, 11, 15];
    var start = new Date(Date.UTC(+s[0], +s[1] - 1, +s[2]));
    var nk = Math.max(0, +$("mk").value || 0), nm = Math.max(0, +$("md").value || 0);
    var hk = HOTELS[+$("hk").value], hm = HOTELS[+$("hm").value];
    var mkFirst = $("first").value === "makkah";
    var a = hotelCost(hk, mkFirst ? start : new Date(start.getTime() + nm * 864e5), nk, tipe, rooms);
    var b = hotelCost(hm, mkFirst ? new Date(start.getTime() + nk * 864e5) : start, nm, tipe, rooms);
    var L = [
      ["Hotel Makkah, " + nk + " malam, " + rooms + " kamar", a.sar * CFG.kurs],
      ["Hotel Madinah, " + nm + " malam, " + rooms + " kamar", b.sar * CFG.kurs],
      ["Visa", CFG.visa * n], ["Tiket pesawat (perkiraan)", CFG.tiket * n],
      ["Handling bandara", CFG.handling * n], ["Transportasi", CFG.transport[+$("tr").value]],
      ["Muthawif", CFG.muthawif[+$("mt").value]]
    ];
    var t = 0, h = "";
    L.forEach(function (l) { t += l[1]; h += "<tr><td>" + l[0] + "</td><td>" + rp(l[1]) + "</td></tr>"; });
    $("rows").innerHTML = h;
    $("tot").textContent = rp(t);
    $("pp").textContent = "Sekitar " + rp(t / n) + " per jamaah";
    var miss = a.miss + b.miss;
    $("note").textContent = (miss ? miss + " malam berada di luar daftar tarif yang tersedia, hubungi kami untuk tarif tanggal tersebut. " : "") +
      "Tarif hotel sudah termasuk makan 3 kali sehari. Kurs 1 SAR = " + rp(CFG.kurs) + ".";
    $("wa").href = "https://wa.me/" + CFG.WA + "?text=" + encodeURIComponent(
      "Assalamualaikum, saya ingin diskusi rencana umroh mandiri.\nJamaah: " + n + " orang\nTiba: " + $("dt").value +
      "\nMakkah: " + hk.n + " (" + nk + " malam)\nMadinah: " + hm.n + " (" + nm + " malam)\nEstimasi: " + rp(t));
  }
  document.querySelectorAll("#kalkulator input, #kalkulator select").forEach(function (e) { e.oninput = calc; e.onchange = calc; });
  calc();
})();
