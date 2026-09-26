document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'light';

    const setTheme = (theme) => {
        root.dataset.theme = theme;
        const darkTheme = theme === 'dark';
        root.style.setProperty('--paper', darkTheme ? '#18231f' : '#f4f0e8');
        root.style.setProperty(
            '--paper-deep',
            darkTheme ? '#202d28' : '#e9e1d4',
        );
        root.style.setProperty('--ink', darkTheme ? '#f4f0e8' : '#16221d');
        root.style.setProperty('--muted', darkTheme ? '#abb6ad' : '#69736d');
        root.style.setProperty('--line', darkTheme ? '#465249' : '#cbc8bc');
        root.style.setProperty('--white', darkTheme ? '#22312b' : '#fffdf7');
        themeIcon.className = darkTheme ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.setAttribute(
            'aria-label',
            `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
        );
    };

    setTheme(savedTheme);
    themeToggle.addEventListener('click', () => {
        const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', nextTheme);
        setTheme(nextTheme);
    });

    const progress = document.querySelector('.progress');
    const updateProgress = () => {
        const scrollable =
            document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    };
    window.addEventListener('scroll', updateProgress, {passive: true});
    updateProgress();

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    menuToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.querySelector('i').className = open
            ? 'fas fa-xmark'
            : 'fas fa-bars';
    });
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });

    const moreProjects = document.querySelector('#more-projects');
    const projectToggle = document.querySelector('#toggle-projects');
    projectToggle.addEventListener('click', () => {
        const expanded = projectToggle.getAttribute('aria-expanded') === 'true';
        projectToggle.setAttribute('aria-expanded', String(!expanded));
        moreProjects.hidden = expanded;
        projectToggle.innerHTML = expanded
            ? 'View more projects <i class="fas fa-arrow-down"></i>'
            : 'Show fewer projects <i class="fas fa-arrow-up"></i>';
    });

    const projectGrid = document.querySelector('.projects-grid');
    const projectOrder = document.querySelector('#project-order');
    const projectCards = [...projectGrid.querySelectorAll('.project-card')];
    const sortProjects = (mode) => {
        const cards = [...projectCards].sort((first, second) => {
            if (mode === 'alphabetical') {
                return first
                    .querySelector('h3')
                    .textContent.localeCompare(
                        second.querySelector('h3').textContent,
                    );
            }

            if (mode === 'full-stack' || mode === 'systems') {
                const preferred =
                    mode === 'full-stack' ? 'full-stack' : 'systems';
                const firstPriority = first.dataset.kind === preferred ? 0 : 1;
                const secondPriority =
                    second.dataset.kind === preferred ? 0 : 1;
                return (
                    firstPriority - secondPriority ||
                    Number(first.dataset.rank) - Number(second.dataset.rank)
                );
            }

            return Number(first.dataset.rank) - Number(second.dataset.rank);
        });

        cards.forEach((card) => projectGrid.appendChild(card));
    };

    sortProjects('curated');
    projectOrder.addEventListener('change', (event) =>
        sortProjects(event.target.value),
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {threshold: 0.12},
    );
    document
        .querySelectorAll('.reveal')
        .forEach((element) => observer.observe(element));
});
