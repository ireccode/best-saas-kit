// Event tracking setup
const trackEvent = (eventName, properties = {}) => {
    // Replace with your analytics implementation
    console.log(`Event tracked: ${eventName}`, properties);
};

// Intersection Observer for animations
const createIntersectionObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
};

// Chat widget implementation
class ChatWidget {
    constructor() {
        this.widget = document.createElement('div');
        this.widget.className = 'chat-widget fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4';
        this.isOpen = false;
        this.initialize();
    }

    initialize() {
        // Create chat button
        const button = document.createElement('button');
        button.className = 'bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition-colors';
        button.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
        `;
        button.addEventListener('click', () => this.toggleChat());
        this.widget.appendChild(button);

        // Add to page
        document.body.appendChild(this.widget);
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
        this.isOpen = !this.isOpen;
    }

    openChat() {
        // Implement chat opening logic
        trackEvent('chat_opened');
    }

    closeChat() {
        // Implement chat closing logic
        trackEvent('chat_closed');
    }
}

// Form handling
const setupForms = () => {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Track form submission
            trackEvent('form_submitted', {
                form_id: form.id,
                ...data
            });

            // Redirect to thank you page
            window.location.href = '/thank-you.html';
        });
    });
};

// Sticky header handling
const setupStickyHeader = () => {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('shadow-md');
            return;
        }
        
        if (currentScroll > lastScroll) {
            // Scrolling down
            header.classList.add('-translate-y-full');
        } else {
            // Scrolling up
            header.classList.remove('-translate-y-full');
            header.classList.add('shadow-md');
        }
        
        lastScroll = currentScroll;
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createIntersectionObserver();
    new ChatWidget();
    setupForms();
    setupStickyHeader();

    // Track page view
    trackEvent('page_view', {
        page: window.location.pathname
    });
});

// Handle smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Track navigation
            trackEvent('navigation_click', {
                target: this.getAttribute('href')
            });
        }
    });
});
