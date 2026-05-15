document.addEventListener("DOMContentLoaded", () => {
    const carouselContainer = document.querySelector('.topics-carousel-container');
    const carousel = document.querySelector('.topics-carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev-btn');
    const nextBtn = document.querySelector('.carousel-btn.next-btn');

    let autoScrollInterval;

    const getScrollAmount = () => {
        const card = carousel.querySelector('.topic-card');
        return card ? card.offsetWidth + 20 : 200; // Ancho de la tarjeta + gap
    };

    const scrollNext = () => {
        if (!carousel) return;
        // Si llegó al final (con un pequeño margen de error), regresa al principio
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        }
    };

    const scrollPrev = () => {
        if (!carousel) return;
        if (carousel.scrollLeft <= 0) {
            carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        }
    };

    const startAutoScroll = () => {
        autoScrollInterval = setInterval(scrollNext, 3000); // 3 segundos
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    if (nextBtn && prevBtn && carouselContainer && carousel) {
        nextBtn.addEventListener('click', () => {
            scrollNext();
            stopAutoScroll();
            startAutoScroll();
        });

        prevBtn.addEventListener('click', () => {
            scrollPrev();
            stopAutoScroll();
            startAutoScroll();
        });

        // Detener al hacer hover
        carouselContainer.addEventListener('mouseenter', stopAutoScroll);
        
        // Reanudar al quitar hover
        carouselContainer.addEventListener('mouseleave', startAutoScroll);
        
        // Iniciar auto-scroll
        startAutoScroll();
    }
});
