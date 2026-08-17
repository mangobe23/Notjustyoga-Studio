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
  // Reading/writing localStorage can throw in some browsers (e.g. Safari
  // private browsing, or strict privacy settings). If it does, we still
  // want the toggle button to work for this visit — it just won't
  // remember the choice next time. Every localStorage call is wrapped so
  // a storage error can never stop the click handler below from attaching.
  var langBtn = document.querySelector(".lang-toggle");
  var saved = "en";
  try {
    saved = localStorage.getItem("njy-lang") || "en";
  } catch (e) {
    saved = "en";
  }
  setLang(saved);

  if (langBtn) {
    langBtn.addEventListener("click", function () {
      var current = document.body.classList.contains("lang-zh") ? "zh" : "en";
      setLang(current === "en" ? "zh" : "en");
    });
  }

  function setLang(lang) {
    document.body.classList.toggle("lang-zh", lang === "zh");
    try {
      localStorage.setItem("njy-lang", lang);
    } catch (e) {
      // storage blocked — ignore, toggle still works for this visit
    }
    if (langBtn) langBtn.textContent = lang === "en" ? "中文" : "EN";
  }
});
