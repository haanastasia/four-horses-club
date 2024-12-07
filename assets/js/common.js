import Carousel from './Carousel.js';

let personalCarouselInstance = null;
let stagesCarouselInstance = null;

function initializeCarousels() {
    // Уничтожаем предыдущие экземпляры
    if (personalCarouselInstance) {
        personalCarouselInstance.destroy();
        personalCarouselInstance = null;
    }

    if (stagesCarouselInstance) {
        stagesCarouselInstance.destroy();
        stagesCarouselInstance = null;
    }

    // Проверяем текущую ширину экрана
    if (document.documentElement.clientWidth <= 992) {
        personalCarouselInstance = new Carousel('.personal-carousel', {
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoPlay: false,
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
            autoPlay: false,
            autoPlayInterval: 4000,
            classControl: '.personal-carousel__control',
        });
    }
}

// Первичная инициализация
initializeCarousels();

// Пересоздание карусели при изменении размера экрана
window.addEventListener('resize', initializeCarousels);

// Выбираем все ссылки с якорями
const anchors = document.querySelectorAll('a[href^="#"]');

anchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  

        const targetId = this.getAttribute('href').substring(1); 

        const targetElement = document.getElementById(targetId);

        // Получаем позицию элемента относительно верхней части страницы
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

        // Плавно прокручиваем к элементу с учетом отступа в 70 пикселей
        window.scrollTo({
            top: elementPosition - 70, 
            behavior: 'smooth'  // Плавная прокрутка
        });
    });
});
