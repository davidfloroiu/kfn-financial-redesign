#!/usr/bin/env python3
"""Compile the 11-page site into one self-contained preview HTML
(embedded fonts, hash routing) for hosting as a claude.ai artifact.
Usage: python3 tools/build-preview.py <fonts-dir> <out-file>
<fonts-dir> must contain fonts-manifest.json produced by the font-download step."""
import re, base64, json, sys, os

SITE = os.path.join(os.path.dirname(__file__), "..", "site")
FONTS_DIR, OUT = sys.argv[1], sys.argv[2]
PAGES = ["index","tax","accounting","cfo-services","business-management","business-ai",
         "about","work-with-us","tax-refund","privacy-policy","disclaimer"]

manifest = json.load(open(f"{FONTS_DIR}/fonts-manifest.json"))
font_css = []
for m in manifest:
    b64 = base64.b64encode(open(f"{FONTS_DIR}/{m['file']}","rb").read()).decode()
    block = m["block"]
    block = re.sub(r"src: url\([^)]+\) format\('woff2'\);",
                   f"src: url(data:font/woff2;base64,{b64}) format('woff2');", block)
    block = re.sub(r"\s*unicode-range:[^;]+;", "", block)
    font_css.append(block)
font_css = "\n".join(font_css)

main_css = open(f"{SITE}/css/main.css").read()

def rewrite_links(html, current):
    def repl(m):
        href = m.group(1)
        if href.startswith(("http","tel:","mailto:","data:")):
            return m.group(0)
        if href.endswith(".html"):
            return f'href="#/{href[:-5]}"'
        if ".html#" in href:
            page, anchor = href.split(".html#")
            return f'href="#/{page}/{anchor}"'
        if href.startswith("#"):
            return f'href="#/{current}/{href[1:]}"'
        return m.group(0)
    return re.sub(r'href="([^"]+)"', repl, html)

def extract(pat, text, flags=re.S):
    m = re.search(pat, text, flags)
    return m.group(1) if m else None

index_html = open(f"{SITE}/index.html").read()
chrome = {}
chrome["utility"] = extract(r'(<div class="utility-bar">.*?</div>\s*</div>)\s*\n\s*<!-- Header -->', index_html)
chrome["header"]  = extract(r'(<header class="site-header">.*?</header>)', index_html)
chrome["mobile"]  = extract(r'(<nav class="mobile-nav".*?</nav>)', index_html)
chrome["footer"]  = extract(r'(<footer class="site-footer">.*?</footer>)', index_html)
assert all(chrome.values()), "chrome extraction failed"
for k in chrome:
    chrome[k] = rewrite_links(chrome[k], "index").replace(' aria-current="page"', '')

def tag_pages(html):
    return re.sub(r'href="#/([^"]+)"',
                  lambda m: f'href="#/{m.group(1)}" data-page="{m.group(1).split("/")[0]}"', html)
chrome["header"] = tag_pages(chrome["header"])
chrome["mobile"] = tag_pages(chrome["mobile"])

templates, page_styles = [], []
for p in PAGES:
    html = open(f"{SITE}/{p}.html").read()
    main = extract(r'<main id="main">(.*?)</main>', html)
    assert main, f"no main in {p}"
    inner = rewrite_links(main, p)
    style = extract(r'<style>(.*?)</style>', html)
    if style and style.strip() not in [s.strip() for s in page_styles]:
        page_styles.append(style)
    title = extract(r'<title>(.*?)</title>', html).strip()
    templates.append(f'<template data-view="{p}" data-title="{title}">{inner}</template>')

router_js = open(os.path.join(os.path.dirname(__file__), "preview-router.js")).read()

out = f"""<title>KFN Financial — Website Redesign Preview</title>
<style>
{font_css}
{main_css}
{chr(10).join(page_styles)}
#view-root {{ display: block; }}
html {{ scroll-behavior: auto; }}
</style>
{chrome["utility"]}
{chrome["header"]}
{chrome["mobile"]}
<main id="main"><div id="view-root"></div></main>
{chrome["footer"]}
{''.join(templates)}
<script>
{router_js}
</script>
"""
open(OUT, "w").write(out)
print("written", len(out), "bytes ->", OUT)
