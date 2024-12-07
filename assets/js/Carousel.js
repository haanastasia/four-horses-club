export default class Carousel {
	constructor(container, options = {}) {
		this.container = document.querySelector(container);
		if (!this.container) throw new Error('Container not found');

		if (!this.container.classList.contains('card-carousel')) {
			this.container.classList.add('card-carousel');
		}

		this.slides = Array.from(this.container.children);
		this.totalSlides = this.slides.length;

		// Настройки по умолчанию
		this.options = {
			infinite: options.infinite || false,
			slidesToShow: options.slidesToShow || 1,
			slidesToScroll: options.slidesToScroll || 1,
			autoPlay: options.autoPlay || false,
			autoPlayInterval: options.autoPlayInterval || 3000,
			classControl: document.querySelector(options.classControl) || this.createControlElement(),
			dots: options.dots || false,
			customControl: document.querySelector(options.classControl) ? true : false,
		};

		this.currentIndex = 0;
		this.autoPlayTimer = null;

		this.init();
	}

	init() {
		this.setupCarousel();
		this.createControls();
		this.options.dots ? this.createDotsNavigation() : this.createPagination();
		this.update();
		if (this.options.autoPlay) this.startAutoPlay();
	}

	setupCarousel() {
		for (const slide of this.slides) {
			slide.style.flex = `0 0 ${100 / this.options.slidesToShow}%`;
			slide.style.transition = 'transform 0.5s ease';
		}
	}

	createControlElement() {
		const newElement = document.createElement('div');
		newElement.classList.add('card-carousel__control');
		this.container.insertAdjacentElement('afterend', newElement);
		return newElement;
	}

	createControls() {
		this.prevButton = document.createElement('button');
		this.prevButton.className = "card-carousel__direction card-carousel__direction--prev";

		this.prevButton.addEventListener('click', () => this.moveTo(this.currentIndex - this.options.slidesToScroll));
		this.options.classControl.appendChild(this.prevButton);

		this.nextButton = document.createElement('button');
		this.nextButton.className = "card-carousel__direction card-carousel__direction--next";

		this.nextButton.addEventListener('click', () => this.moveTo(this.currentIndex + this.options.slidesToScroll));
		this.options.classControl.appendChild(this.nextButton);
	}

	createPagination() {
		this.pagination = document.createElement('div');
		this.pagination.className = "card-carousel__counter";
		this.options.classControl.appendChild(this.pagination);
		this.updatePagination();
	}

	updatePagination() {
		const currentSlide = this.currentIndex + 1;
		const totalVisible = Math.min(this.options.slidesToShow, this.totalSlides);
		const lastSlide = Math.min(currentSlide + totalVisible - 1, this.totalSlides);
		this.pagination.innerHTML = `<span>${lastSlide}</span> / ${this.totalSlides}`;
	}

	createDotsNavigation() {
		this.dotsContainer = document.createElement('div');
		this.dotsContainer.className = "card-carousel__dots";

		for (let i = 0; i < this.totalSlides; i++) {
			const dot = document.createElement('div');
			dot.className = "card-carousel__dot";
			if (i === this.currentIndex) dot.classList.add('card-carousel__dot--active');
			dot.addEventListener('click', () => this.moveTo(i));
			this.dotsContainer.appendChild(dot);
		}

		this.options.classControl.appendChild(this.dotsContainer);
	}

	updateDots() {
		if (this.options.dots && this.dotsContainer) {
			const dots = this.dotsContainer.querySelectorAll('.card-carousel__dot');
			dots.forEach((dot, index) => {
				dot.classList.toggle('card-carousel__dot--active', index === this.currentIndex);
			});
		}
	}

	update() {
		// Рассчитываем смещение: учитываем количество слайдов, которые прокручиваются за раз
		const offset = -(this.currentIndex * (100 * this.options.slidesToScroll / this.options.slidesToShow));

		// Применяем смещение ко всем слайдам
		for (const slide of this.slides) {
			slide.style.transform = `translateX(${offset}%)`;
		}

		// Обновляем пагинацию или точки
		if (this.options.dots) {
			this.updateDots();
		} else {
			this.updatePagination();
		}

		// Обновляем состояние кнопок
		if (!this.options.infinite) {
			this.prevButton.disabled = this.currentIndex === 0;
			const maxIndex = this.totalSlides - this.options.slidesToShow;
			this.nextButton.disabled = this.currentIndex >= maxIndex;
		} else {
			this.prevButton.disabled = false; // В бесконечном режиме кнопки всегда активны
			this.nextButton.disabled = false;
		}
	}

	moveTo(index) {
		if (this.options.infinite) {
			if (index < 0) {
				this.currentIndex = this.totalSlides - this.options.slidesToShow;
			} else if (index >= this.totalSlides) {
				this.currentIndex = 0;
			} else {
				this.currentIndex = index;
			}
		} else {
			const maxIndex = this.totalSlides - this.options.slidesToShow;
			this.currentIndex = Math.max(0, Math.min(index, maxIndex));
		}
		this.update();
		this.resetAutoPlay();
	}

	startAutoPlay() {
		this.stopAutoPlay();
		this.autoPlayTimer = setInterval(() => {
			this.moveTo(this.currentIndex + this.options.slidesToScroll);
		}, this.options.autoPlayInterval);
	}

	stopAutoPlay() {
		if (this.autoPlayTimer) {
			clearInterval(this.autoPlayTimer);
			this.autoPlayTimer = null;
		}
	}

	resetAutoPlay() {
		if (this.options.autoPlay) {
			this.stopAutoPlay();
			this.startAutoPlay();
		}
	}

	destroy() {

		this.container.classList.remove('card-carousel');

		// Удаление созданных элементов управления
		if (this.prevButton) this.prevButton.remove();
		if (this.nextButton) this.nextButton.remove();
		if (this.pagination) this.pagination.remove();
		if (this.dotsContainer) this.dotsContainer.remove();

		// Сброс стилей слайдов
		for (const slide of this.slides) {
			slide.style.flex = '';
			slide.style.transition = '';
			slide.style.transform = '';
		}

		// Остановка автопроигрывания
		this.stopAutoPlay();

		// Очистка контейнера управления с учетом кастома пагинации
		if (this.options.classControl && this.options.classControl !== document.body) {

			if (this.options.customControl) {
				this.options.classControl.innerHTML = '';
			} else {
				this.options.classControl.remove();
			}
		}
	}

}
