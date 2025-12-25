
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
    
    const formElements = form.querySelectorAll('input, textarea');
    formElements.forEach((element) => {
      element.addEventListener('focus', () => {
        element.parentElement.classList.add('focused');
      });
      
      element.addEventListener('blur', () => {
        if (!element.value) {
          element.parentElement.classList.remove('focused');
        }
      });
    });
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let valid = true;
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      document.querySelectorAll('.error-message').forEach((el) => {
        el.textContent = '';
        el.style.height = '0';
        el.style.opacity = '0';
      });
      
      if (!nameInput.value.trim()) {
        valid = false;
        const error = document.getElementById('name-error');
        if (error) {
          error.textContent = 'Name is required';
          error.style.height = 'auto';
          error.style.opacity = '1';
          nameInput.classList.add('shake');
          setTimeout(() => nameInput.classList.remove('shake'), 500);
        }
      }
      if (!emailInput.value.trim()) {
        valid = false;
        const error = document.getElementById('email-error');
        if (error) {
          error.textContent = 'Email is required';
          error.style.height = 'auto';
          error.style.opacity = '1';
          emailInput.classList.add('shake');
          setTimeout(() => emailInput.classList.remove('shake'), 500);
        }
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        valid = false;
        const error = document.getElementById('email-error');
        if (error) {
          error.textContent = 'Please enter a valid email';
          error.style.height = 'auto';
          error.style.opacity = '1';
          emailInput.classList.add('shake');
          setTimeout(() => emailInput.classList.remove('shake'), 500);
        }
      }
      
      if (!messageInput.value.trim()) {
        valid = false;
        const error = document.getElementById('message-error');
        if (error) {
          error.textContent = 'Message is required';
          error.style.height = 'auto';
          error.style.opacity = '1';
          messageInput.classList.add('shake');
          setTimeout(() => messageInput.classList.remove('shake'), 500);
        }
      }
      
      if (valid) {
        const submitButton = document.getElementById('submit-button');
        if (submitButton) {
          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
          submitButton.disabled = true;
        }
        
        setTimeout(() => {
          form.reset();
          formElements.forEach(el => el.parentElement.classList.remove('focused'));
          
          const successMessage = document.createElement('div');
          successMessage.className = 'p-4 bg-green-100 text-green-800 rounded-md mb-4 slide-in-top';
          successMessage.style.padding = '1rem';
          successMessage.style.backgroundColor = '#dcfce7';
          successMessage.style.color = '#166534';
          successMessage.style.borderRadius = '0.5rem';
          successMessage.style.marginBottom = '1rem';
          successMessage.style.transform = 'translateY(-20px)';
          successMessage.style.opacity = '0';
          successMessage.style.transition = 'all 0.5s ease';
          successMessage.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Your message has been sent successfully!';
          
          form.insertBefore(successMessage, form.firstChild);
          
          setTimeout(() => {
            successMessage.style.transform = 'translateY(0)';
            successMessage.style.opacity = '1';
          }, 10);
          
          if (submitButton) {
            submitButton.innerHTML = 'Send Message';
            submitButton.disabled = false;
          }
          
          setTimeout(() => {
            successMessage.style.transform = 'translateY(-20px)';
            successMessage.style.opacity = '0';
            
            setTimeout(() => {
              successMessage.remove();
            }, 500);
          }, 5000);
        }, 1500);
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
  