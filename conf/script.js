document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const menuLinks = document.querySelectorAll(".side-menu a");
  const sideMenu = document.querySelector(".side-menu");
  const mainContainer = document.querySelector('main');

  // Funkcja do animacji tekstu
  function animateText(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
    // Wymuszamy reflow
    void element.offsetHeight;
  
    // Animujemy cały tekst
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }
  

  function getScrollPosition() {
    return mainContainer ? mainContainer.scrollTop : window.scrollY;
  }

  let lastActiveSection = null;

  function updateActiveSection() {
    const currentPos = getScrollPosition();
    let activeSection = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + mainContainer.scrollTop - mainContainer.offsetTop;

      if (Math.abs(currentPos - sectionTop) < 100) {
        activeSection = section;
      }
    });

    if (activeSection && activeSection !== lastActiveSection) {
      // Animujemy teksty w nowej sekcji
      const textElements = activeSection.querySelectorAll('h1, h2, h3, p');
      textElements.forEach(element => {
        animateText(element);
      });

      // Aktualizacja aktywnego linku
      menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection.id}`) {
          link.classList.add('active');
        }
      });

      // Aktualizacja koloru menu
      const menuClasses = {
        'yellow': 'yellow-menu',
        'light-turquoise': 'light-turquoise-menu',
        'dark-turquoise': 'dark-turquoise-menu',
        'light': 'light-menu',
        'dark': 'dark-menu'
      };

      Object.values(menuClasses).forEach(className => {
        sideMenu.classList.remove(className);
      });

      for (const [sectionClass, menuClass] of Object.entries(menuClasses)) {
        if (activeSection.classList.contains(sectionClass)) {
          sideMenu.classList.add(menuClass);
          break;
        }
      }

      lastActiveSection = activeSection;
    }
  }

  menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      menuLinks.forEach(menuLink => menuLink.classList.remove('active'));
      link.classList.add('active');

      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        mainContainer.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth"
        });
      }
    });
  });

  // Dodajemy debounce dla lepszej wydajności
  let scrollTimeout;
  mainContainer.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(updateActiveSection);
  });

  // Inicjalna aktualizacja
  updateActiveSection();
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger-menu");
  const sideMenu = document.querySelector(".side-menu");

  hamburger.addEventListener("click", () => {
    sideMenu.classList.toggle("active");
  });

  document.querySelectorAll(".side-menu a").forEach(link => {
    link.addEventListener("click", () => {
      sideMenu.classList.remove("active");
    });
  });
});