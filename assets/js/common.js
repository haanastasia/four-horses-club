let personalCarouselInstance = null;
let stagesCarouselInstance = null;

function initializeCarousels() {

    if (personalCarouselInstance) {
        personalCarouselInstance.destroy();
        personalCarouselInstance = null;
    }

    if (stagesCarouselInstance) {
        stagesCarouselInstance.destroy();
        stagesCarouselInstance = null;
    }

    // в зависимости от расширения экрана
    if (document.documentElement.clientWidth <= 992) {
        personalCarouselInstance = new Carousel('.personal-carousel', {
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoPlay: true,
            autoPlayInterval: 4000,
        });

        stagesCarouselInstance = new Carousel('.stages__grid', {
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
        });
    } else {
        personalCarouselInstance = new Carousel('.personal-carousel', {
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            autoPlay: true,
            autoPlayInterval: 4000,
            classControl: '.personal-carousel__control',
        });
    }
}

initializeCarousels();

// ресайз для каруселей
window.addEventListener('resize', initializeCarousels);

// находим все якоря
const anchors = document.querySelectorAll('a[href^="#"]');

anchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  

        const targetId = this.getAttribute('href').substring(1); 

        const targetElement = document.getElementById(targetId);

        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

        // скролл с учетом + 70 пикс
        window.scrollTo({
            top: elementPosition - 70, 
            behavior: 'smooth'  
        });
    });
});
