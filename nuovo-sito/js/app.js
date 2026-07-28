(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    menuButton.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  };

  menuButton?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenu(false);
  });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const modal = document.getElementById('teacherModal');
  const modalDialog = modal?.querySelector('.modal__dialog');
  const modalClose = modal?.querySelector('.modal__close');
  const modalImage = modal?.querySelector('[data-modal-image]');
  const modalName = modal?.querySelector('[data-modal-name]');
  const modalRole = modal?.querySelector('[data-modal-role]');
  const modalDescription = modal?.querySelector('[data-modal-description]');
  const modalCourses = modal?.querySelector('[data-modal-courses]');
  let modalTrigger = null;

  const focusable = () => modalDialog?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') || [];

  const openTeacher = (card) => {
    if (!modal) return;
    modalTrigger = card;
    modalImage.src = card.dataset.image;
    modalImage.alt = card.dataset.imageAlt;
    modalName.textContent = card.dataset.name;
    modalRole.textContent = card.dataset.role;
    modalDescription.textContent = card.dataset.description;
    modalCourses.textContent = card.dataset.courses;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
    modalClose.focus({ preventScroll: true });
  };

  const closeTeacher = () => {
    if (!modal?.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
    modalTrigger?.focus({ preventScroll: true });
  };

  document.querySelectorAll('[data-teacher]').forEach((card) => card.addEventListener('click', () => openTeacher(card)));
  modalClose?.addEventListener('click', closeTeacher);
  modal?.querySelector('.modal__backdrop')?.addEventListener('click', closeTeacher);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeTeacher();
    if (event.key === 'Tab' && modal?.classList.contains('is-open')) {
      const items = [...focusable()];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    submit.disabled = true;
    submit.textContent = 'Invio in corso…';
    feedback.className = 'form-feedback hidden';
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      feedback.textContent = `Grazie ${data.get('name')}. Il messaggio è stato inviato.`;
      feedback.className = 'form-feedback success';
      form.reset();
    } catch (error) {
      console.error('Invio modulo non riuscito:', error);
      feedback.textContent = 'Non è stato possibile inviare il messaggio. Puoi contattarci su WhatsApp o riprovare più tardi.';
      feedback.className = 'form-feedback error';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Invia richiesta';
    }
  });

  const cookieNotice = document.getElementById('cookieNotice');
  const cookieButton = document.getElementById('cookieNoticeClose');
  if (cookieNotice && sessionStorage.getItem('yogaAlbanoCookieNotice') === 'seen') cookieNotice.remove();
  cookieButton?.addEventListener('click', () => {
    sessionStorage.setItem('yogaAlbanoCookieNotice', 'seen');
    cookieNotice.remove();
  });
})();
