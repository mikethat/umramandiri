var WA="https://wa.me/6289624493600?text=";
/* Peta Kesiapan */
var Q=["Paspor Anda aktif minimal 6 bulan sebelum tanggal berangkat?","Anda sudah menentukan perkiraan tanggal dan lama perjalanan?","Anda sudah paham urutan umroh: ihram, tawaf, sa'i, tahallul?","Anda sudah punya gambaran anggaran perjalanan?","Anda nyaman mengatur hotel dan transportasi dengan pendampingan?"];
var R=[["Mulai dari dasar","Tidak apa-apa. Mulai dari ilmunya dulu lewat kelas persiapan, lalu susun rencana pelan-pelan."],["Hampir siap","Fondasi Anda sudah ada. Beberapa hal perlu dirapikan sebelum memesan."],["Siap melangkah","Anda sudah di jalur yang tepat. Saatnya menghitung anggaran dan memastikan pemesanan."]];
var qi=0,sc=0,qe=document.getElementById("quiz");
function drawQ(){
 if(qi<Q.length){
  qe.innerHTML='<small>Peta Kesiapan Umroh, pertanyaan '+(qi+1)+' dari '+Q.length+'</small><div class="bar"><i style="width:'+(qi/Q.length*100)+'%"></i></div><p class="q">'+Q[qi]+'</p><div class="opts"><button class="btn" data-a="1">Sudah</button><button class="btn ghost" data-a="0">Belum</button></div>';
  qe.querySelectorAll("button").forEach(function(b){b.onclick=function(){sc+=+b.dataset.a;qi++;drawQ()}});
 }else{
  var r=R[sc<=1?0:sc<=3?1:2];
  qe.innerHTML='<small>Hasil Peta Kesiapan Anda: '+sc+' dari '+Q.length+'</small><div class="bar"><i style="width:100%"></i></div><p class="q">'+r[0]+'</p><p style="margin-top:10px">'+r[1]+'</p><div class="opts"><a class="btn" href="'+WA+encodeURIComponent("Assalamualaikum, hasil Peta Kesiapan saya: "+r[0]+" ("+sc+"/5). Saya ingin konsultasi.")+'">Konsultasi hasil ini</a><button class="btn ghost" id="rs">Ulangi</button></div>';
  document.getElementById("rs").onclick=function(){qi=0;sc=0;drawQ()};
 }
}
drawQ();
/* Animasi muncul saat di-scroll */
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll(".item,.steps li,.res,.cmpwrap,.tile,details").forEach(function(x){x.classList.add("rv");io.observe(x)})}
