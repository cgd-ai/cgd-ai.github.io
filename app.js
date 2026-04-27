/* ==========================================================================
   app.js — page nav, lightbox, lazy fetches, dark mode, scroll progress
   ========================================================================== */
(function () {
    'use strict';

    // ----- helpers --------------------------------------------------------
    function el(tag, attrs, children) {
        const node = document.createElement(tag);
        if (attrs) {
            for (const k in attrs) {
                if (k === 'class') node.className = attrs[k];
                else if (k === 'text') node.textContent = attrs[k];
                else if (k === 'html') node.innerHTML = attrs[k]; // only with trusted constants
                else if (k === 'onClick') node.addEventListener('click', attrs[k]);
                else if (attrs[k] != null) node.setAttribute(k, attrs[k]);
            }
        }
        if (children) {
            (Array.isArray(children) ? children : [children]).forEach(function (c) {
                if (c == null) return;
                node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
            });
        }
        return node;
    }

    function safeLink(href, text, cls) {
        const a = el('a', { href: href || '#', class: cls || '' });
        a.textContent = text || '';
        return a;
    }

    // For author-controlled trusted HTML strings (titles with <i>, authors with <b>/<a>, etc.)
    function htmlLink(href, htmlStr, cls) {
        const a = el('a', { href: href || '#', class: cls || '' });
        a.innerHTML = htmlStr || '';
        return a;
    }

    function skeleton(lines) {
        const wrap = el('div', { class: 'skeleton-wrap', 'aria-busy': 'true', 'aria-live': 'polite' });
        for (let i = 0; i < lines; i++) wrap.appendChild(el('div', { class: 'skeleton-line' }));
        return wrap;
    }

    function showError(container, message) {
        container.innerHTML = '';
        container.appendChild(el('div', { class: 'error', text: message }));
    }

    // ----- page navigation -----------------------------------------------
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const navBtns = document.querySelectorAll('.nav-btn');
        const pageSections = document.querySelectorAll('.page-section');
        let isTransitioning = false;
        const FADE_OUT_MS = 180;

        function scrollToSection() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function showSection(sectionId, scrollToTop) {
            if (scrollToTop === undefined) scrollToTop = true;
            if (isTransitioning) return;
            const target = document.getElementById(sectionId);
            if (!target) return;

            navLinks.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + sectionId);
            });

            const visible = Array.from(pageSections).find(function (s) {
                return s.style.display !== 'none' && getComputedStyle(s).display !== 'none';
            });

            if (visible === target) {
                if (scrollToTop) scrollToSection();
                return;
            }

            const doSwap = function () {
                pageSections.forEach(function (s) {
                    s.style.display = 'none';
                    s.classList.remove('is-leaving');
                });
                target.style.display = 'block';
                void target.offsetWidth;
                if (scrollToTop) scrollToSection();
                isTransitioning = false;
            };

            if (visible) {
                isTransitioning = true;
                visible.classList.add('is-leaving');
                setTimeout(doSwap, FADE_OUT_MS);
            } else {
                doSwap();
            }
        }

        function handleHashChange() {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) showSection(hash);
            else showSection('home');
        }

        const initialHash = window.location.hash.substring(1);
        if (initialHash && document.getElementById(initialHash)) showSection(initialHash);
        else showSection('home', false);

        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleHashChange);

        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                document.querySelector('.nav-menu').classList.remove('active');
                if (history.pushState) history.pushState(null, null, '#' + targetId);
                else window.location.hash = '#' + targetId;
                showSection(targetId);
            });
        });

        navBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetId = this.getAttribute('data-target');
                if (history.pushState) history.pushState(null, null, '#' + targetId);
                else window.location.hash = '#' + targetId;
                showSection(targetId);
            });
        });

        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.nav-menu');
        if (toggle && menu) {
            toggle.addEventListener('click', function () {
                menu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    }

    // ----- back-to-top with scroll progress ring -------------------------
    function initBackToTop() {
        const btn = document.querySelector('.back-to-top');
        if (!btn) return;

        // inject SVG progress ring once
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'back-to-top-ring');
        svg.setAttribute('viewBox', '0 0 44 44');
        svg.setAttribute('aria-hidden', 'true');
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', '22');
        circle.setAttribute('cy', '22');
        circle.setAttribute('r', '20');
        const C = 2 * Math.PI * 20;
        circle.setAttribute('stroke-dasharray', String(C));
        circle.setAttribute('stroke-dashoffset', String(C));
        svg.appendChild(circle);
        btn.insertBefore(svg, btn.firstChild);

        let ticking = false;
        function update() {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            const pct = max > 0 ? Math.min(1, h.scrollTop / max) : 0;
            circle.setAttribute('stroke-dashoffset', String(C * (1 - pct)));
            btn.classList.toggle('visible', h.scrollTop > 300);
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ----- lightbox -------------------------------------------------------
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;
        const lightboxImg = document.getElementById('lightbox-img');
        let lastFocus = null;

        function open(src, alt) {
            lastFocus = document.activeElement;
            lightboxImg.src = src;
            lightboxImg.alt = alt || '';
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            const closeBtn = lightbox.querySelector('.lightbox-close');
            if (closeBtn) closeBtn.focus();
        }

        function close() {
            if (!lightbox.classList.contains('active')) return;
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
            if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
        }

        document.addEventListener('click', function (e) {
            const item = e.target.closest && e.target.closest('.photo-item');
            if (item) {
                const img = item.querySelector('img');
                if (img) open(img.src, img.alt);
            }
        });
        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.addEventListener('click', close);
        lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }

    // ----- collapsible toggle (papers BibTeX/Abstract) -------------------
    window.toggleDisplay = function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    };

    // ----- papers ---------------------------------------------------------
    function renderPapers(papers) {
        const container = document.getElementById('papers-container');
        if (!container) return;
        container.innerHTML = '';

        if (!papers || !papers.length) {
            showError(container, 'No publication data found');
            return;
        }

        const frag = document.createDocumentFragment();

        papers.forEach(function (paper, index) {
            const item = el('div', { class: 'publication-item', id: 'ref' + index });

            const title = el('h4', { class: 'paper-title' }, htmlLink(paper.link, paper.title, 'bluelink'));
            item.appendChild(title);

            if (paper.sub_title) {
                item.appendChild(el('p', { class: 'paper-subtitle' }, htmlLink(paper.link, paper.sub_title, 'bluelink')));
            }

            // Authors and venue can contain trusted HTML (e.g. <b>, <a> for co-authors)
            item.appendChild(el('p', { class: 'paper-authors', html: paper.authors || '' }));

            const venue = el('p', { class: 'paper-venue' });
            const ital = el('i');
            ital.appendChild(htmlLink(paper.venueLink, paper.venue, 'bluelink'));
            venue.appendChild(ital);
            if (paper.impact_factor) {
                venue.appendChild(el('span', { class: 'paper-if', text: 'IF: ' + paper.impact_factor }));
            }
            if (paper.rating) {
                const r = el('span', { class: 'paper-rating' }, htmlLink(paper.rating_link, paper.rating, 'bluelink'));
                venue.appendChild(r);
            }
            if (paper.award) {
                venue.appendChild(el('span', { class: 'paper-award', html: paper.award }));
            }
            item.appendChild(venue);

            const links = el('div', { class: 'paper-links' });
            const bibToggle = el('a', { class: 'paper-link', text: 'BibTeX' });
            bibToggle.addEventListener('click', function () { window.toggleDisplay('bib' + index); });
            links.appendChild(bibToggle);

            if (paper.abstract) {
                const absToggle = el('a', { class: 'paper-link', text: 'Abstract' });
                absToggle.addEventListener('click', function () { window.toggleDisplay('abs' + index); });
                links.appendChild(absToggle);
            }
            const linkSpecs = [
                ['pdf', 'PDF'], ['pdf2', 'PDF2'], ['demo', 'Demo'], ['slides', 'Slides'],
                ['awardDoc', 'Award'], ['youTube', 'YouTube'], ['bili1', 'Bilibili'], ['bili2', 'Bilibili_2']
            ];
            linkSpecs.forEach(function (spec) {
                if (paper[spec[0]]) links.appendChild(safeLink(paper[spec[0]], spec[1], 'paper-link'));
            });
            item.appendChild(links);

            // bibtex is plain text (preserve line breaks via white-space CSS, no HTML)
            const bib = el('div', { id: 'bib' + index, class: 'paper-collapsible', style: 'display:none', text: paper.bibtex || '' });
            item.appendChild(bib);

            if (paper.abstract) {
                const abs = el('div', { id: 'abs' + index, class: 'paper-collapsible', style: 'display:none' });
                let absHtml = '<b>Abstract:</b> ' + (paper.abstract || '');
                if (paper.keywords) {
                    absHtml += '<br><b>Keywords:</b> ' + paper.keywords;
                }
                abs.innerHTML = absHtml;
                item.appendChild(abs);
            }

            frag.appendChild(item);
        });

        container.appendChild(frag);
    }

    function loadPapers() {
        const container = document.getElementById('papers-container');
        if (!container) return Promise.resolve();
        container.innerHTML = '';
        container.appendChild(skeleton(6));
        return fetch('papers.json')
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(renderPapers)
            .catch(function (err) {
                showError(container, 'Could not load publications: ' + err.message);
            });
    }

    // ----- patents --------------------------------------------------------
    function renderPatents(data) {
        const list = document.getElementById('patent-list');
        const toggleBtn = document.getElementById('patent-toggle-btn');
        const hiddenCountSpan = document.getElementById('hidden-patent-count');
        if (!list || !data || !data.patents) return;
        list.innerHTML = '';
        const INITIAL = 5;
        const AWARD_URL = 'https://www.patentguru.com/cn/CN117950401B';

        data.patents.forEach(function (patent, index) {
            const item = el('div', { class: 'patent-item' });
            if (index >= INITIAL) item.classList.add('patent-item-hidden');

            item.appendChild(el('div', { class: 'patent-number', text: (index + 1) + '.' }));

            const content = el('div', { class: 'patent-content' });
            content.appendChild(htmlLink(patent.url, patent.title, 'patent-title bluelink'));

            const meta = el('div', { class: 'patent-meta' });
            if (patent.url === AWARD_URL) {
                meta.appendChild(el('span', { class: 'patent-award-badge', text: '🏆 NetEase’s Top 10 Patents (2025)' }));
            }
            const patentNumber = (patent.url || '').split('/').pop();
            meta.appendChild(el('span', { class: 'patent-id', text: patentNumber }));
            content.appendChild(meta);

            item.appendChild(content);
            list.appendChild(item);
        });

        if (data.patents.length > INITIAL && toggleBtn && hiddenCountSpan) {
            const hiddenCount = data.patents.length - INITIAL;
            hiddenCountSpan.textContent = hiddenCount;
            toggleBtn.style.display = 'block';
            let expanded = false;
            toggleBtn.addEventListener('click', function () {
                expanded = !expanded;
                document.querySelectorAll('.patent-item-hidden').forEach(function (it) {
                    it.style.display = expanded ? 'flex' : 'none';
                });
                if (expanded) {
                    toggleBtn.textContent = 'Show Less';
                } else {
                    toggleBtn.innerHTML = '';
                    toggleBtn.appendChild(document.createTextNode('Show More ('));
                    const span = el('span', { id: 'hidden-patent-count', text: String(hiddenCount) });
                    toggleBtn.appendChild(span);
                    toggleBtn.appendChild(document.createTextNode(')'));
                }
            });
        }
    }

    function loadPatents() {
        const list = document.getElementById('patent-list');
        if (!list) return Promise.resolve();
        list.innerHTML = '';
        list.appendChild(skeleton(3));
        return fetch('patents.yaml')
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
            .then(function (txt) {
                if (typeof jsyaml === 'undefined') throw new Error('YAML parser not loaded');
                renderPatents(jsyaml.load(txt));
            })
            .catch(function (err) {
                showError(list, 'Could not load patents: ' + err.message);
            });
    }

    // ----- reviewers ------------------------------------------------------
    function renderReviewers(data) {
        const container = document.getElementById('reviewers-container');
        if (!container || !data || !data.reviewers) return;
        container.innerHTML = '';

        const categoryMap = {
            'Robotics': '🤖 ROBOTICS',
            'AI': '🧠 COMPUTER SCIENCE, ARTIFICIAL INTELLIGENCE',
            'Control': '⚙️ AUTOMATION & CONTROL SYSTEMS',
            'Engineering': '🏗️ ENGINEERING, INDUSTRIAL',
            'MDPI': '📖 MDPI Journals'
        };
        const order = ['Robotics', 'AI', 'Control', 'Engineering', 'MDPI'];

        const grouped = {};
        data.reviewers.forEach(function (r) {
            const cat = r.category || 'Other';
            (grouped[cat] = grouped[cat] || []).push(r);
        });

        const categories = order.filter(function (c) { return grouped[c]; });
        Object.keys(grouped).forEach(function (c) {
            if (categories.indexOf(c) === -1) categories.push(c);
        });

        categories.forEach(function (cat) {
            const sub = el('div', { class: 'reviewer-subcategory' });
            sub.appendChild(el('h5', { class: 'reviewer-subcategory-title', text: categoryMap[cat] || cat }));
            const tags = el('div', { class: 'reviewer-tags' });
            grouped[cat].forEach(function (r) {
                tags.appendChild(safeLink(r.url, r.name, 'bluelink bb'));
            });
            sub.appendChild(tags);
            container.appendChild(sub);
        });
    }

    function loadReviewers() {
        const container = document.getElementById('reviewers-container');
        if (!container) return Promise.resolve();
        container.innerHTML = '';
        container.appendChild(skeleton(2));
        return fetch('reviewers.yaml')
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
            .then(function (txt) {
                if (typeof jsyaml === 'undefined') throw new Error('YAML parser not loaded');
                renderReviewers(jsyaml.load(txt));
            })
            .catch(function (err) {
                showError(container, 'Could not load reviewers: ' + err.message);
            });
    }

    // ----- dark mode toggle ---------------------------------------------
    function initThemeToggle() {
        const KEY = 'cgd-theme';
        const root = document.documentElement;

        function apply(theme) {
            root.setAttribute('data-theme', theme);
            const btn = document.querySelector('.theme-toggle');
            if (btn) {
                btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
                btn.textContent = theme === 'dark' ? '☀' : '☾';
            }
        }

        const stored = (function () {
            try { return localStorage.getItem(KEY); } catch (e) { return null; }
        })();
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        apply(stored || (prefersDark ? 'dark' : 'light'));

        const btn = document.querySelector('.theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                const cur = root.getAttribute('data-theme');
                const next = cur === 'dark' ? 'light' : 'dark';
                apply(next);
                try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
            });
        }
    }

    // ----- bootstrap ------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        initThemeToggle();
        initNavigation();
        initBackToTop();
        initLightbox();
        // fire data fetches in parallel
        loadPapers();
        loadPatents();
        loadReviewers();
    });
})();
