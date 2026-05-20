
document.addEventListener('DOMContentLoaded', () => {

    setupMobileNav();
    setupDarkMode();
    observeSections();
    setupFormValidation();
    initSmoothScroll();
    createParticles();
    init3DElements();
    animateSkillBadges();
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      if (window.scrollY > 100) {
        header.style.padding = '0.5rem 0';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.1)';
      }
    });
  });
  
  function setupMobileNav() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuButton || !mobileMenu) return;
    
    menuButton.addEventListener('click', () => {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      
      mobileMenu.classList.toggle('active');
      mobileMenu.classList.toggle('hidden');
      
      const bars = menuButton.querySelectorAll('.bar');
      if (isExpanded) {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      } else {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      }
    });
    
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        
        mobileMenu.classList.remove('active');
        mobileMenu.classList.add('hidden');
        
        const bars = menuButton.querySelectorAll('.bar');
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      });
    });
  }
  function setupDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (savedTheme === 'dark') {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
    }
    themeToggle.addEventListener('click', () => {

      body.classList.add('theme-transition');
      
      if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      }
      
      setTimeout(() => {
        body.classList.remove('theme-transition');
      }, 500);
    });
  }
  
  function observeSections() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animationType = entry.target.dataset.animation || 'fade-in';
            entry.target.classList.add(animationType);
            
            if (entry.target.classList.contains('counter')) {
              animateCounter(entry.target);
            }
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
  
      if (el.classList.contains('stagger')) {
        const delay = Math.random() * 0.5; 
        el.style.animationDelay = `${delay}s`;
      }
      observer.observe(el);
    });
  }
  
  function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16); 
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      element.textContent = Math.floor(current);
      
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }
  function setupFormValidation() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
    const config = window.CONTACT_CONFIG || {};
    
    const formElements = form.querySelectorAll('#name, #email, #message');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');
    const btnText = submitButton?.querySelector('.btn-text');
    const honeypot = document.getElementById('botcheck');

    formElements.forEach((element) => {
      element.addEventListener('focus', () => {
        element.parentElement.classList.add('focused');
      });
      
      element.addEventListener('blur', () => {
        if (!element.value) {
          element.parentElement.classList.remove('focused');
        }
      });

      element.addEventListener('input', () => {
        clearFieldError(element);
      });
    });

    function clearFieldError(input) {
      input.classList.remove('invalid');
      const errorId = `${input.id}-error`;
      const error = document.getElementById(errorId);
      if (error) {
        error.textContent = '';
        error.classList.remove('visible');
      }
    }

    function showFieldError(input, message) {
      input.classList.add('invalid');
      const error = document.getElementById(`${input.id}-error`);
      if (error) {
        error.textContent = message;
        error.classList.add('visible');
      }
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
    }

    function clearFormStatus() {
      if (!formStatus) return;
      formStatus.hidden = true;
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }

    function showFormStatus(type, message) {
      if (!formStatus) return;
      const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
      formStatus.hidden = false;
      formStatus.className = `form-status ${type}`;

      const messageEl = document.createElement('span');
      messageEl.textContent = message;

      formStatus.replaceChildren(
        Object.assign(document.createElement('i'), { className: `fas ${icon}` }),
        messageEl
      );
    }

    function setLoading(isLoading) {
      if (!submitButton || !btnText) return;
      submitButton.disabled = isLoading;
      btnText.innerHTML = isLoading
        ? '<i class="fas fa-spinner fa-spin"></i> Sending...'
        : 'Send Message';
    }

    function isAccessKeyConfigured() {
      return (
        config.accessKey &&
        config.accessKey !== 'YOUR_ACCESS_KEY_HERE'
      );
    }

    function validateForm() {
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      let valid = true;

      document.querySelectorAll('.error-message').forEach((el) => {
        el.textContent = '';
        el.classList.remove('visible');
      });
      formElements.forEach((el) => el.classList.remove('invalid'));

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!name) {
        showFieldError(nameInput, 'Name is required');
        valid = false;
      } else if (name.length < 2) {
        showFieldError(nameInput, 'Name must be at least 2 characters');
        valid = false;
      }

      if (!email) {
        showFieldError(emailInput, 'Email is required');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        valid = false;
      }

      if (!message) {
        showFieldError(messageInput, 'Message is required');
        valid = false;
      } else if (message.length < 10) {
        showFieldError(messageInput, 'Message must be at least 10 characters');
        valid = false;
      }

      return valid ? { name, email, message } : null;
    }
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormStatus();

      if (honeypot && honeypot.value) {
        return;
      }

      const formData = validateForm();
      if (!formData) return;

      if (!isAccessKeyConfigured()) {
        showFormStatus(
          'error',
          'Contact form is not configured yet. Add your free Web3Forms access key in contact-config.js (get one at web3forms.com).'
        );
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(WEB3FORMS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: config.accessKey,
            subject: `Portfolio Contact from ${formData.name}`,
            from_name: formData.name,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            botcheck: '',
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || 'Unable to send your message. Please try again.'
          );
        }

        form.reset();
        formElements.forEach((el) => el.parentElement.classList.remove('focused'));
        showFormStatus(
          'success',
          'Your message has been sent successfully! I will get back to you soon.'
        );
      } catch (error) {
        const fallbackEmail = config.recipientEmail || 'abduselammiz6@gmail.com';
        showFormStatus(
          'error',
          `${error.message || 'Something went wrong.'} You can also email me directly at ${fallbackEmail}.`
        );
      } finally {
        setLoading(false);
      }
    });
  }
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.getElementById('header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          setTimeout(() => {
            targetElement.classList.add('highlight-section');
            setTimeout(() => targetElement.classList.remove('highlight-section'), 1000);
          }, 500);
        }
      });
    });
  }
  function createParticles() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    const animatedBg = document.createElement('div');
    animatedBg.className = 'animated-bg';
    heroSection.appendChild(animatedBg);
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 30 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
      
      animatedBg.appendChild(particle);
    }
  }
  function init3DElements() {
    document.querySelectorAll('.service-icon').forEach(icon => {
      icon.classList.add('icon-3d');
    });
    
    document.querySelectorAll('.project-card, .service-card').forEach((element, index) => {
      if (index % 2 === 0) {
        element.classList.add('floating');
        element.style.animationDelay = `${index * 0.2}s`;
      }
    });
    
    document.querySelectorAll('h1').forEach(heading => {
      heading.classList.add('text-3d');
    });
    
    document.querySelectorAll('.project-card, .service-card').forEach(card => {
      card.addEventListener('mousemove', handleCardMove);
      card.addEventListener('mouseleave', resetCardPosition);
    });
  }
  
  
  function handleCardMove(e) {
    const card = this;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const angleX = (y - centerY) / 20;
    const angleY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'transform 0.1s';
    

    const glare = card.querySelector('.card-glare') || document.createElement('div');
    if (!card.querySelector('.card-glare')) {
      glare.className = 'card-glare';
      glare.style.position = 'absolute';
      glare.style.top = '0';
      glare.style.left = '0';
      glare.style.width = '100%';
      glare.style.height = '100%';
      glare.style.borderRadius = 'inherit';
      glare.style.pointerEvents = 'none';
      glare.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)';
      glare.style.zIndex = '1';
      card.appendChild(glare);
    } else {
      glare.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)';
    }
  }
  
  
  function resetCardPosition() {
    this.style.transform = '';
    this.style.transition = 'transform 0.5s var(--transition-bounce)';
    
    const glare = this.querySelector('.card-glare');
    if (glare) glare.remove();
  }
  

  function animateSkillBadges() {
    const badges = document.querySelectorAll('.skill-badge');
    
    badges.forEach((badge, index) => {
      badge.style.transitionDelay = `${index * 0.05}s`;
      
     
      badge.addEventListener('mouseenter', () => {

        const siblings = document.querySelectorAll('.skill-badge');
        siblings.forEach((sibling, siblingIndex) => {
          if (sibling !== badge) {
            const distance = Math.abs(index - siblingIndex);
            if (distance <= 2) {
              sibling.style.transform = `translateY(${-5 + distance * 2}px) scale(${1 - distance * 0.05})`;
            }
          }
        });
      });
      
      badge.addEventListener('mouseleave', () => {

        const siblings = document.querySelectorAll('.skill-badge');
        siblings.forEach(sibling => {
          if (sibling !== badge) {
            sibling.style.transform = '';
          }
        });
      });
    });
  }
  