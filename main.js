// CONFIG is now loaded via index.html globally

document.addEventListener('DOMContentLoaded', () => {
    initContent();
    initNavbar();
    initScrollAnimations();
    initCursorGlow();
    initGraphBackground();
    initModal();
    initFullscreen();
});

function initGraphBackground() {
    const canvas = document.getElementById('graph-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let points = [];
    let globalOffset = 0;
    let verticalShift = 0; // The magic for infinite growth
    const pointGap = 50;
    
    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        points = [];
        let curX = 0;
        let curY = height * 0.6; // Start middle
        while (curX < width + pointGap * 2) {
            points.push({ x: curX, y: curY });
            curX += pointGap;
            curY -= Math.random() * 30 - 5;
        }
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        
        globalOffset += 1.5;
        
        // Add new points
        const lastPoint = points[points.length - 1];
        if (lastPoint.x - globalOffset < width + pointGap) {
            points.push({
                x: lastPoint.x + pointGap,
                y: lastPoint.y - (Math.random() * 45 - 10) // Strong upward trend
            });
            if (points.length > 100) points.shift();
        }

        // --- INFINITE GROWTH LOGIC ---
        // Find the lead point (the one currently at the right edge)
        const leadPoint = points.find(p => p.x - globalOffset >= width - pointGap) || points[points.length - 1];
        
        // Target lead point to be around 40% height of the screen
        const targetY = height * 0.4;
        const currentVisibleY = leadPoint.y + verticalShift;
        const dy = targetY - currentVisibleY;
        
        // Smoothly adjust verticalShift to keep the lead point in view
        verticalShift += dy * 0.02; 

        // Draw Grid (Now with vertical scrolling too!)
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
        ctx.lineWidth = 1;
        const gridOffsetX = globalOffset % 100;
        const gridOffsetY = verticalShift % 100;
        
        for (let i = -gridOffsetX; i < width; i += 100) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
        }
        for (let i = -gridOffsetY; i < height + 100; i += 100) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
        }
        
        // Draw Area
        ctx.beginPath();
        ctx.moveTo(points[0].x - globalOffset, height * 2); // Far below screen
        points.forEach(p => ctx.lineTo(p.x - globalOffset, p.y + verticalShift));
        ctx.lineTo(points[points.length - 1].x - globalOffset, height * 2);
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw Line
        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#8b5cf6';
        points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x - globalOffset, p.y + verticalShift);
            else ctx.lineTo(p.x - globalOffset, p.y + verticalShift);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw Lead Point
        ctx.beginPath();
        ctx.fillStyle = '#06b6d4';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#06b6d4';
        ctx.arc(leadPoint.x - globalOffset, leadPoint.y + verticalShift, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        requestAnimationFrame(draw);
    };
    
    draw();
}

function initContent() {
    // Set Studio Name
    document.title = `${CONFIG.studioName} | Premium Roblox & YouTube Solutions`;
    const studioNameEl = document.getElementById('studio-name');
    if (studioNameEl) studioNameEl.textContent = CONFIG.studioName;
    
    const footerStudioNameEl = document.getElementById('footer-studio-name');
    if (footerStudioNameEl) footerStudioNameEl.textContent = CONFIG.studioName;
    
    const copyrightNameEl = document.getElementById('copyright-name');
    if (copyrightNameEl) copyrightNameEl.textContent = CONFIG.studioName;
    
    const footerDescEl = document.getElementById('footer-description');
    if (footerDescEl) footerDescEl.textContent = CONFIG.description;
    
    // Hero Section
    const heroTaglineEl = document.getElementById('hero-tagline');
    if (heroTaglineEl) heroTaglineEl.textContent = CONFIG.tagline;

    // Services Section
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
        CONFIG.services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = `service-card ${service.popular ? 'popular' : ''} reveal delay-${index % 3}`;
            card.innerHTML = `
                ${service.popular ? '<div class="popular-badge">Most Ordered</div>' : ''}
                <span class="service-icon">${service.icon}</span>
                <span class="service-price">${service.price}</span>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <a href="${CONFIG.socials.discord}" target="_blank" rel="noopener noreferrer" class="btn btn-primary order-btn" style="margin-top: 20px; width: 100%; text-align: center;">Order Now</a>
            `;
            servicesContainer.appendChild(card);
        });
    }

    // Portfolio Section
    const portfolioContainer = document.getElementById('portfolio-container');
    const fullPortfolioContainer = document.getElementById('full-portfolio-container');
    const targetPortfolio = portfolioContainer || fullPortfolioContainer;

    if (targetPortfolio) {
        CONFIG.portfolio.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `portfolio-item reveal delay-${index % 3}`;
            div.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="portfolio-overlay">
                    <span class="category">${item.category}</span>
                    <h3>${item.title}</h3>
                    <a class="btn-link" onclick="openProjectModal(${index})">View Details →</a>
                </div>
            `;
            targetPortfolio.appendChild(div);
        });
    }

    // Socials
    const socialsContainer = document.getElementById('socials-container');
    if (socialsContainer) {
        Object.entries(CONFIG.socials).forEach(([platform, url]) => {
            const a = document.createElement('a');
            a.href = url;
            a.className = 'social-icon';
            a.innerHTML = getSocialIcon(platform);
            socialsContainer.appendChild(a);
        });
    }

}

let currentSlideIndex = 0;
let modalSlidesCount = 0;

window.openProjectModal = function(index) {
    const project = CONFIG.portfolio[index];
    if (!project) return;

    const modal = document.getElementById('project-modal');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    const gallery = document.getElementById('modal-gallery');
    const dotsContainer = document.getElementById('carousel-dots');
    const actionBtn = document.getElementById('modal-action-btn');

    title.textContent = project.title;
    desc.textContent = project.fullDescription || "Explore this amazing project by Nova Studios.";
    gallery.innerHTML = '';
    dotsContainer.innerHTML = '';
    currentSlideIndex = 0;
    
    if (actionBtn) {
        actionBtn.href = CONFIG.socials.discord;
    }

    const mediaItems = project.media || [{ type: 'image', src: project.image }];
    modalSlidesCount = mediaItems.length;

    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const showNav = modalSlidesCount > 1;
    
    if (prevBtn) prevBtn.style.display = showNav ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = showNav ? 'flex' : 'none';
    if (dotsContainer) dotsContainer.style.display = showNav ? 'flex' : 'none';

    mediaItems.forEach((item, i) => {
        if (item.type === 'image') {
            const el = document.createElement('img');
            el.src = item.src;
            el.onclick = () => openFullscreen(item.src);
            gallery.appendChild(el);
        } else if (item.type === 'video') {
            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';
            
            const video = document.createElement('video');
            video.src = item.src;
            video.loop = true;

            const playBtn = document.createElement('div');
            playBtn.className = 'play-button';

            const fsBtn = document.createElement('div');
            fsBtn.className = 'fullscreen-btn';
            fsBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';

            const togglePlay = () => {
                if (video.paused) {
                    video.play();
                    wrapper.classList.add('playing');
                } else {
                    video.pause();
                    wrapper.classList.remove('playing');
                }
            };

            const toggleFullscreen = (e) => {
                e.stopPropagation();
                if (video.requestFullscreen) video.requestFullscreen();
                else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
                else if (video.msRequestFullscreen) video.msRequestFullscreen();
            };

            playBtn.onclick = togglePlay;
            video.onclick = togglePlay;
            fsBtn.onclick = toggleFullscreen;

            wrapper.appendChild(video);
            wrapper.appendChild(playBtn);
            wrapper.appendChild(fsBtn);
            gallery.appendChild(wrapper);
        }

        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => showSlide(i);
        dotsContainer.appendChild(dot);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCarousel();
};

function initFullscreen() {
    const fsModal = document.getElementById('fullscreen-modal');
    const fsImg = document.getElementById('fullscreen-img');
    const closeFs = document.querySelector('.close-fullscreen');

    window.openFullscreen = (src) => {
        fsImg.src = src;
        fsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeFullscreen = () => {
        fsModal.classList.remove('active');
        // Only restore scroll if main modal is also closed
        if (!document.getElementById('project-modal').classList.contains('active')) {
            document.body.style.overflow = 'auto';
        }
    };

    if (closeFs) closeFs.onclick = closeFullscreen;
    if (fsModal) {
        fsModal.onclick = (e) => {
            if (e.target === fsModal) closeFullscreen();
        };
    }
}

function showSlide(index) {
    currentSlideIndex = index;
    updateCarousel();
}

function updateCarousel() {
    const gallery = document.getElementById('modal-gallery');
    const dots = document.querySelectorAll('.dot');
    
    gallery.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
    });
}

function initModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    
    if (prevBtn) {
        prevBtn.onclick = () => {
            currentSlideIndex = (currentSlideIndex - 1 + modalSlidesCount) % modalSlidesCount;
            updateCarousel();
        };
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            currentSlideIndex = (currentSlideIndex + 1) % modalSlidesCount;
            updateCarousel();
        };
    }

    window.addEventListener('click', (e) => {
        if (e.target == modal) closeModal();
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'Escape') closeModal();
        }
    });
}

function getSocialIcon(platform) {
    const icons = {
        discord: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/></svg>',
        twitter: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>',
        roblox: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.826 23.357l-14.764-2.836-3.705-14.496 14.764 2.836 3.705 14.496zm-10.32-12.753l-3.326.638.798 3.123 3.326-.638-.798-3.123zm15.14-7.142l-5.618-2.615-17.671 7.153 5.618 2.615 17.671-7.153zm-10.457 4.24l-3.326.638.798 3.123 3.326-.638-.798-3.123z"/></svg>'
    };
    return icons[platform] || '<span>🔗</span>';
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}
