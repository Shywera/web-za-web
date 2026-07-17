/* Studio7 · scroll tranzicija (retro u moderno) + reveal animacije */
(function () {
  "use strict";

  var root = document.documentElement;
  var wrapper = document.getElementById("tranzicija");
  var retro = document.getElementById("retroWrap");
  var hero = document.getElementById("heroScena");
  var godina = document.getElementById("godina");

  if (godina) godina.textContent = String(new Date().getFullYear());

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !wrapper || !retro || !hero) {
    root.classList.add("staticno");
    otkrijSve();
    return;
  }

  /* Glatki prijelaz: 0 prije a, 1 poslije b, mekano izmedu */
  function faza(p, a, b) {
    var t = (p - a) / (b - a);
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    return t * t * (3 - 2 * t);
  }

  var zakazano = false;
  function naScroll() {
    if (zakazano) return;
    zakazano = true;
    requestAnimationFrame(azuriraj);
  }

  function azuriraj() {
    zakazano = false;
    var rect = wrapper.getBoundingClientRect();
    var ukupno = wrapper.offsetHeight - window.innerHeight;
    var p = ukupno > 0 ? -rect.top / ukupno : 0;
    if (p < 0) p = 0;
    if (p > 1) p = 1;

    root.style.setProperty("--p1", faza(p, 0.05, 0.35).toFixed(4));
    root.style.setProperty("--p2", faza(p, 0.28, 0.68).toFixed(4));
    root.style.setProperty("--p3", faza(p, 0.58, 0.9).toFixed(4));
    root.style.setProperty("--pq", (1 - faza(p, 0.0, 0.12)).toFixed(4));

    retro.classList.toggle("glitchano", p > 0.07 && p < 0.5);
    hero.classList.toggle("aktivno", p > 0.75);
    var pitanje = document.getElementById("pitanje");
    if (pitanje) {
      if (p > 0.12) pitanje.setAttribute("data-skriveno", "");
      else pitanje.removeAttribute("data-skriveno");
    }
  }

  window.addEventListener("scroll", naScroll, { passive: true });
  window.addEventListener("resize", naScroll);
  azuriraj();

  /* Gumb: sam odvrti cijelu tranziciju, kao mala kino-scena */
  var animacijaId = null;
  function odvrtiTranziciju() {
    var start = window.scrollY;
    var cilj = wrapper.offsetTop + wrapper.offsetHeight - window.innerHeight;
    var trajanje = 2600;
    var t0 = null;
    function korak(t) {
      if (t0 === null) t0 = t;
      var u = Math.min((t - t0) / trajanje, 1);
      var e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      window.scrollTo({ top: start + (cilj - start) * e, left: 0, behavior: "instant" });
      if (u < 1) animacijaId = requestAnimationFrame(korak);
      else animacijaId = null;
    }
    animacijaId = requestAnimationFrame(korak);
  }
  function prekiniAnimaciju() {
    if (animacijaId !== null) {
      cancelAnimationFrame(animacijaId);
      animacijaId = null;
    }
  }
  window.addEventListener("wheel", prekiniAnimaciju, { passive: true });
  window.addEventListener("touchstart", prekiniAnimaciju, { passive: true });

  var pokreni = document.getElementById("pokreni");
  if (pokreni) {
    pokreni.addEventListener("click", function (e) {
      e.preventDefault();
      odvrtiTranziciju();
    });
  }

  /* Mamac dok korisnik stoji na vrhu: stara stranica povremeno kratko glitchne */
  setInterval(function () {
    if (window.scrollY < 40 && animacijaId === null) {
      retro.classList.add("glitchano");
      setTimeout(function () {
        if (window.scrollY < 40) retro.classList.remove("glitchano");
      }, 380);
    }
  }, 4200);

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
    otkrijSve();
  }

  function otkrijSve() {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("vidljivo");
    });
  }
})();
