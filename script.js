// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-times');
});

// Slider Functionality
let currentSlide = 0;
let isDragging = false;
let startPosX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let autoSlideInterval;

const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');

// Initialize Slider
function initSlider() {
    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `indicator${index === 0 ? ' active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        document.querySelector('.slider-indicators').appendChild(indicator);
    });

    // Start auto-slide
    autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Add event listeners
    slider.addEventListener('touchstart', touchStart);
    slider.addEventListener('touchmove', touchMove);
    slider.addEventListener('touchend', touchEnd);
    slider.addEventListener('mousedown', mouseStart);
    slider.addEventListener('mousemove', mouseMove);
    slider.addEventListener('mouseup', mouseEnd);
    slider.addEventListener('mouseleave', mouseEnd);
}

// Touch Events
function touchStart(e) {
    startPosX = e.touches[0].clientX;
    isDragging = true;
    clearInterval(autoSlideInterval);
    slider.style.transition = 'none';
}

function touchMove(e) {
    if (isDragging) {
        const currentPosition = e.touches[0].clientX;
        currentTranslate = prevTranslate + currentPosition - startPosX;
    }
}

function touchEnd() {
    handleDragEnd();
    autoSlideInterval = setInterval(nextSlide, 5000);
}

// Mouse Events
function mouseStart(e) {
    startPosX = e.clientX;
    isDragging = true;
    clearInterval(autoSlideInterval);
    slider.style.transition = 'none';
}

function mouseMove(e) {
    if (isDragging) {
        const currentPosition = e.clientX;
        currentTranslate = prevTranslate + currentPosition - startPosX;
    }
}

function mouseEnd() {
    handleDragEnd();
    autoSlideInterval = setInterval(nextSlide, 5000);
}

// Common Drag Handling
function handleDragEnd() {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentSlide < slides.length - 1) currentSlide++;
    if (movedBy > 100 && currentSlide > 0) currentSlide--;

    slider.style.transition = 'transform 0.4s ease';
    updateSlider();
}

// Slider Controls
function updateSlider() {
    currentTranslate = -currentSlide * slider.offsetWidth;
    prevTranslate = currentTranslate;
    slider.style.transform = `translateX(${currentTranslate}px)`;
    updateIndicators();
}

function updateIndicators() {
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    if (currentSlide >= slides.length - 1) {
        currentSlide = 0;
    } else {
        currentSlide++;
    }
    updateSlider();
}

function prevSlide() {
    if (currentSlide <= 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide--;
    }
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// Initialize the slider when DOM loads
document.addEventListener('DOMContentLoaded', initSlider);