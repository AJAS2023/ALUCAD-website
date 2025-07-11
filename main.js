document.addEventListener("DOMContentLoaded", function () {
  /**
   * Mobile Menu Toggle
   */
  const navMenu = document.getElementById('navMenu');
  const menuIcon = document.querySelector('.menu-icon');

  if (menuIcon) {
    menuIcon.addEventListener('click', function () {
      navMenu.classList.toggle('show');
      this.textContent = navMenu.classList.contains('show') ? '✖' : '☰';
    });
  }

  /**
   * Hide Header on Scroll Down
   */
  const headerWrapper = document.getElementById('headerWrapper');
  if (headerWrapper) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > headerWrapper.offsetHeight) {
        // Scrolling down
        headerWrapper.classList.add('hide-header');
      } else {
        // Scrolling up
        headerWrapper.classList.remove('hide-header');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  /**
   * Animated Counter with Intersection Observer
   */
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const animateCounters = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.counter');
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const updateCount = () => {
              const increment = target / 100; // Animation speed
              count += increment;
              if (count < target) {
                counter.innerText = Math.ceil(count);
                requestAnimationFrame(updateCount);
              } else {
                counter.innerText = target;
              }
            };
            updateCount();
          });
          observer.unobserve(entry.target); // Animate only once
        }
      });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
      threshold: 0.5
    });
    counterObserver.observe(statsSection);
  }

  /**
   * Hero Slider
   */
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.hero-slider .dot');
  if (slides.length > 0) {
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds per slide

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
      });
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentSlide = parseInt(dot.dataset.index);
        showSlide(currentSlide);
      });
    });

    setInterval(nextSlide, slideInterval);
    showSlide(0); // Initialize first slide
  }

  /**
   * Services Carousel (Infinite Scroll)
   */
  const carouselTrack = document.querySelector('.carousel-track');
  if (carouselTrack) {
    const originalCards = Array.from(carouselTrack.children);
    const totalOriginalCards = originalCards.length;
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let autoPlayInterval;

    // Clone cards for infinite loop effect
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      carouselTrack.appendChild(clone);
    });

    // Create dots
    for(let i = 0; i < totalOriginalCards; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    }
    const carouselDots = dotsContainer.querySelectorAll('.dot');


    const updateCarousel = (animate = true) => {
      const cardWidth = carouselTrack.querySelector('.service-card').offsetWidth;
      const marginRight = parseInt(window.getComputedStyle(carouselTrack.querySelector('.service-card')).marginRight);
      const totalWidth = cardWidth + marginRight;

      carouselTrack.style.transition = animate ? 'transform 0.7s ease-in-out' : 'none';
      carouselTrack.style.transform = `translateX(-${currentIndex * totalWidth}px)`;

      // Update active dot
      carouselDots.forEach(d => d.classList.remove('active'));
      carouselDots[currentIndex % totalOriginalCards].classList.add('active');
    };

    const handleNext = () => {
      currentIndex++;
      updateCarousel();

      if (currentIndex === totalOriginalCards) {
        setTimeout(() => {
          currentIndex = 0;
          updateCarousel(false);
        }, 700);
      }
    };

    const startAutoplay = () => {
        autoPlayInterval = setInterval(handleNext, 3000);
    };

    const stopAutoplay = () => {
        clearInterval(autoPlayInterval);
    };

    carouselTrack.addEventListener('mouseenter', stopAutoplay);
    carouselTrack.addEventListener('mouseleave', startAutoplay);

    dotsContainer.addEventListener('click', e => {
        if(e.target.classList.contains('dot')) {
            currentIndex = parseInt(e.target.dataset.index);
            updateCarousel();
        }
    });

    // Initialize
    updateCarousel(false);
    startAutoplay();

    window.addEventListener('resize', () => updateCarousel(false));
  }
});
