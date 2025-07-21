// OPTIMIZED JAVASCRIPT - Performance-focused implementation

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
        }
    }
});

if ('PerformanceObserver' in window) {
    perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
}

// Deferred content loading
async function loadDeferredContent() {
    try {
        const response = await fetch('deferred-sections.html');
        const html = await response.text();
        document.getElementById('deferred-content').innerHTML = html;
        
        // Initialize form functionality after content loads
        initializeForm();
        initializeFAQ();
        
        console.log('Deferred content loaded successfully');
    } catch (error) {
        console.error('Failed to load deferred content:', error);
        // Fallback: show basic contact info
        showFallbackContact();
    }
}

// Smooth scrolling implementation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering scroll
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

// Form validation and handling
function initializeForm() {
    const form = document.getElementById('adoption-application');
    if (!form) return;
    
    const maritalStatusSelect = document.getElementById('maritalStatus');
    const partnerInfo = document.getElementById('partner-info');
    const partnerOccupation = document.getElementById('partner-occupation');
    
    // Show/hide partner fields based on marital status
    maritalStatusSelect?.addEventListener('change', function() {
        const showPartner = this.value === 'married' || this.value === 'relationship';
        
        if (partnerInfo) {
            partnerInfo.style.display = showPartner ? 'block' : 'none';
            toggleRequiredFields(partnerInfo, showPartner);
        }
        
        if (partnerOccupation) {
            partnerOccupation.style.display = showPartner ? 'block' : 'none';
            toggleRequiredFields(partnerOccupation, showPartner);
        }
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
    
    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
}

function toggleRequiredFields(container, required) {
    const fields = container.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        if (required) {
            field.setAttribute('required', '');
        } else {
            field.removeAttribute('required');
            clearFieldError(field);
        }
    });
}

function validateField(field) {
    const errorDiv = field.parentNode.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = field.value.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Date validation (age requirement)
    if (field.id === 'dateOfBirth' && field.value) {
        const birthDate = new Date(field.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 25) {
            isValid = false;
            errorMessage = 'You must be at least 25 years old to adopt.';
        }
    }
    
    // Zip code validation
    if (field.name === 'zipCode' && field.value) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid zip code.';
        }
    }
    
    // Display error
    if (errorDiv) {
        errorDiv.textContent = errorMessage;
        errorDiv.style.display = errorMessage ? 'block' : 'none';
    }
    
    // Visual feedback
    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid && field.value);
    
    return isValid;
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
    field.classList.remove('error');
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    
    // Validate all fields
    let isFormValid = true;
    form.querySelectorAll('input, select, textarea').forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Submit to your backend
        const response = await fetch('/submit-adoption-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            // Success
            showSuccessMessage();
            form.reset();
        } else {
            throw new Error('Submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('There was an error submitting your application. Please try again or call us at (877) 264-3555.');
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <h3>Application Submitted Successfully!</h3>
        <p>Thank you for your application. We will contact you within 72 hours.</p>
        <p>If you have any immediate questions, please call us at <a href="tel:877-264-3555">(877) 264-3555</a>.</p>
    `;
    
    const form = document.getElementById('adoption-application');
    form.parentNode.insertBefore(message, form);
    form.style.display = 'none';
    
    // Scroll to success message
    message.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showErrorMessage(text) {
    const message = document.createElement('div');
    message.className = 'error-message-global';
    message.textContent = text;
    
    const form = document.getElementById('adoption-application');
    form.parentNode.insertBefore(message, form);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        message.remove();
    }, 10000);
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        
        summary.addEventListener('click', (e) => {
            // Close other open items (accordion behavior)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.hasAttribute('open')) {
                    otherItem.removeAttribute('open');
                }
            });
        });
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    document.querySelectorAll('.stat-item, .feature-item, .testimonial, .adoption-item').forEach(el => {
        observer.observe(el);
    });
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Fallback contact info if deferred content fails
function showFallbackContact() {
    const fallbackHTML = `
        <section class="contact-fallback">
            <div class="container">
                <h2>Ready to Start Your Adoption Journey?</h2>
                <p>Call us today to speak with an adoption specialist.</p>
                <a href="tel:877-264-3555" class="btn">(877) 264-3555</a>
                <p>Or email us at <a href="mailto:info@angeladoption.com">info@angeladoption.com</a></p>
            </div>
        </section>
    `;
    document.getElementById('deferred-content').innerHTML = fallbackHTML;
}

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'assets/moms-adoption-variant-dark-banner.png',
        'assets/pink_adop_icn.png',
        'assets/pink_heart_icn.png',
        'assets/pink_phone_icn.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    preloadCriticalResources();
    initLazyLoading();
    initScrollAnimations();
});

// Load deferred content after page load
window.addEventListener('load', function() {
    // Small delay to ensure critical content is rendered
    setTimeout(loadDeferredContent, 100);
});

// Service Worker registration for caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}