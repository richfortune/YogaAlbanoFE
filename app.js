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
    // 4. INVIO REALE FORM DI CONTATTO CON NETLIFY FORMS
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && formFeedback) {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        const btnText = submitBtn.querySelector('span:first-child');

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            submitBtn.disabled = true;
            btnSpinner.classList.remove('hidden');
            btnText.textContent = 'Invio in corso...';

            formFeedback.className = 'form-feedback hidden';
            formFeedback.textContent = '';

            try {
                const formData = new FormData(contactForm);

                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(formData).toString()
                });

                if (!response.ok) {
                    throw new Error(`Invio non riuscito: ${response.status}`);
                }

                const name = formData.get('name');

                formFeedback.textContent =
                    `Grazie ${name}! La tua richiesta è stata inviata correttamente. Ti risponeremo presto.`;

                formFeedback.className = 'form-feedback success';
                contactForm.reset();
            } catch (error) {
                console.error('Errore durante l’invio del modulo:', error);

                formFeedback.textContent =
                    'Non è stato possibile inviare il messaggio. Riprova tra qualche minuto.';

                formFeedback.className = 'form-feedback error';
            } finally {
                submitBtn.disabled = false;
                btnSpinner.classList.add('hidden');
                btnText.textContent = 'Invia richiesta';
            }
        });
    }

});
