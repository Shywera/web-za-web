/* Studio7 · prije/poslije klizac + reveal animacije */
(function () {
  "use strict";

  var godina = document.getElementById("godina");
  if (godina) godina.textContent = String(new Date().getFullYear());

  /* Prije/poslije klizac */
  var klizac = document.getElementById("usKlizac");
  if (klizac) {
    var okvir = klizac.closest(".us-okvir");
    function postavi() {
      okvir.style.setProperty("--x", klizac.value + "%");
    }
    klizac.addEventListener("input", postavi);
    postavi();

    /* Mali uvodni pokret cim klizac postane vidljiv, da se odmah vidi sto radi */
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && "IntersectionObserver" in window) {
      var demoOdigran = false;
      var demoIo = new IntersectionObserver(function (zapisi) {
        zapisi.forEach(function (z) {
          if (z.isIntersecting && !demoOdigran) {
            demoOdigran = true;
            demoIo.disconnect();
            animirajDemo();
          }
        });
      }, { threshold: 0.5 });
      demoIo.observe(okvir);
    }

    var demoId = null;
    function animirajDemo() {
      var tocke = [50, 78, 22, 50];
      var trajanje = 2200;
      var t0 = null;
      function korak(t) {
        if (t0 === null) t0 = t;
        var u = Math.min((t - t0) / trajanje, 1);
        var seg = Math.min(Math.floor(u * 3), 2);
        var lokal = u * 3 - seg;
        var e = lokal < 0.5 ? 2 * lokal * lokal : 1 - Math.pow(-2 * lokal + 2, 2) / 2;
        var vrijednost = tocke[seg] + (tocke[seg + 1] - tocke[seg]) * e;
        klizac.value = vrijednost;
        postavi();
        if (u < 1) demoId = requestAnimationFrame(korak);
        else demoId = null;
      }
      demoId = requestAnimationFrame(korak);
    }
    ["pointerdown", "touchstart", "keydown"].forEach(function (ev) {
      klizac.addEventListener(ev, function () {
        if (demoId !== null) {
          cancelAnimationFrame(demoId);
          demoId = null;
        }
      }, { passive: true });
    });
  }

  /* Reveal na scroll */
  var elementi = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (zapisi) {
      zapisi.forEach(function (z) {
        if (z.isIntersecting) {
          z.target.classList.add("vidljivo");
          io.unobserve(z.target);
        }
      });
    }, { threshold: 0.15 });
    elementi.forEach(function (el) { io.observe(el); });
  } else {
    elementi.forEach(function (el) { el.classList.add("vidljivo"); });
  }
})();
