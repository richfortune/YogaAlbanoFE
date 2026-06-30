document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. GESTIONE SCROLL HEADER
    // ==========================================================================
    const header = document.querySelector('.main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Controllo iniziale dello scroll al caricamento
    handleScroll();
    window.addEventListener('scroll', handleScroll);


    // ==========================================================================
    // 2. MOBILE MENU (HAMBURGER)
    // ==========================================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    const toggleMenu = () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden'); // Blocca lo scroll del body
    };

    const closeMenu = () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Chiude il menu quando viene cliccato un link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });


    // ==========================================================================
    // 3. ANIMAZIONI ALL'INGRESSO (SCROLL REVEAL)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Smetti di osservare una volta animato
            }
        });
    }, {
        threshold: 0.15, // L'elemento deve essere visibile almeno al 15%
        rootMargin: '0px 0px -50px 0px' // Margine inferiore per anticipare l'animazione
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });


    // ==========================================================================
    // 4. INTERAZIONE FORM DI CONTATTO (SIMULAZIONE BACKEND)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const btnText = submitBtn.querySelector('span');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Previene il ricaricamento della pagina

        // Raccoglie i dati del form (per sviluppo futuro)
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Stati visivi durante l'invio
        submitBtn.disabled = true;
        btnSpinner.classList.remove('hidden');
        btnText.textContent = 'Invio in corso...';
        formFeedback.classList.add('hidden');
        formFeedback.className = 'form-feedback'; // Reset classi feedback

        // Simula una richiesta AJAX/API di 1.5 secondi
        setTimeout(() => {
            // Successo simulato
            submitBtn.disabled = false;
            btnSpinner.classList.add('hidden');
            btnText.textContent = 'Invia richiesta';

            formFeedback.classList.remove('hidden');
            formFeedback.classList.add('success');
            formFeedback.textContent = `Grazie ${formData.name}! La tua richiesta è stata inviata con successo. Ti risponderemo presto.`;

            // Pulisce il modulo
            contactForm.reset();

            // Rimuove il feedback di successo dopo 5 secondi
            setTimeout(() => {
                formFeedback.classList.add('hidden');
            }, 6000);

        }, 1500);
    });

});
