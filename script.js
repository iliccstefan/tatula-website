function $(selector, context = document) {
    return context.querySelector(selector);
}

function $$(selector, context = document) {
    return context.querySelectorAll(selector);
}

// Hamburger menu

$('.menu > i').addEventListener('click', (event) => {
    const { target } = event;

    if (target.classList.contains('fa-bars')) {
        target.classList.remove('fa-bars');
        target.classList.add('fa-xmark');

        $('nav ul').style.opacity = '1';
        $('nav ul').style.height = 'fit-content';
    } else {
        target.classList.add('fa-bars');
        target.classList.remove('fa-xmark');

        $('nav ul').style.opacity = '0';
        $('nav ul').style.height = '0';
    }
});

// Handle initial page

const displayedPage = $('main:not(.hidden)');

if (!displayedPage) {
    const homePage = $('main#home');
    const homeLink = $('a[data-link="home"]');

    homePage.classList.remove('hidden');
    homeLink.classList.add('current');
}

function switchTo(targetPage) {
    const currentPage = $('.current').getAttribute('data-link');

    if (!currentPage) return;

    if (targetPage.toLowerCase() === currentPage.toLowerCase()) return;

    const links = Array.from($$('nav ul li a'));
    const pages = Array.from($$('main'));

    links.forEach((link) => link.classList.remove('current'));
    pages.forEach((page) => page.classList.add('hidden'));

    $(`nav ul li a[data-link="${targetPage}"]`).classList.add('current');
    $(`main#${targetPage}`).classList.remove('hidden');
}

// Handle date inside footer
const currentYearPlaceholder = document.querySelector('#currentYear');
const currentYear = new Date().getFullYear();

if (!currentYearPlaceholder.textContent) {
    currentYearPlaceholder.textContent = currentYear;
}

// Handle navigation

const navigationLinks = Array.from(document.querySelectorAll('nav ul li a'));

navigationLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const choosenPage = e.target.getAttribute('data-link');

        switchTo(choosenPage);
    });
});

// FAQ - Accordion

const accordionBtns = document.querySelectorAll('.accordion');

accordionBtns.forEach((accordion) => {
    accordion.onclick = function () {
        accordionBtns.forEach((btn) => {
            if (btn === this) return;
            btn.classList.remove('is-open');
            btn.nextElementSibling.style.maxHeight = null;
        });

        this.classList.toggle('is-open');

        let content = this.nextElementSibling;

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    };
});

const form = document.getElementById('form');

async function handleSubmit(event) {
    event.preventDefault();

    const status = document.getElementById('my-form-status');
    const data = new FormData(event.target);

    try {
        const response = await fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { Accept: 'application/json' },
        });

        const data = await response.json();

        if (!response.ok && Object.hasOwn(data, 'errors'))
            throw new Error(data['errors'].map((error) => error['message']).join(', '));

        if (!response.ok && !Object.hasOwn(data, 'errors'))
            throw new Error('Oops! There was a problem submitting your form');

        status.innerHTML = 'Thanks for your submission!';

        document.getElementById('form').reset();
    } catch (error) {
        status.innerHTML = error;
    }
}
form.addEventListener('submit', handleSubmit);
