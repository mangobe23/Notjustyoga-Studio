// Notjustyoga Studio — shared behaviour
// 1) mobile nav toggle   2) EN / 中文 language switch (persisted)

document.addEventListener("DOMContentLoaded", function () {
  // ---- mobile nav ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  // ---- language toggle ----
  var langBtn = document.querySelector(".lang-toggle");
  var saved = localStorage.getItem("njy-lang") || "en";
  setLang(saved);

  if (langBtn) {
    langBtn.addEventListener("click", function () {
      var current = document.body.classList.contains("lang-zh") ? "zh" : "en";
      setLang(current === "en" ? "zh" : "en");
    });
  }

  function setLang(lang) {
    document.body.classList.toggle("lang-zh", lang === "zh");
    localStorage.setItem("njy-lang", lang);
    if (langBtn) langBtn.textContent = lang === "en" ? "中文" : "EN";
  }
});
