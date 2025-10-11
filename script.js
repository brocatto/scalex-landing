// ===== SCALEX V2 - JAVASCRIPT INTERACTIONS =====

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
    initializeScrollAnimations();
    initializeFAQ();
    initializeForm();
    initializeNavigation();
    initializeFloatingOrbs();
    initializeAppleCarousels();
});

// ===== INICIALIZAÇÃO DOS ÍCONES LUCIDE =====
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ===== APPLE-STYLE CAROUSEL FUNCTIONALITY =====
function initializeAppleCarousels() {
    const carousels = document.querySelectorAll('.results-carousel-container, .results-carousel-container-large');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.results-carousel-track');
        const cards = carousel.querySelectorAll('.result-card-spotlight');
        // Buscar indicadores no próximo sibling (agora estão fora do container)
        const indicatorsContainer = carousel.nextElementSibling;
        const indicators = indicatorsContainer ? indicatorsContainer.querySelectorAll('.indicator') : [];

        if (!track || !cards.length) return;

        let currentIndex = 0;
        let autoplayInterval;

        // AUTOPLAY - scroll nativo
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % cards.length;
                const cardWidth = cards[0].offsetWidth;
                const isMobile = window.innerWidth <= 768;
                const gap = isMobile ? 8 : 32;
                const scrollPosition = currentIndex * (cardWidth + gap);

                carousel.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });

                indicators.forEach((ind, idx) => {
                    ind.classList.toggle('active', idx === currentIndex);
                });
            }, 4000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Detecta scroll manual e atualiza indicadores
        let scrollTimeout;
        let isUserScrolling = false;
        carousel.addEventListener('scroll', () => {
            isUserScrolling = true;
            stopAutoplay(); // Para o autoplay quando usuário scrolla

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const cardWidth = cards[0].offsetWidth;
                const isMobile = window.innerWidth <= 768;
                const gap = isMobile ? 8 : 32;
                const newIndex = Math.round(carousel.scrollLeft / (cardWidth + gap));

                if (newIndex !== currentIndex && newIndex < cards.length) {
                    currentIndex = newIndex;
                    indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === currentIndex);
                    });
                }

                // Restart autoplay depois de 3 segundos parado
                setTimeout(() => {
                    isUserScrolling = false;
                    startAutoplay();
                }, 3000);
            }, 150);
        });

        // Click to open image modal
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                if (img) {
                    openImageModal(img.src, img.alt);
                }
            });
        });

        // Indicator clicks - scroll suave até o card
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoplay();
                currentIndex = index;
                const cardWidth = cards[0].offsetWidth;
                const isMobile = window.innerWidth <= 768;
                const gap = isMobile ? 8 : 32;
                const scrollPosition = currentIndex * (cardWidth + gap);

                carousel.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });

                indicators.forEach((ind, idx) => {
                    ind.classList.toggle('active', idx === currentIndex);
                });

                // Restart autoplay depois de 3 segundos
                setTimeout(startAutoplay, 3000);
            });
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', () => {
            if (!isUserScrolling) startAutoplay();
        });

        // Initialize first indicator as active
        if (indicators.length > 0) {
            indicators[0].classList.add('active');
        }

        // Start autoplay
        startAutoplay();
    });
}

// ===== IMAGE MODAL FUNCTIONALITY =====
function openImageModal(imageSrc, imageAlt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-backdrop"></div>
        <div class="image-modal-content">
            <button class="image-modal-close" onclick="closeImageModal()">
                <i data-lucide="x"></i>
            </button>
            <img src="${imageSrc}" alt="${imageAlt}" class="image-modal-img">
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Initialize close button icon
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Close on backdrop click
    modal.querySelector('.image-modal-backdrop').addEventListener('click', closeImageModal);

    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeImageModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Animate in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// ===== ANIMAÇÕES DE SCROLL =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Adiciona delay escalonado para elementos em grid
                if (entry.target.parentElement.classList.contains('problems-grid') ||
                    entry.target.parentElement.classList.contains('results-grid') ||
                    entry.target.parentElement.classList.contains('areas-grid')) {
                    
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observa seções e cards para animação
    const elementsToAnimate = document.querySelectorAll(`
        .section-header,
        .problem-card,
        .result-card,
        .area-card,
        .framework-phase,
        .differential-card,
        .profile-item,
        .comparison-side
    `);

    elementsToAnimate.forEach(el => observer.observe(el));
}

// ===== FAQ INTERATIVO =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle do FAQ atual
            item.classList.toggle('active', !isActive);
        });
    });
}

// ===== FORMULÁRIO DE LEAD =====
function initializeForm() {
    const form = document.getElementById('leadForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Máscara para WhatsApp
        const whatsappInput = document.getElementById('whatsapp');
        if (whatsappInput) {
            whatsappInput.addEventListener('input', formatWhatsApp);
        }
        
        // Validação em tempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validação completa
    if (!validateForm(form)) {
        return;
    }
    
    // Simula envio (aqui você integraria com seu backend)
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i data-lucide="loader-2"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simula delay de envio
    setTimeout(() => {
        showSuccessMessage();
        form.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        lucide.createIcons(); // Reinicializa ícones
    }, 2000);
    
    // Aqui você faria a integração real:
    // fetch('/api/leads', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // })
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove erro anterior
    clearFieldError(e);
    
    // Validação por tipo
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Este campo é obrigatório';
        isValid = false;
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Email inválido';
            isValid = false;
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'WhatsApp inválido. Use o formato (11) 99999-9999';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function formatWhatsApp(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    
    e.target.value = value;
}

function showSuccessMessage() {
    // Cria modal de sucesso
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content glass-effect">
            <div class="success-icon">
                <i data-lucide="check-circle"></i>
            </div>
            <h3>Análise Solicitada com Sucesso!</h3>
            <p>Recebemos suas informações e entraremos em contato em até 24h com sua análise personalizada.</p>
            <button class="btn-primary" onclick="closeSuccessModal()">
                <i data-lucide="x"></i>
                Fechar
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    lucide.createIcons();
    
    // Auto-remove após 5 segundos
    setTimeout(() => {
        if (modal.parentElement) {
            closeSuccessModal();
        }
    }, 5000);
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
}

// ===== NAVEGAÇÃO SUAVE =====
function initializeNavigation() {
    // Scroll suave para seções
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = section.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };
    
    // Navbar transparente/sólida baseada no scroll
    let lastScrollY = window.scrollY;
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Hide/show navbar baseado na direção do scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== FLOATING ORBS DINÂMICOS =====
function initializeFloatingOrbs() {
    const orbs = document.querySelectorAll('.floating-orb');
    
    // Movimento baseado no mouse
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 50;
            const y = (mouseY - 0.5) * speed * 50;
            
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // Reset posição quando mouse sai da tela
    document.addEventListener('mouseleave', () => {
        orbs.forEach(orb => {
            orb.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== TOGGLE FAQ GLOBAL =====
window.toggleFaq = function(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const faqAnswer = faqItem.querySelector('.faq-answer');
    const isActive = faqItem.classList.contains('active');
    
    // Fecha todos os outros FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.style.maxHeight = '0';
            }
        }
    });
    
    // Toggle do FAQ atual
    if (isActive) {
        faqItem.classList.remove('active');
        faqAnswer.style.maxHeight = '0';
    } else {
        faqItem.classList.add('active');
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
    }
};

// ===== PERFORMANCE E OTIMIZAÇÕES =====

// Debounce para eventos de scroll
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

// Lazy loading para imagens
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ESTILOS DINÂMICOS =====

// Adiciona estilos CSS dinâmicos
const dynamicStyles = `
    .success-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
    }
    
    .success-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 1rem;
        background: var(--success);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
    
    .success-icon i {
        width: 24px;
        height: 24px;
    }
    
    .modal-content h3 {
        margin-bottom: 1rem;
        color: var(--foreground);
    }
    
    .modal-content p {
        margin-bottom: 2rem;
        color: var(--muted-foreground);
    }
    
    .field-error {
        color: var(--error);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: var(--error);
        box-shadow: 0 0 0 3px oklch(0.7 0.2 20 / 0.1);
    }
    
    .nav.scrolled {
        background: rgba(5, 5, 15, 0.95);
        backdrop-filter: blur(20px);
    }
    
    .nav.hidden {
        transform: translateY(-100%);
    }
    
    .nav {
        transition: all 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @media (max-width: 768px) {
        .modal-content {
            margin: 1rem;
            padding: 1.5rem;
        }
    }
`;

// Injeta estilos dinâmicos
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// ===== ANALYTICS E TRACKING =====

// Função para tracking de eventos (integrar com GA4, Facebook Pixel, etc.)
function trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
    
    // Console log para debug
    console.log('Event tracked:', eventName, parameters);
}

// Tracking automático de interações importantes
document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a');
    if (!target) return;
    
    const text = target.textContent.trim();
    const href = target.href;
    
    if (target.classList.contains('btn-primary')) {
        trackEvent('cta_click', { button_text: text });
    } else if (target.classList.contains('nav-btn')) {
        trackEvent('nav_click', { button_text: text });
    } else if (href && href.includes('#')) {
        trackEvent('internal_link_click', { section: href.split('#')[1] });
    }
});

// Tracking de scroll depth
let maxScrollDepth = 0;
const trackScrollDepth = debounce(() => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestones
        if (scrollDepth >= 25 && maxScrollDepth < 25) {
            trackEvent('scroll_depth', { depth: '25%' });
        } else if (scrollDepth >= 50 && maxScrollDepth < 50) {
            trackEvent('scroll_depth', { depth: '50%' });
        } else if (scrollDepth >= 75 && maxScrollDepth < 75) {
            trackEvent('scroll_depth', { depth: '75%' });
        } else if (scrollDepth >= 90 && maxScrollDepth < 90) {
            trackEvent('scroll_depth', { depth: '90%' });
        }
    }
}, 500);

window.addEventListener('scroll', trackScrollDepth);

// ===== ACESSIBILIDADE =====

// Suporte a navegação por teclado
document.addEventListener('keydown', (e) => {
    // ESC fecha modais
    if (e.key === 'Escape') {
        closeSuccessModal();
    }
    
    // Enter em elementos focáveis
    if (e.key === 'Enter' && e.target.classList.contains('faq-question')) {
        e.target.click();
    }
});

// Adiciona indicadores de foco visíveis
const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
        element.classList.add('keyboard-focus');
    });
    
    element.addEventListener('blur', () => {
        element.classList.remove('keyboard-focus');
    });
    
    element.addEventListener('mousedown', () => {
        element.classList.remove('keyboard-focus');
    });
});

// ===== INICIALIZAÇÃO FINAL =====

// Garante que tudo está funcionando após carregamento completo
window.addEventListener('load', () => {
    initializeLazyLoading();
    
    // Remove loading states se existirem
    document.body.classList.add('loaded');
    
    // Força atualização dos ícones Lucide
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
});

console.log('🚀 ScaleX V2 - JavaScript carregado com sucesso!');



// ===== MENU MOBILE =====
function toggleMobileMenu() {
    // Implementação básica do menu mobile
    // Pode ser expandida conforme necessário
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    } else {
        // Se não existe menu mobile, apenas scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

