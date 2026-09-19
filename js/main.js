/**
 * Weburon - Digital Product Agency
 * Core JavaScript Engine & Interactive Components
 * Clean, hand-crafted, high-performance execution with Theme Support
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initStatsCounter();
  initPortfolio();
  initLiveClock();
  initContactForm();
  initEmailLinks();
});

/* ==========================================================================
   1. Dark / Light Mode Theme Engine
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('weburon-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('weburon-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Keyboard shortcut 'D' to toggle theme like Linear / Raycast
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'd' || e.key === 'D') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Obsidian Dark' : 'Paper Light'} Mode (Shortcut: D)`);
    }
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('weburon-theme', theme);

  const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
  toggleButtons.forEach((btn) => {
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      btn.setAttribute('title', 'Switch to Light Mode');
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      btn.setAttribute('title', 'Switch to Dark Mode');
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  });
}

/* ==========================================================================
   2. Sticky Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        mobileDrawer.classList.add('open');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ==========================================================================
   3. Numeric Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const isDecimal = target % 1 !== 0;

          let start = 0;
          const duration = 1200;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + (target - start) * easeOut;

            el.innerHTML = `${prefix}${isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)}<span class="highlight">${suffix}</span>`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  statNumbers.forEach((stat) => observer.observe(stat));
}

/* ==========================================================================
   4. Filterable Portfolio & Case Study Modals
   ========================================================================== */
const caseStudies = {
  aasamedchem: {
    title: 'Aasa Medchem - Enterprise B2B Pharma Marketplace',
    tag: 'B2B Marketplace & Chemical Supply Chain',
    client: 'Aasa Medchem (aasamedchem.com)',
    liveUrl: 'https://aasamedchem.com',
    metrics: '15+ Material Categories • Sub-1s Search • Real-Time RFQ',
    challenge: 'Procurement of Active Pharmaceutical Ingredients (APIs), excipients, and chemical intermediates across India historically relied on fragmented offline broker networks, non-standard pricing tiers, and manual telephone inquiries with 48+ hour quote turnaround times.',
    solution: 'Engineered a modern, high-performance Next.js B2B marketplace featuring instant chemical indexing (by CAS number, IP/BP pharmacopeial grade, and application), dynamic RFQ requisition desk, verified manufacturer directory, and edge-cached catalog search.',
    tech: ['Next.js 15', 'React', 'Chemical Indexing Engine', 'Tailwind CSS', 'Cloudflare Edge', 'Vercel'],
    outcome: 'Launched to national pharmaceutical buyers and chemical manufacturers, slashing procurement inquiry times from 48 hours to instant quote requests with 99.9% uptime.'
  },
  traveling_agent: {
    title: 'AI Travel Agent - Multi-Modal Mobility Co-Pilot',
    tag: 'Autonomous AI & Multi-Modal Routing',
    client: 'UberTransit AI (traveling-agent.vercel.app)',
    liveUrl: 'https://traveling-agent.vercel.app/',
    metrics: 'LangGraph Orchestration • Multi-Modal Transit • Sub-2s Route Engine',
    challenge: 'Intercity travel across India requires navigating disparate ticketing portals for flights, railways (IRCTC), and state highway buses, making multi-modal door-to-door journey planning painfully complex and fragmented for commuters.',
    solution: 'Architected a LangGraph-powered autonomous mobility agent combining deterministic transport schedules with AI-ranked multi-modal travel combinations, budget filtering, and route tradeoffs in real-time.',
    tech: ['Next.js 15', 'LangGraph', 'Python LLM Agent', 'Turbopack', 'Lucide UI', 'Vercel Edge'],
    outcome: 'Delivered seamless cross-modal trip calculations between major national corridors (Delhi, Patna, Mumbai, Goa, Bengaluru) with instantaneous corridor ranking and budget optimization.'
  },
  aayushman: {
    title: 'Aayushman Shikshan Sansthan - EdTech & Coaching Portal',
    tag: 'Educational Technology & Student LMS Platform',
    client: 'Aayushman Coaching (aayushman-sikshan-sansthan.vercel.app)',
    liveUrl: 'https://aayushman-sikshan-sansthan.vercel.app/',
    metrics: '500+ Board Exam Students • 95% Success Rate • 10+ Years Heritage',
    challenge: 'A premier coaching institute required modern digital infrastructure to replace manual paper-based attendance, streamline study material distribution for 40+ chapters, and provide parents with transparent attendance tracking.',
    solution: 'Developed a high-performance Next.js educational portal equipped with a student dashboard, downloadable subject notes repository (Physics, Chemistry, Maths, Biology), board blueprint resources, and instant parental alert triggers.',
    tech: ['Next.js 15', 'React', 'LMS Architecture', 'Tailwind CSS', 'PostgreSQL', 'Vercel Edge'],
    outcome: 'Empowered over 500 board examination students with 24/7 access to curated notes and gave parents real-time visibility into academic attendance and performance.'
  }
};

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const modalOverlay = document.getElementById('case-study-modal');
  const modalClose = document.getElementById('modal-close-btn');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  projectCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on an external live link, let browser follow it without opening modal
      if (e.target.closest('a')) {
        return;
      }

      const studyId = card.getAttribute('data-study');
      const data = caseStudies[studyId];
      if (data && modalOverlay) {
        populateModal(data);
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function populateModal(data) {
    document.getElementById('modal-project-title').textContent = data.title;
    document.getElementById('modal-client-name').textContent = data.client;
    document.getElementById('modal-metric-badge').textContent = data.metrics;
    document.getElementById('modal-challenge').textContent = data.challenge;
    document.getElementById('modal-solution').textContent = data.solution;
    document.getElementById('modal-outcome').textContent = data.outcome;

    const techContainer = document.getElementById('modal-tech-tags');
    techContainer.innerHTML = '';
    data.tech.forEach((t) => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = t;
      techContainer.appendChild(tag);
    });

    const liveBtn = document.getElementById('modal-live-btn');
    if (liveBtn) {
      if (data.liveUrl) {
        liveBtn.href = data.liveUrl;
        liveBtn.style.display = 'inline-flex';
        try {
          const host = new URL(data.liveUrl).hostname;
          liveBtn.innerHTML = `Launch Live Site (${host}) <span style="font-size: 14px;">&nearr;</span>`;
        } catch (_) {
          liveBtn.innerHTML = `Launch Live Site <span style="font-size: 14px;">&nearr;</span>`;
        }
      } else {
        liveBtn.style.display = 'none';
      }
    }
  }
}

/* ==========================================================================
   5. Live Agency Clock
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-agency-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hours = String(istTime.getHours()).padStart(2, '0');
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const seconds = String(istTime.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds} IST`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   6. Contact Form Real Transmission (Delivers to supportweburon@gmail.com)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('agency-inquiry-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const company = document.getElementById('contact-company') ? document.getElementById('contact-company').value.trim() : '';
    const phone = document.getElementById('contact-phone') ? document.getElementById('contact-phone').value.trim() : '';
    const message = document.getElementById('contact-message').value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      showToast('Please fill out all required fields (*).');
      return;
    }

    const checkedPills = form.querySelectorAll('input[name="services"]:checked');
    const selectedServices = Array.from(checkedPills).map((p) => p.value);

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `Sending to supportweburon@gmail.com...`;
    submitBtn.disabled = true;

    try {
      // Real email transmission using FormSubmit AJAX endpoint
      const response = await fetch('https://formsubmit.co/ajax/supportweburon@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Company: company || 'Not specified',
          Phone: phone || 'Not specified',
          Services: selectedServices.length ? selectedServices.join(', ') : 'Custom Engineering',
          ProjectBrief: message,
          _subject: `⚡ New Weburon Project Inquiry: ${name} (${company || 'New Lead'})`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json();

      if (response.ok || result.success === 'true' || result.success === true) {
        showToast(`✓ Inquiry delivered to supportweburon@gmail.com! We will review it within 2 hours.`);
        form.reset();

        const wantWhatsApp = confirm(`Inquiry received! Would you also like to open an instant WhatsApp chat on +91 9234413497?`);
        if (wantWhatsApp) {
          const waText = encodeURIComponent(`Hi Weburon Team! My name is ${name} (${email}). I just submitted an engineering inquiry for: ${selectedServices.join(', ') || 'Custom Development'}.`);
          window.open(`https://wa.me/919234413497?text=${waText}`, '_blank');
        }
      } else {
        throw new Error(result.message || 'Direct transmission error');
      }
    } catch (err) {
      console.warn('Direct FormSubmit failed, opening direct Gmail compose fallback:', err);
      const mailSubject = encodeURIComponent(`Project Inquiry: ${name} (${company || 'Weburon Lead'})`);
      const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\nPhone: ${phone}\nServices: ${selectedServices.join(', ')}\n\nProject Brief:\n${message}`);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=supportweburon@gmail.com&su=${mailSubject}&body=${mailBody}`;

      showToast(`Opening Gmail Web to send directly to supportweburon@gmail.com...`);
      window.open(gmailUrl, '_blank');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   7. Universal Email Link Handler (Clipboard Copy + Native Client + Gmail Web Fallback)
   ========================================================================== */
function initEmailLinks() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  const targetEmail = 'supportweburon@gmail.com';
  const defaultSubject = encodeURIComponent('New Engineering Brief - Weburon');
  const defaultBody = encodeURIComponent('Hi Weburon Leadership,\n\nI would like to discuss an engineering project with your team.\n\nProject Details:\n- Timeline:\n- Key Requirements:\n\nLooking forward to speaking soon!');
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${defaultSubject}&body=${defaultBody}`;

  emailLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // If user holds Ctrl/Cmd, allow default browser behavior
      if (e.metaKey || e.ctrlKey) return;

      // Copy email to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(targetEmail).catch(() => {});
      }

      // Show toast with copy confirmation and 1-click Gmail Web action button
      const actionButton = `<a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" style="background: var(--btn-primary-bg); color: var(--btn-primary-text); padding: 5px 12px; border-radius: 4px; font-size: 11.5px; font-weight: 700; text-decoration: none; white-space: nowrap; margin-left: 8px; display: inline-block;">Open in Gmail ↗</a>`;
      showToast(`Copied <strong>${targetEmail}</strong>!`, actionButton);

      // On mobile devices, mailto is native; on desktop, trigger mailto while toast provides Gmail Web
      window.location.href = `mailto:${targetEmail}?subject=${defaultSubject}&body=${defaultBody}`;
    });
  });
}

/* ==========================================================================
   8. Toast Notification Helper
   ========================================================================== */
function showToast(message, actionHtml = '') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="color: var(--emerald); font-weight: 800; font-size: 15px;">✓</span>
        <span>${message}</span>
      </div>
      ${actionHtml}
    </div>
  `;

  toast.classList.add('show');

  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, actionHtml ? 7000 : 4000);
}
