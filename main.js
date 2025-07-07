
    function toggleMenu() {
      const navMenu = document.getElementById('navMenu');
      const icon = document.querySelector('.menu-icon');

      navMenu.classList.toggle('show');

      // Toggle icon (optional)
      icon.textContent = navMenu.classList.contains('show') ? '✖' : '☰';
    }
 
    let lastScrollTop = 0;
    const headerWrapper = document.getElementById('headerWrapper');

    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scrolling down
        headerWrapper.classList.add('hide-header');
      } else {
        // Scrolling up
        headerWrapper.classList.remove('hide-header');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
 const features = document.querySelectorAll('.feature-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-feature');
          observer.unobserve(entry.target); // only animate once
        }
      });
    }, {
      threshold: 0.3
    });

    features.forEach(item => {
      observer.observe(item);
    });

    const slides = document.querySelectorAll('.slide');
  const slidesWrapper = document.querySelector('.slides');
  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideDuration = 5000; // 5 seconds

  function showSlide(index) {
    slidesWrapper.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, i) => {
      const img = slide.querySelector('img');
      const caption = slide.querySelector('.caption');

      // Remove all animation classes
      img.classList.remove('animate-img');
      caption.classList.remove('animate-caption-in');
      caption.classList.remove('animate-caption-out');

      // Animate out only if not current slide
      if (i !== index) {
        caption.classList.add('animate-caption-out');
      }
    });

    // Animate in current slide caption
    const currentSlide = slides[index];
    const currentImg = currentSlide.querySelector('img');
    const currentCaption = currentSlide.querySelector('.caption');

    void currentImg.offsetWidth;     // trigger reflow
    void currentCaption.offsetWidth;

    currentImg.classList.add('animate-img');
    currentCaption.classList.add('animate-caption-in');
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  }

  // Initial start
  showSlide(currentIndex);
  setInterval(nextSlide, slideDuration);
  const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    function animateCounters() {
      if (hasAnimated) return;

      const statsSection = document.querySelector('.stats');
      const sectionPos = statsSection.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;

      if (sectionPos < screenHeight - 100) {
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          let count = 0;

          const step = Math.ceil(target / 60); // Medium speed
          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              counter.innerText = target;
              clearInterval(interval);
            } else {
              counter.innerText = count;
            }
          }, 20); // Speed step
        });

        hasAnimated = true;
      }
    }

    window.addEventListener('scroll', animateCounters);

     window.addEventListener('load', () => {
    const track = document.querySelector('.carousel-track');
    const dots = document.querySelectorAll('.dot');
    const originalCards = Array.from(track.children);
    const totalCards = originalCards.length;

    let index = 0;
    let cardWidth = 0;
    let interval;

    // Clone original cards once for seamless infinite effect
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    // Get current card width
    const updateCardWidth = () => {
      const card = document.querySelector('.service-card');
      cardWidth = card ? card.offsetWidth + 20 : 300;
    };

    // Sync dot with current slide
    const updateDots = (idx) => {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[idx % totalCards]?.classList.add('active');
    };

    // Move carousel
    const moveTo = (idx, animate = true) => {
      track.style.transition = animate ? 'transform 0.6s ease-in-out' : 'none';
      track.style.transform = `translateX(-${idx * cardWidth}px)`;
      updateDots(idx);
    };

    // Go to next slide
    const nextSlide = () => {
      index++;
      moveTo(index);

      if (index === totalCards) {
        setTimeout(() => {
          index = 0;
          moveTo(index, false);
        }, 600);
      }
    };

    // Start autoplay
    const startAutoplay = () => {
      return setInterval(nextSlide, 3000);
    };

    // Setup on load
    const init = () => {
      updateCardWidth();
      moveTo(index);
      interval = startAutoplay();

      // Pause/resume on card hover
      document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => clearInterval(interval));
        card.addEventListener('mouseleave', () => interval = startAutoplay());
      });

      // Dot click to jump
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const dotIndex = parseInt(dot.dataset.index);
          index = dotIndex;
          moveTo(index);
        });
      });
    };

    window.addEventListener('resize', () => {
      updateCardWidth();
      moveTo(index, false);
    });

    init();
  });
  