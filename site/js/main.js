/* KFN Accounting & Financial — "Obsidian Volt" shared behaviors */
(function () {
  "use strict";

  /* Signal that JS is running — reveal/terminal hidden states are scoped to html.js
     so content is never invisible if scripting fails */
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Sticky header: gain solid fill after 24px of scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mega-menu: click + hover-intent, Escape, outside click, keyboard-safe */
  var megaBtn = document.querySelector(".nav-mega-btn");
  var megaPanel = document.querySelector(".mega-panel");
  if (megaBtn && megaPanel) {
    var hoverTimer = null;
    var setMega = function (open) {
      megaPanel.classList.toggle("open", open);
      megaBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (header) header.classList.toggle("menu-open", open);
    };
    megaBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMega(!megaPanel.classList.contains("open"));
    });
    megaBtn.parentElement.addEventListener("mouseenter", function () {
      hoverTimer = setTimeout(function () { setMega(true); }, 150);
    });
    megaBtn.parentElement.addEventListener("mouseleave", function () {
      clearTimeout(hoverTimer);
    });
    megaPanel.addEventListener("mouseleave", function () { setMega(false); });
    document.addEventListener("click", function (e) {
      if (!megaPanel.contains(e.target) && e.target !== megaBtn) setMega(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setMega(false); megaBtn.focus(); }
    });
  }

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      if (header) header.classList.toggle("menu-open", open);
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        if (header) header.classList.remove("menu-open");
      });
    });
  }

  /* Scroll reveals */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Count-up numerals: <span data-count="50" data-pad="2"> */
  var counters = document.querySelectorAll("[data-count]");
  var animateCount = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var pad = parseInt(el.getAttribute("data-pad") || "0", 10);
    var fmt = function (n) {
      var s = String(n);
      while (s.length < pad) s = "0" + s;
      return s;
    };
    var duration = 600;
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
    var countObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countObs.observe(el); });
  }

  /* FAQ accordion — single-open */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var panel = item.querySelector(".faq-a");
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

  /* SteveKnows terminal: reveal lines sequentially when visible */
  document.querySelectorAll(".terminal").forEach(function (term) {
    var lines = term.querySelectorAll(".term-line");
    if (!lines.length) return;
    var play = function () {
      lines.forEach(function (line, i) {
        setTimeout(function () { line.classList.add("shown"); }, reduceMotion ? 0 : 420 * i + 200);
      });
    };
    if ("IntersectionObserver" in window && !reduceMotion) {
      var termObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              play();
              termObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      termObs.observe(term);
    } else {
      play();
    }
  });

  /* Forecast polyline: draw on scroll-into-view */
  document.querySelectorAll(".forecast-svg polyline").forEach(function (line) {
    var len = line.getTotalLength();
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    var draw = function () {
      line.style.transition = reduceMotion ? "none" : "stroke-dashoffset 1400ms cubic-bezier(0.7, 0, 0.2, 1)";
      line.style.strokeDashoffset = "0";
    };
    if ("IntersectionObserver" in window && !reduceMotion) {
      var svgObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              draw();
              svgObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      svgObs.observe(line.closest(".forecast-svg"));
    } else {
      draw();
    }
  });

  /* Dynamic copyright year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Newsletter form: front-end confirmation (wire to provider on launch) */
  document.querySelectorAll(".newsletter-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.parentElement.querySelector(".form-confirm");
      if (note) {
        note.textContent = "Confirmed — you're on the briefing list.";
        note.style.display = "block";
      }
      form.reset();
    });
  });
})();
