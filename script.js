// All animation and page logic runs after the main DOM is loaded.
// All Clerk authentication logic has been moved to a <script> tag in the <head> of index.html
// to ensure it loads in the correct order and prevent errors.

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FASTER CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    if (window.matchMedia("(min-width: 768px)").matches) {
        let mouseX = 0, mouseY = 0;
        gsap.to({}, 0.01, {
            repeat: -1,
            onRepeat: () => {
                gsap.set(cursor, { css: { left: mouseX, top: mouseY } });
            }
        });
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    } else {
        if(cursor) cursor.style.display = 'none';
    }

    // --- 2. PRELOADER ANIMATION ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        const countElement = document.getElementById('preloader-count');
        const preloaderTitleLines = document.querySelectorAll('.preloader-title span');
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(preloader, { y: '-100%', duration: 1.2, ease: 'power3.inOut' });
            }
        });
        tl.to('.preloader-content', { opacity: 1, duration: 0.5 })
          .from(preloaderTitleLines, { yPercent: 120, stagger: 0.1, duration: 1, ease: 'power3.out'}, 0.5)
          .to(countElement, { innerText: 100, duration: 2.5, snap: { innerText: 1 } }, 0)
          .to('.preloader-content', { opacity: 0, duration: 1 }, "+=0.5");
    }

    // --- 3. MENU TOGGLE & ANIMATION ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const toggleMenu = (e) => {
        const dashboardLink = document.getElementById('dashboard-link');
        // Prevent dashboard link from toggling menu if it's just opening sign-in
        if (e && e.currentTarget === dashboardLink && (!window.Clerk || !window.Clerk.user)) {
           return;
        }
        const isActive = navMenu.classList.toggle('is-active');
        gsap.to(navMenu, {
            y: isActive ? '0%' : '-100%',
            visibility: 'visible',
            duration: 1,
            ease: 'power3.inOut'
        });
    };
    menuToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => {
        // Make sure dashboard link doesn't close menu if sign-in is opening
        if(link.id !== 'dashboard-link'){
            link.addEventListener('click', toggleMenu);
        }
    });

    // --- 4. DYNAMIC PROPERTIES & ANIMATIONS ---
    const properties = [
        { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: 'Oceanview Villa', location: 'Malibu, California', span: 3 },
        { img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: 'The Grand Suburban', location: 'Aspen, Colorado', span: 3 },
        { img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: 'Sky-Frame Villa', location: 'Beverly Hills, CA', span: 2 },
        { img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', title: 'Lakeside Retreat', location: 'Geneva, Switzerland', span: 4 },
    ];

    function createPropertyGrid() {
        const grid = document.querySelector('.properties-creative-grid');
        const isMobile = window.innerWidth <= 768;
        
        properties.forEach((property, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'property-card-wrapper';
            
            // Only apply span classes if not on mobile
            if (!isMobile) {
                // Keep your existing span logic for desktop
                if (index === 0) wrapper.style.gridColumn = 'span 4';
                if (index === 1) wrapper.style.gridColumn = 'span 2';
                if (index === 2) wrapper.style.gridColumn = 'span 3';
                if (index === 3) wrapper.style.gridColumn = 'span 3';
            }

            const card = document.createElement('div');
            card.className = 'property-card';
            card.style.backgroundImage = `url(${property.img})`;
            const info = document.createElement('div');
            info.className = 'property-card-info';
            info.innerHTML = `<h3>${property.title}</h3><span>${property.location}</span>`;
            wrapper.appendChild(card);
            wrapper.appendChild(info);
            grid.appendChild(wrapper);
        });
        gsap.utils.toArray('.property-card-wrapper').forEach((wrapper) => {
            const card = wrapper.querySelector('.property-card');
            const info = wrapper.querySelector('.property-card-info');
            const tl = gsap.timeline({ scrollTrigger: { trigger: wrapper, start: 'top 85%', toggleActions: 'play none none none' } });
            tl.from(wrapper, { y: 100, opacity: 0, duration: 1, ease: 'power3.out' })
              .from(card, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, ease: 'power4.out' }, '-=0.7')
              .from(info.children, { y: 20, opacity: 0, stagger: 0.1 }, '-=0.5');
            gsap.to(card, { yPercent: -15, ease: 'none', scrollTrigger: { trigger: wrapper, scrub: 1 } });
        });
    }

    createPropertyGrid();

    // Add a resize listener to handle screen size changes
    window.addEventListener('resize', debounce(() => {
        const grid = document.querySelector('.properties-creative-grid');
        if (grid) {
            grid.innerHTML = '';
            createPropertyGrid();
        }
    }, 250));

    // Debounce helper function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- 5. PHILOSOPHY MARQUEE ---
    const philosophies = [
        { img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: 'Elegance' },
        { img: 'https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1467&q=80', title: 'Exclusivity' },
        { img: 'https://images.unsplash.com/photo-1692455151728-85b49a956d45?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Legacy' },
        { img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: 'Comfort' },
        { img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: 'Vision' },
    ];
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const allCards = [...philosophies, ...philosophies]; 
        allCards.forEach(item => {
            const card = document.createElement('div');
            card.className = 'philosophy-card';
            card.innerHTML = `<div class="philosophy-card-image"><img src="${item.img}" alt="${item.title}"></div><h3>${item.title}</h3>`;
            marqueeTrack.appendChild(card);
        });
    }

    // --- 6. AGENTS LIST HOVER ---
    const agentItems = document.querySelectorAll('.agent-item');
    const agentImageContainer = document.querySelector('.agent-image-container');
    if (agentItems.length > 0 && agentImageContainer) {
        let currentImage = new Image();
        agentItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                currentImage.src = item.dataset.img;
                if (!agentImageContainer.contains(currentImage)) {
                    agentImageContainer.innerHTML = '';
                    agentImageContainer.appendChild(currentImage);
                }
                agentImageContainer.classList.add('is-active');
            });
            item.addEventListener('mouseleave', () => {
                agentImageContainer.classList.remove('is-active');
            });
        });
        window.addEventListener('mousemove', (e) => {
            gsap.to(agentImageContainer, { x: e.clientX, y: e.clientY, duration: 1, ease: 'power3.out' });
        });
    }
});
