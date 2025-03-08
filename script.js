// Helper functions

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

// Navigation & Router

const routes = [
    {
        name: 'home',
        path: '/',
        title: 'Home - Tatula Ink & Artistry',
        description:
            'Tatula Ink & Artistry – a top tattoo studio in Belgrade, near Arena. We create custom tattoos with safety, comfort, and the highest quality in mind.',
    },
    {
        name: 'about',
        path: '/about',
        title: 'About - Tatula Ink & Artistry',
        description:
            'Learn more about Tatula Ink & Artistry in Belgrade. We focus on custom designs, cover-ups, and high hygiene standards for a safe experience.',
    },
    {
        name: 'gallery',
        path: '/gallery',
        title: 'Gallery - Tatula Ink & Artistry',
        description:
            'Explore our tattoo portfolio at Tatula Ink & Artistry. From black and grey realism to vibrant color tattoos, see our best work in New Belgrade.',
    },
    {
        name: 'faq',
        path: '/faq',
        title: 'FAQ - Tatula Ink & Artistry',
        description:
            'Got questions? Check out our FAQ for tattoo aftercare, booking, cover-ups, and what to expect at Tatula Ink & Artistry in Belgrade.',
    },
    {
        name: 'contact',
        path: '/contact',
        title: 'Contact - Tatula Ink & Artistry',
        description:
            'Reach out to Tatula Ink & Artistry in Belgrade. Book a consultation or ask about custom tattoos, cover-ups, and our high-standard services near Arena.',
    },
    {
        name: 'not-found',
        path: '/404',
        title: 'Page not found - Tatula Ink & Artistry',
        description: '',
    },
];

function findRoute(prop, value) {
    return routes.find((route) => route[prop] === value);
}

function findCurrentRoute() {
    const { pathname: currentPath } = new URL(window.location.href);

    return findRoute('path', currentPath) ?? findRoute('name', '404');
}

// Global click handler

document.addEventListener('click', documentClickHandler);

function documentClickHandler(event) {
    const { target } = event;

    const navigationLinkSelector = '[data-link]';
    const accordionTitileSelector = '.accordion';
    const formSubmitButtonSelector = 'form[name="contact"] button[type="submit"]';

    const isNavigationLinkClicked = Boolean(target.matches(navigationLinkSelector));
    const isAccordionTitleClicked = Boolean(target.matches(accordionTitileSelector));
    const isContactFormSubmitButtonClicked = Boolean(target.matches(formSubmitButtonSelector));

    if (isNavigationLinkClicked) {
        handleRoute(event);
    } else if (isAccordionTitleClicked) {
        handleAccordionTitleClick(event);
    } else if (isContactFormSubmitButtonClicked) {
        handleContactFormSubmit(event);
    }
}

window.onpopstate = urlLocationHandler;

window.route = handleRoute;

urlLocationHandler();

// Custom handlers

function handleRoute(event) {
    event.preventDefault();

    const { target } = event;

    const pageName = target.getAttribute('data-link');

    const currentLocation = new URL(window.location.href);

    const navigationLink = `${currentLocation.origin}${
        findRoute('name', pageName)?.path ?? '/404'
    }`;

    window.history.pushState({}, '', navigationLink);

    urlLocationHandler();
}

function urlLocationHandler() {
    const currentLocation = new URL(window.location.href);
    const currentUrlPath = currentLocation.pathname;
    const currentPageName =
        findRoute('path', currentUrlPath)?.name || findRoute('path', '/404').name;

    // Deactivate all navigation links
    Array.from($$('nav ul li a')).forEach((navigationLink) => {
        if (!navigationLink.matches('.current')) return;

        navigationLink.classList.remove('current');
    });

    // Activate navigation link of current page
    $(`nav ul li a[data-link="${currentPageName}"]`)?.classList?.add('current');

    // Deactivate all main elements

    Array.from($$('main')).forEach((mainSection) => {
        if (mainSection.matches('.hidden')) return;

        mainSection.classList.add('hidden');
    });

    // Activate main element of current page
    $(`main#${currentPageName}`).classList.remove('hidden');

    // Update title of current page
    document.title = findCurrentRoute().title;

    // Update description meta tag
    $('meta[name="description"]').setAttribute('content', findCurrentRoute().description);
}

function handleAccordionTitleClick({ target }) {
    const accordionQuestions = Array.from($$('.accordion'));

    const isOpenedQuestionClicked = target.classList.contains('is-open');

    for (const question of accordionQuestions) {
        question.classList.remove('is-open');
        question.nextElementSibling.style.maxHeight = null;
    }

    if (isOpenedQuestionClicked) return;

    target.classList.toggle('is-open');

    const accordionAnswer = target.nextElementSibling;

    if (accordionAnswer.style.maxHeight) {
        accordionAnswer.style.maxHeight = null;
    } else {
        accordionAnswer.style.maxHeight = accordionAnswer.scrollHeight + 'px';
    }
}

function handleContactFormSubmit(event) {
    setTimeout(() => {
        $('form')?.reset();
    }, 500);
}

// Handle current date inside footer

const currentYearPlaceholder = document.querySelector('#currentYear');
const currentYear = new Date().getFullYear();

if (!currentYearPlaceholder.textContent) {
    currentYearPlaceholder.textContent = currentYear;
}
