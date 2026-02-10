/* ============================================================
   OpenClaw Intelligence — Site JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll-aware nav ----
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ---- Intersection Observer for animations ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .stagger').forEach(el => observer.observe(el));

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ---- Chatbot toggle ----
  const chatToggle = document.querySelector('.chatbot-toggle');
  const chatWindow = document.querySelector('.chatbot-window');
  const chatClose = document.querySelector('.chatbot-close');
  
  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
    });
    if (chatClose) {
      chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('open');
      });
    }
  }

  // ---- Chatbot demo interaction ----
  const chatInput = document.querySelector('.chatbot-input input');
  const chatSend = document.querySelector('.chatbot-input button');
  const chatBody = document.querySelector('.chatbot-body');

  function addBotMsg(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--bot';
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addUserMsg(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--user';
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  const responses = {
    'pricing': 'We offer three plans: Starter ($299/mo), Growth ($799/mo), and Enterprise (custom). Each includes OpenClaw agent deployment, monitoring, and support. Visit our Pricing page for details.',
    'openclaw': 'OpenClaw is an open-source AI agent platform that lets you automate business processes. We deploy and manage it for you — no coding required.',
    'security': 'Security is our top priority. All agents run in isolated environments with encrypted credentials, least-privilege permissions, and GDPR-compliant data handling.',
    'get started': 'Getting started is easy: 1) Book a free consultation, 2) We run an Automation Audit of your business, 3) We deploy your first agents within 48 hours. Click "Get Started" to book your call.',
    'automation': 'We automate operations, sales, marketing, finance, customer service, and IT processes. Common automations include email triage, meeting scheduling, proposal generation, and client communications.',
    'default': 'I can help you with questions about our services, pricing, OpenClaw technology, security practices, or getting started. What would you like to know?'
  };

  function handleChat() {
    if (!chatInput || !chatInput.value.trim()) return;
    const userText = chatInput.value.trim();
    addUserMsg(userText);
    chatInput.value = '';

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let response = responses.default;
      for (const [key, val] of Object.entries(responses)) {
        if (key !== 'default' && lower.includes(key)) {
          response = val;
          break;
        }
      }
      addBotMsg(response);
    }, 600);
  }

  if (chatSend) {
    chatSend.addEventListener('click', handleChat);
  }
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleChat();
    });
  }

  // ---- Mobile nav ----
  const mobileToggle = document.querySelector('.nav__mobile');
  const navLinks = document.querySelector('.nav__links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'var(--bg-secondary)';
      navLinks.style.flexDirection = 'column';
      navLinks.style.padding = 'var(--space-xl)';
      navLinks.style.borderBottom = '1px solid var(--border)';
    });
  }

  // ---- Counter animation ----
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCount(el, target, suffix);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  function animateCount(el, target, suffix) {
    const duration = 1500;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

});
