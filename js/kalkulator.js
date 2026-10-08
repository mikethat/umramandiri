(function () {
  /* Kurs, harga, dan tarif hotel dibaca dari data/data.js */
  var WA = window.WA, RATE = window.RATE, RATE_DATE = window.RATE_DATE, DAY = 864e5, P = window.PRICE;
  var VISA_SAR = Math.round(P.visaUsd * window.USD_SAR);
  var TIKET_RP = P.tiketRp, INF_FACTOR = P.infantFactor;
  var TRANS_SAR = P.hiace, MT_HALF = P.mtHalf, MT_FULL = P.mtFull, HIN = P.hin, HOUT = P.hout;
  var OCC = [2, 3, 4], TYPES = ["Double", "Triple", "Quad"], CITIES = ["Makkah", "Madinah"];
  var $ = function (i) { return document.getElementById(i); };
  var rp = function (n) { return "Rp " + Math.round(n).toLocaleString("id-ID"); };
  var sar = function (n) { return "SAR " + Math.round(n).toLocaleString("id-ID"); };
  var fd = function (d) { var s = new Date(d * DAY).toISOString().slice(0, 10).split("-"); return s[2] + "/" + s[1] + "/" + s[0]; };
  var dm = function (s) { var d = +s.slice(0, 2), m = +s.slice(2); return Date.UTC(m >= 8 ? 2026 : 2027, m - 1, d) / DAY; };
  function parse(s) { var a = s.split("|"); return { n: a[0], s: +a[1], r: a[2].split(";").map(function (x) { var p = x.split(":"), d = p[0].split("-"); return { a: dm(d[0]), b: dm(d[1]), p: p[1].split("/").map(Number) }; }) }; }
  var DB = {}; CITIES.forEach(function (c) { DB[c] = HOTELS[c].map(parse); });
  function night(h, d, t) { var v = null; h.r.forEach(function (r) { if (d >= r.a && d <= r.b) v = r.p[t]; }); return v; }
  function stay(h, ci, n, t) { var tot = 0; for (var i = 0; i < n; i++) { var v = night(h, ci + i, t); if (v == null) return null; tot += v; } return tot; }

  var S = { ad: 2, inf: 0, visa: false, dt: "2026-12-01", first: "Madinah", nmMakkah: 5, nmMadinah: 4,
    type: { Makkah: 0, Madinah: 0 }, rooms: { Makkah: null, Madinah: null }, star: { Makkah: 0, Madinah: 0 }, q: { Makkah: "", Madinah: "" }, hot: { Makkah: null, Madinah: null },
    trips: 0, tiket: false, tiketRp: TIKET_RP, half: 0, full: 0, hin: false, hout: false, kereta: false, lain: false }, cur = 0;
  var LIM = { ad: [1, 20], inf: [0, 10], nmMakkah: [0, 30], nmMadinah: [0, 30], trips: [0, 10], half: [0, 20], full: [0, 20], roomsMakkah: [1, 20], roomsMadinah: [1, 20] };

  function startDay() { var s = S.dt.split("-"); return Date.UTC(+s[0], +s[1] - 1, +s[2]) / DAY; }
  function ci(c) { return c === S.first ? startDay() : startDay() + S["nm" + S.first]; }
  function nights(c) { return S["nm" + c]; }
  function roomsOf(c) { return S.rooms[c] != null ? S.rooms[c] : Math.max(1, Math.ceil(S.ad / OCC[S.type[c]])); }
  function hotelOf(c) { return DB[c].filter(function (h) { return h.n === S.hot[c]; })[0] || null; }
  function bump(k, d) {
    var l = LIM[k], m = k.indexOf("rooms") === 0 ? k.slice(5) : null, v = (m ? roomsOf(m) : S[k]) + d;
    v = Math.max(l[0], Math.min(l[1], v)); if (m) S.rooms[m] = v; else S[k] = v;
    if (k === "ad") S.rooms.Makkah = S.rooms.Madinah = null;
  }
  function calc() {
    var g = S.ad + S.inf, L = [], miss = [];
    if (S.visa) L.push(["Visa umroh (" + g + " jamaah)", VISA_SAR * g * RATE]);
    CITIES.forEach(function (c) {
      var h = hotelOf(c), n = nights(c); if (!n || !h) return;
      var t = stay(h, ci(c), n, S.type[c]);
      if (t == null) { miss.push("Tarif " + h.n + " belum tersedia untuk tanggal ini"); t = 0; }
      L.push(["Hotel " + c + (h ? ": " + h.n : "") + " (" + n + " malam, " + roomsOf(c) + " kamar " + TYPES[S.type[c]] + ")", t * roomsOf(c) * RATE]);
    });
    if (S.trips) L.push(["Transportasi Hiace (" + S.trips + " trip)", TRANS_SAR * S.trips * RATE]);
    if (S.tiket) L.push(["Tiket pesawat (estimasi)", S.tiketRp * (S.ad + S.inf * INF_FACTOR)]);
    var mt = S.half * MT_HALF + S.full * MT_FULL; if (mt) L.push(["Muthawwif (" + S.half + " sesi, " + S.full + " hari)", mt * RATE]);
    var hd = (S.hin ? HIN : 0) + (S.hout ? HOUT : 0); if (hd) L.push(["Handling bandara", hd * g * RATE]);
    var t = 0; L.forEach(function (l) { t += l[1]; });
    return { L: L, t: t, g: g, miss: miss };
  }
  function waLink(c) {
    if (!c.L.length) return "https://wa.me/" + WA + "?text=" + encodeURIComponent("Assalamualaikum, saya ingin konsultasi estimasi umroh mandiri.");
    var t = "Assalamualaikum, saya ingin konsultasi estimasi umroh mandiri.\n\nJamaah: " + S.ad + " dewasa" + (S.inf ? ", " + S.inf + " infant" : "") +
      "\nTanggal tiba: " + fd(startDay()) + " (mulai dari " + S.first + ")\n\nRincian:\n" + c.L.map(function (l) { return "- " + l[0] + ": " + rp(l[1]); }).join("\n") +
      (S.kereta ? "\n- Add on: Kereta cepat Haramain (harga via konsultasi)" : "") + (S.lain ? "\n- Add on: kebutuhan lainnya (harga via konsultasi)" : "") +
      "\n\nTotal estimasi: " + rp(c.t) + " (" + rp(c.t / c.g) + " per jamaah)";
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
  }
  /* ---- komponen tampilan ---- */
  var stp = function (k, v) { return '<span class="stp"><button type="button" data-s="' + k + '" data-d="-1" aria-label="Kurangi">&minus;</button><b>' + v + '</b><button type="button" data-s="' + k + '" data-d="1" aria-label="Tambah">+</button></span>'; };
  var row = function (a, b, c) { return '<div class="row"><div><b>' + a + '</b><small>' + b + '</small></div>' + c + '</div>'; };
  var chk = function (k, label) { return '<label class="chk"><input type="checkbox" data-k="' + k + '"' + (S[k] ? " checked" : "") + '> ' + label + '</label>'; };
  var STEPS = [
    ["Jumlah Jamaah", "Tentukan komposisi jamaah untuk menghitung visa dan pembagian biaya per orang.", function () {
      return row("Dewasa", "2 tahun ke atas", stp("ad", S.ad)) + row("Infant", "di bawah 2 tahun", stp("inf", S.inf)) + '<p class="tl">Total: <b>' + (S.ad + S.inf) + ' jamaah</b></p>'; }],
    ["Visa", "Biaya visa dihitung berdasarkan total jamaah.", function () {
      return chk("visa", "Sertakan visa umroh") + '<p class="tl">Harga acuan USD ' + P.visaUsd + ' per jamaah, sekitar ' + rp(VISA_SAR * RATE) + ' (1 USD = ' + String(window.USD_SAR).replace('.', ',') + ' SAR).</p>'; }],
    ["Tanggal dan Durasi", "Tanggal menentukan tarif hotel per malam. Jumlah malam menentukan total biaya hotel.", function () {
      var f = S.first, o = f === "Makkah" ? "Madinah" : "Makkah", opt = function (v) { return '<option value="' + v + '"' + (f === v ? " selected" : "") + ">" + v + "</option>"; };
      return '<div class="two"><label>Tanggal tiba<input type="date" data-k="dt" value="' + S.dt + '" min="2026-08-14" max="2027-03-09"></label><label>Mulai dari<select data-k="first">' + opt("Madinah") + opt("Makkah") + '</select></label></div>' +
        row("Malam di Makkah", "", stp("nmMakkah", S.nmMakkah)) + row("Malam di Madinah", "", stp("nmMadinah", S.nmMadinah)) +
        '<p class="tl">' + f + ": " + fd(ci(f)) + " sampai " + fd(ci(f) + nights(f)) + "<br>" + o + ": " + fd(ci(o)) + " sampai " + fd(ci(o) + nights(o)) + "</p>"; }],
    ["Hotel Makkah", "Pilih hotel, tipe kamar, dan jumlah kamar. Tarif sudah termasuk makan 3 kali sehari.", function () { return hotelStep("Makkah"); }],
    ["Hotel Madinah", "Pilih hotel, tipe kamar, dan jumlah kamar. Tarif sudah termasuk makan 3 kali sehari.", function () { return hotelStep("Madinah"); }],
    ["Transportasi", "Harga transportasi masuk ke estimasi total.", function () {
      return row("Hiace fulltrip", sar(TRANS_SAR) + " per trip, satu trip penuh", stp("trips", S.trips)); }],
    ["Tiket Pesawat", "Tambahkan estimasi tiket per jamaah, atau biarkan belum termasuk bila akan dikonfirmasi terpisah.", function () {
      return chk("tiket", "Sertakan estimasi tiket pesawat") + (S.tiket ? '<label>Estimasi per dewasa (Rp)<input type="number" data-k="tiketRp" min="0" step="100000" value="' + S.tiketRp + '"></label><p class="tl">Harga acuan ' + rp(TIKET_RP) + ' per orang. Infant dihitung ' + Math.round(INF_FACTOR * 100) + '% dari tarif dewasa.</p>' : '<p class="tl">Tiket belum termasuk dalam estimasi.</p>'); }],
    ["Muthawwif", "Pilih apakah perjalanan membutuhkan pendamping ibadah.", function () {
      return row("Setengah hari", sar(MT_HALF) + " per sesi, thawaf dan sa'i didampingi", stp("half", S.half)) + row("Full day", sar(MT_FULL) + " per hari, ibadah plus ziarah kota", stp("full", S.full)); }],
    ["Handling dan Add On", "Handling dihitung per jamaah. Add on dikonfirmasi saat konsultasi.", function () {
      return chk("hin", "Handling kedatangan Jeddah (" + sar(HIN) + " per orang)") + chk("hout", "Handling kepulangan (" + sar(HOUT) + " per orang)") +
        '<p class="tl">Add on opsional, harga diberikan saat konsultasi:</p>' + chk("kereta", "Kereta cepat Haramain") + chk("lain", "Kebutuhan lainnya"); }],
    ["Ringkasan Estimasi", "Cek rincian sebelum mengirimkan kebutuhan Anda ke kami.", summary]
  ];
  function hotelStep(c) {
    return '<div class="two"><label>Tipe kamar<select data-t="' + c + '">' + TYPES.map(function (x, i) { return '<option value="' + i + '"' + (S.type[c] === i ? " selected" : "") + ">" + x + " (" + OCC[i] + " orang)</option>"; }).join("") + '</select></label><div class="lb">Jumlah kamar' + stp("rooms" + c, roomsOf(c)) + '</div></div>' +
      '<div class="chips">' + [[0, "Semua"], [5, "5 bintang"], [4, "4 bintang"], [3, "3 bintang"]].map(function (x) { return '<button type="button" class="chip' + (S.star[c] === x[0] ? " on" : "") + '" data-star="' + x[0] + '" data-c="' + c + '">' + x[1] + "</button>"; }).join("") + '</div>' +
      '<input class="q" data-q="' + c + '" placeholder="Cari hotel ' + c + '" value="' + S.q[c] + '"><div id="hl"></div>';
  }
  function drawList(c) {
    var box = $("hl"); if (!box) return; var n = nights(c), t = S.type[c], q = S.q[c].toLowerCase(), st = S.star[c];
    if (!n) { box.innerHTML = '<p class="tl">Malam di ' + c + " diatur 0, jadi hotel tidak dihitung.</p>"; return; }
    var rows = DB[c].filter(function (h) { return (!st || h.s === st) && h.n.toLowerCase().indexOf(q) > -1; }).map(function (h) { return { h: h, t: stay(h, ci(c), n, t) }; });
    rows.sort(function (a, b) { return (a.t == null) - (b.t == null) || a.t - b.t; });
    box.innerHTML = rows.map(function (o) {
      var h = o.h, bin = "&#9733;".repeat(h.s);
      if (o.t == null) return '<div class="hc dis"><span><b>' + h.n + "</b><i>" + bin + "</i></span><small>Tarif belum tersedia untuk tanggal ini</small></div>";
      return '<button type="button" class="hc' + (S.hot[c] === h.n ? " on" : "") + '" data-h="' + h.n + '" data-c="' + c + '"><span><b>' + h.n + "</b><i>" + bin + '</i></span><span class="pr">' + sar(o.t / n) + "<small>per kamar per malam (rata-rata)</small><small>" + rp(o.t * roomsOf(c) * RATE) + " untuk " + roomsOf(c) + " kamar</small></span></button>";
    }).join("") || '<p class="tl">Hotel tidak ditemukan.</p>';
  }
  function summary() {
    var c = calc();
    if (!c.L.length) return '<div class="sumtop"><small>Total estimasi perjalanan</small><div class="big">Rp 0</div><small>Belum ada layanan yang dipilih</small></div><p class="tl">Pilih layanan di langkah sebelumnya, misalnya visa, hotel, atau transportasi. Estimasi akan muncul di sini.</p><div class="cta" style="margin-top:20px"><a class="btn ghost" href="' + waLink(c) + '">Tanya via WhatsApp</a></div>';
    return '<div class="sumtop"><small>Total estimasi perjalanan</small><div class="big">' + rp(c.t) + "</div><small>" + rp(c.t / c.g) + " per jamaah</small></div>" +
      '<table class="sumt"><tr><td>Komposisi</td><td>' + S.ad + " dewasa" + (S.inf ? ", " + S.inf + " infant" : "") + "</td></tr><tr><td>Total durasi</td><td>" + (S.nmMakkah + S.nmMadinah) + " malam (" + S.nmMakkah + " Makkah, " + S.nmMadinah + " Madinah)</td></tr>" +
      "<tr><td>Kamar</td><td>Makkah " + roomsOf("Makkah") + ", Madinah " + roomsOf("Madinah") + "</td></tr></table>" +
      '<h3 style="margin-top:22px">Rincian biaya</h3><table class="sumt">' + c.L.map(function (l) { return "<tr><td>" + l[0] + "</td><td>" + rp(l[1]) + "</td></tr>"; }).join("") + "</table>" +
      (c.miss.length ? '<p class="warn">' + c.miss.join(". ") + ".</p>" : "") +
      '<div class="cta" style="margin-top:20px"><a class="btn" href="' + waLink(c) + '">Konsultasikan Estimasi</a><a class="btn ghost" href="marketplace.html">Pesan di Marketplace</a></div>';
  }
  /* ---- render ---- */
  function upd() { var c = calc(); $("dt1").textContent = rp(c.t); $("dt2").textContent = c.L.length ? rp(c.t / c.g) + " per jamaah" : "Pilih layanan untuk melihat estimasi"; $("dwa").href = waLink(c); }
  function render(scroll) {
    var s = STEPS[cur]; $("sn").textContent = "Langkah " + (cur + 1) + " dari " + STEPS.length; $("pg").style.width = ((cur + 1) / STEPS.length * 100) + "%";
    $("st").innerHTML = "<h2>" + s[0] + "</h2><p>" + s[1] + "</p>" + s[2]();
    $("bk").style.visibility = cur ? "visible" : "hidden"; $("nx").style.display = cur === STEPS.length - 1 ? "none" : "inline-block";
    if (cur === 3) drawList("Makkah"); if (cur === 4) drawList("Madinah");
    upd(); if (scroll) $("wz").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  var st = $("st");
  st.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.s) { bump(b.dataset.s, +b.dataset.d); render(); }
    else if (b.dataset.h) { S.hot[b.dataset.c] = b.dataset.h; drawList(b.dataset.c); upd(); }
    else if (b.dataset.star) { S.star[b.dataset.c] = +b.dataset.star; render(); }
  });
  st.addEventListener("input", function (e) { var q = e.target.dataset.q; if (q) { S.q[q] = e.target.value; drawList(q); } });
  st.addEventListener("change", function (e) {
    var t = e.target, k = t.dataset.k;
    if (t.dataset.t) { S.type[t.dataset.t] = +t.value; S.rooms[t.dataset.t] = null; render(); }
    else if (k) { S[k] = t.type === "checkbox" ? t.checked : t.type === "number" ? (+t.value || 0) : t.value; render(); }
  });
  $("nx").onclick = function () { if (cur < STEPS.length - 1) { cur++; render(true); } };
  $("bk").onclick = function () { if (cur > 0) { cur--; render(true); } };
  $("kurs").textContent = "Kurs Rp " + RATE.toLocaleString("id-ID") + " per SAR (" + RATE_DATE + ").";
  render();
})();
