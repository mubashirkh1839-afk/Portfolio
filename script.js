// ==========================================================================
// PORTFOLIO SCRIPTS
// Responsive nav, smooth scroll spy, project filter, reveal & email AJAX
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Scroll Spy Navigation Highlight
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute('href');
      return href && href.startsWith('#') ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  function setActiveNav() {
    const scrollPosition = window.scrollY + 120;
    let currentSection = 'home';

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentSection}`;
      link.classList.toggle('active', isActive);
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  // 3. Project Filter Buttons
  const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((b) => b.classList.toggle('active', b === button));

        projectCards.forEach((card) => {
          const cardCategory = card.dataset.category;
          const show = filter === 'all' || cardCategory === filter;
          card.classList.toggle('hidden', !show);
          if (show) {
            card.classList.add('visible');
          }
        });
      });
    });
  }

  // 4. Scroll Reveal Intersection Observer
  const revealItems = Array.from(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach((element) => observer.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add('visible'));
  }

  // 5. Direct Email Form Submission (AJAX via FormSubmit to mubashirkh1839@gmail.com)
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!submitBtn || !formStatus) return;

      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span>';
      formStatus.className = 'form-status';
      formStatus.style.display = 'none';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (response.ok) {
          formStatus.textContent = '✨ Thank you! Your message has been sent directly to Mubashir\'s inbox. I will reply shortly!';
          formStatus.className = 'form-status success';
          formStatus.style.display = 'block';
          contactForm.reset();
        } else {
          throw new Error('Form submission failed.');
        }
      } catch (err) {
        formStatus.textContent = '⚠️ Message could not be sent directly. Please email me at mubashirkh1839@gmail.com';
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  // 6. Magnetic Glow Cursor
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);
  }

  // 7. Copy Email to Clipboard
  const btnCopyEmail = document.getElementById('btn-copy-email');
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('mubashirkh1839@gmail.com');
        btnCopyEmail.textContent = 'Copied! ✓';
        btnCopyEmail.classList.add('copied');
        setTimeout(() => {
          btnCopyEmail.textContent = 'Copy';
          btnCopyEmail.classList.remove('copied');
        }, 2200);
      } catch (e) {
        window.location.href = 'mailto:mubashirkh1839@gmail.com';
      }
    });
  }

  // 8. Command Palette (Ctrl+K or ⌘K)
  const cmdBackdrop = document.getElementById('cmd-backdrop');
  const cmdInput = document.getElementById('cmd-input');
  const cmdTrigger = document.getElementById('btn-cmd-trigger');
  const cmdItems = document.querySelectorAll('.cmd-item');

  function openCmd() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.add('open');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
  }

  function closeCmd() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove('open');
  }

  if (cmdTrigger) cmdTrigger.addEventListener('click', openCmd);
  if (cmdBackdrop) {
    cmdBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdBackdrop) closeCmd();
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdBackdrop && cmdBackdrop.classList.contains('open')) {
        closeCmd();
      } else {
        openCmd();
      }
    } else if (e.key === 'Escape' && cmdBackdrop && cmdBackdrop.classList.contains('open')) {
      closeCmd();
    }
  });

  const actions = {
    resume: () => {
      window.open('Mubashir_Ahmad_Resume.pdf', '_blank');
      closeCmd();
    },
    projects: () => {
      document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
      closeCmd();
    },
    github: () => {
      window.open('https://github.com/mubashirkh1839-afk', '_blank');
      closeCmd();
    },
    leetcode: () => {
      window.open('https://leetcode.com/u/mubashirkh_1839/', '_blank');
      closeCmd();
    },
    linkedin: () => {
      window.open('https://www.linkedin.com/in/mubashir-ahmad-92167a363', '_blank');
      closeCmd();
    },
    contact: () => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      closeCmd();
    }
  };

  cmdItems.forEach((item) => {
    item.addEventListener('click', () => {
      const cmd = item.dataset.cmd;
      if (actions[cmd]) actions[cmd]();
    });
  });

  if (cmdInput) {
    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = cmdInput.value.trim().toLowerCase();
        if (actions[val]) {
          actions[val]();
        } else {
          // Default search match
          const match = Array.from(cmdItems).find((item) => item.dataset.cmd.includes(val) || item.textContent.toLowerCase().includes(val));
          if (match && actions[match.dataset.cmd]) {
            actions[match.dataset.cmd]();
          }
        }
      }
    });
  }
});

