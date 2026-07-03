/* Single-file preview: chrome behaviors + hash router (mirrors site/js/main.js) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var viewRoot = document.getElementById("view-root");

  var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 24); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var megaBtn = document.querySelector(".nav-mega-btn");
  var megaPanel = document.querySelector(".mega-panel");
  if (megaBtn && megaPanel) {
    var hoverTimer = null;
    var setMega = function (open) {
      megaPanel.classList.toggle("open", open);
      megaBtn.setAttribute("aria-expanded", open ? "true" : "false");
      header.classList.toggle("menu-open", open);
    };
    megaBtn.addEventListener("click", function (e) { e.stopPropagation(); setMega(!megaPanel.classList.contains("open")); });
    megaBtn.parentElement.addEventListener("mouseenter", function () { hoverTimer = setTimeout(function () { setMega(true); }, 150); });
    megaBtn.parentElement.addEventListener("mouseleave", function () { clearTimeout(hoverTimer); });
    megaPanel.addEventListener("mouseleave", function () { setMega(false); });
    document.addEventListener("click", function (e) { if (!megaPanel.contains(e.target) && e.target !== megaBtn) setMega(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setMega(false); } });
    megaPanel.addEventListener("click", function (e) { if (e.target.closest("a")) setMega(false); });
  }

  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    var closeMobile = function () {
      mobileNav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      header.classList.remove("menu-open");
    };
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      header.classList.toggle("menu-open", open);
    });
    mobileNav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMobile(); });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  function initView(scope) {
    var revealEls = scope.querySelectorAll(".reveal");
    if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("in-view"); revealObs.unobserve(entry.target); }
        });
      }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { revealObs.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }

    scope.querySelectorAll("[data-count]").forEach(function (el) {
      var animate = function () {
        var target = parseInt(el.getAttribute("data-count"), 10);
        var pad = parseInt(el.getAttribute("data-pad") || "0", 10);
        var fmt = function (n) { var s = String(n); while (s.length < pad) s = "0" + s; return s; };
        var start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 600, 1);
          el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      if ("IntersectionObserver" in window && !reduceMotion) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) { if (entry.isIntersecting) { animate(); obs.unobserve(entry.target); } });
        }, { threshold: 0.6 });
        obs.observe(el);
      } else { el.textContent = el.getAttribute("data-count"); }
    });

    var faqItems = scope.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
      var btn = item.querySelector(".faq-q"), panel = item.querySelector(".faq-a");
      if (!btn || !panel) return;
      btn.addEventListener("click", function () {
        faqItems.forEach(function (other) {
          if (other !== item && other.classList.contains("open")) {
            other.classList.remove("open");
            other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
            other.querySelector(".faq-a").style.maxHeight = "0px";
          }
        });
        var open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
      });
    });

    scope.querySelectorAll(".terminal").forEach(function (term) {
      var lines = term.querySelectorAll(".term-line");
      if (!lines.length) return;
      var play = function () {
        lines.forEach(function (line, i) {
          setTimeout(function () { line.classList.add("shown"); }, reduceMotion ? 0 : 420 * i + 200);
        });
      };
      if ("IntersectionObserver" in window && !reduceMotion) {
        var termObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) { if (entry.isIntersecting) { play(); termObs.unobserve(entry.target); } });
        }, { threshold: 0.2 });
        termObs.observe(term);
      } else { play(); }
    });

    scope.querySelectorAll(".forecast-svg polyline").forEach(function (line) {
      var len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      var draw = function () {
        line.style.transition = reduceMotion ? "none" : "stroke-dashoffset 1400ms cubic-bezier(0.7,0,0.2,1)";
        line.style.strokeDashoffset = "0";
      };
      if ("IntersectionObserver" in window && !reduceMotion) {
        var svgObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) { if (entry.isIntersecting) { draw(); svgObs.unobserve(entry.target); } });
        }, { threshold: 0.2 });
        svgObs.observe(line.closest(".forecast-svg"));
      } else { draw(); }
    });

    scope.querySelectorAll(".newsletter-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var note = form.parentElement.querySelector(".form-confirm");
        if (note) { note.textContent = "Confirmed — you're on the briefing list."; note.style.display = "block"; }
        form.reset();
      });
    });
    scope.querySelectorAll("form").forEach(function (form) {
      if (form.classList.contains("newsletter-form")) return;
      form.addEventListener("submit", function (e) { e.preventDefault(); });
    });
    scope.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  var current = null;
  function route() {
    var hash = location.hash || "#/index";
    var parts = hash.replace(/^#\//, "").split("/");
    var page = parts[0] || "index";
    var anchor = parts[1] || null;
    var tpl = document.querySelector('template[data-view="' + page + '"]');
    if (!tpl) { page = "index"; anchor = null; tpl = document.querySelector('template[data-view="index"]'); }
    if (current !== page) {
      viewRoot.innerHTML = "";
      viewRoot.appendChild(tpl.content.cloneNode(true));
      document.title = tpl.getAttribute("data-title");
      current = page;
      initView(viewRoot);
      document.querySelectorAll("[data-page]").forEach(function (a) {
        if (a.getAttribute("data-page") === page) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    }
    if (anchor) {
      var el = viewRoot.querySelector("#" + anchor);
      if (el) { el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
