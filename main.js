
// 1. INITIALIZE LENIS SMOOTH SCROLL
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. SCROLL REVEAL OBSERVER
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const elementsToReveal = document.querySelectorAll('.reveal-text, .reveal-fade, .reveal-slide-right, .reveal-slide-left');
elementsToReveal.forEach(el => revealObserver.observe(el));


// 3. NAVBAR ACTIVE STATE & CLICK LOGIC
const navbar = document.getElementById('navbar');
const navInner = document.getElementById('nav-inner');
const navLinks = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section, footer');
const logoHome = document.getElementById('logo-home');
const logoScroll = document.getElementById('logo-scroll');

function updateActiveLink() {
    let current = '';
    const navHeight = navbar.offsetHeight;

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = 'contact';
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - navHeight - 150)) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('nav-active');
        }
    });
}

// Consolidated Scroll Handler
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        // Scrolled Down
        navInner.classList.remove('h-24');
        navInner.classList.add('h-16');
        navbar.classList.add('backdrop-blur-md', 'bg-white/80', 'shadow-sm');

        if (logoHome) logoHome.classList.replace('opacity-100', 'opacity-0');
        if (logoScroll) logoScroll.classList.replace('opacity-0', 'opacity-100');
    } else {
        // Top
        navInner.classList.add('h-24');
        navInner.classList.remove('h-16');
        navbar.classList.remove('backdrop-blur-md', 'bg-white/80', 'shadow-sm');

        if (logoHome) logoHome.classList.replace('opacity-0', 'opacity-100');
        if (logoScroll) logoScroll.classList.replace('opacity-100', 'opacity-0');
    }
    updateActiveLink();
});

// Click Handler (Smooth Scroll)
document.querySelectorAll('.nav-item, .mobile-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
            mobileMenu.classList.add('translate-x-full');
        }

        if (targetSection) {
            const headerOffset = 80;
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(targetSection, { offset: -headerOffset });
            } else {
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    });
});

// 4. PARALLAX EFFECT
window.addEventListener('scroll', () => {
    const parallaxImages = document.querySelectorAll('.parallax-img');
    parallaxImages.forEach(img => {
        const speed = img.getAttribute('data-speed');
        const yPos = -(window.scrollY * speed);
        img.style.transform = `translateY(${yPos}px)`;
    });
});

// 5. SERVICE CARD STACKING EFFECT
const cards = document.querySelectorAll('.service-card');
const stackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const index = Array.from(cards).indexOf(entry.target);
        if (!entry.isIntersecting && entry.boundingClientRect.top <= 0) {
            entry.target.style.transform = `scale(${1 - (index * 0.05)}) translateY(-${index * 20}px)`;
            entry.target.style.filter = `brightness(${1 - (index * 0.1)})`;
        } else {
            entry.target.style.transform = `scale(1) translateY(0)`;
            entry.target.style.filter = `brightness(1)`;
        }
    });
}, { threshold: 0, rootMargin: "-10% 0px -90% 0px" });

cards.forEach(card => stackObserver.observe(card));

// 7. TESTIMONIALS SLIDER
new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    spaceBetween: 30,
    loop: true,
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 150,
        modifier: 2.5,
        slideShadows: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    }
});

// 8. CHAT WIDGET LOGIC
const chatWidget = document.getElementById('ai-widget');
const chatWindow = document.getElementById('chat-window');
const chatToggle = document.getElementById('chat-toggle');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
let isOpen = false;

const botKnowledge = {
    greetings: ["hello", "hi", "hey", "start", "good morning"],
    services: ["service", "offer", "provide", "do you do", "capabilities"],
    staffing: ["staffing", "hiring", "recruit", "talent", "contract"],
    engineering: ["engineering", "digital", "react", "node", "aws", "cloud", "devops"],
    enterprise: ["enterprise", "sap", "salesforce", "erp", "business software"],
    ai: ["ai", "artificial intelligence", "data", "ml", "python", "gen ai"],
    qa: ["qa", "testing", "quality", "selenium", "cypress", "automation"],
    security: ["security", "cyber", "protection", "compliance", "pen testing"],
    careers: ["career", "job", "opening", "work", "vacancy", "hiring", "join", "resume"],
    contact: ["contact", "email", "phone", "call", "address", "location", "office", "reach"],
    about: ["about", "who are you", "company", "krisintek", "since"]
};

const botResponses = {
    default: "I'm not sure I understand specific details about that, but our team definitely does. You can email us at <span class='font-bold text-[#C8102E]'>info@krisintek.com</span> or call (703) 348 2223.",
    greeting: "Hello! I am the Krisintek AI Assistant. I can answer questions about our Services, Open Roles, or Company details. How can I help?",
    services: "We specialize in 6 core areas: Strategic Staffing, Digital Engineering, Enterprise Solutions, AI & Data Intelligence, QA Automation, and Cyber Security.",
    staffing: "We offer both Contract-to-Hire and Direct Placement staffing. We deploy high-impact talent aligned with your technical goals.",
    engineering: "Our Digital Engineering team builds scalable solutions using React, Node.js, AWS, Azure, and Kubernetes.",
    enterprise: "We streamline business processes using top-tier ERP implementations like SAP S/4HANA and Salesforce.",
    ai: "We help businesses harness the power of Python, Machine Learning, and Generative AI to drive smarter decisions.",
    qa: "Quality is our standard. We implement rigorous automated testing using Selenium, Cypress, and API Automation.",
    security: "We protect digital assets with Pen Testing, SecOps, and Compliance management.",
    careers: "We are currently hiring for: <br>1. <b>Sr. Java Engineer</b> (Remote)<br>2. <b>.NET Architect</b> (Hybrid)<br>3. <b>QA Automation</b> (On-Site)<br>You can send your resume to careers@krisintek.com.",
    contact: "You can visit us at <b>13800 Coppermine Rd, Herndon, VA</b>.<br>Phone: +1 (703) 348 2223<br>Email: info@krisintek.com",
    about: "Krisintek has been innovating since 2017. We modernize complex workflows and connect top-tier talent with world-class technology."
};

const getBotResponse = (input) => {
    const text = input.toLowerCase();
    if (botKnowledge.greetings.some(k => text.includes(k))) return botResponses.greeting;
    if (botKnowledge.staffing.some(k => text.includes(k))) return botResponses.staffing;
    if (botKnowledge.engineering.some(k => text.includes(k))) return botResponses.engineering;
    if (botKnowledge.enterprise.some(k => text.includes(k))) return botResponses.enterprise;
    if (botKnowledge.ai.some(k => text.includes(k))) return botResponses.ai;
    if (botKnowledge.qa.some(k => text.includes(k))) return botResponses.qa;
    if (botKnowledge.security.some(k => text.includes(k))) return botResponses.security;
    if (botKnowledge.services.some(k => text.includes(k))) return botResponses.services;
    if (botKnowledge.careers.some(k => text.includes(k))) return botResponses.careers;
    if (botKnowledge.contact.some(k => text.includes(k))) return botResponses.contact;
    if (botKnowledge.about.some(k => text.includes(k))) return botResponses.about;
    return botResponses.default;
};

const toggleChat = () => {
    isOpen = !isOpen;
    if (isOpen) {
        chatWindow.classList.remove('invisible', 'opacity-0', 'scale-90', 'translate-y-10');
        chatWindow.classList.add('opacity-100', 'scale-100', 'translate-y-0');
        setTimeout(() => chatInput.focus(), 300);
    } else {
        chatWindow.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
        chatWindow.classList.add('opacity-0', 'scale-90', 'translate-y-10');
        setTimeout(() => chatWindow.classList.add('invisible'), 300);
    }
};

chatToggle?.addEventListener('click', toggleChat);
closeChat?.addEventListener('click', toggleChat);

const addMessage = (text, sender) => {
    const div = document.createElement('div');
    div.className = `flex ${sender === 'user' ? 'justify-end' : 'items-start gap-3'} animate-fade-in-up`;
    if (sender === 'user') {
        div.innerHTML = `<div class="bg-[#C8102E] text-white p-4 rounded-2xl rounded-tr-none shadow-md text-sm max-w-[80%] leading-relaxed">${text}</div>`;
    } else {
        div.innerHTML = `<div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-600 font-bold text-[10px]">AI</div><div class="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-600 border border-slate-100 leading-relaxed">${text}</div>`;
    }
    chatMessages.appendChild(div);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
};

chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';
    setTimeout(() => {
        const response = getBotResponse(text);
        addMessage(response, 'bot');
    }, 600);
});

// 9. PRELOADER LOGIC
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    const loaderText = document.getElementById('loader-text');
    const loaderBar = document.getElementById('loader-bar');
    const loaderCounter = document.getElementById('loader-counter');

    const originalString = "KRISINTEK";
    loaderText.innerHTML = '';
    const spans = [];
    [...originalString].forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.classList.add('letter');
        loaderText.appendChild(span);
        spans.push(span);
    });

    setTimeout(() => { loaderText.classList.remove('translate-y-full'); }, 100);

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress > 100) progress = 100;
        loaderBar.style.width = `${progress}%`;
        loaderCounter.innerText = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                // Morph to KITS.
                spans[3].innerText = 'T';
                spans[6].innerText = 'S';
                spans[8].innerText = '.';
                const indicesToRemove = [1, 4, 5, 7];
                spans.forEach((span, index) => {
                    if (indicesToRemove.includes(index)) span.classList.add('squeeze');
                });

                setTimeout(() => {
                    loaderText.style.transition = "opacity 0.5s ease";
                    loaderText.style.opacity = "0";
                    setTimeout(() => {
                        loaderText.innerHTML = `<span class="text-3xl md:text-3xl font-light tracking-[0.2em] text-white uppercase">Empowering <span class="text-[#C8102E] font-bold">Enterprises</span></span>`;
                        loaderText.style.opacity = "1";
                        setTimeout(() => {
                            preloader.style.transition = "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)";
                            preloader.style.transform = "translateY(-100%)";
                        }, 2000);
                    }, 300);
                }, 2000);
            }, 700);
        }
    }, 30);
});

// 10. SEND MAIL FUNCTION
function sendToGmail() {
    const name = document.getElementById('contact-name').value;
    const message = document.getElementById('contact-message').value;
    const subject = `${name} - Website Inquiry`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@krisintek.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(gmailUrl, '_blank');
}

// 11. MOBILE MENU LOGIC (UPDATED)
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileBtn = document.getElementById('close-mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link'); // Select all links inside menu

function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('translate-x-full');

    if (isOpen) {
        // Open Menu
        mobileMenu.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden'); // Lock scroll
    } else {
        // Close Menu
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden'); // Unlock scroll
    }
}

if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);
if (closeMobileBtn) closeMobileBtn.addEventListener('click', toggleMobileMenu);

// Close menu when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
    });
});

// // 12. TERMINAL TYPING EFFECT
// const terminalContent = document.getElementById('terminal-content');
// if (terminalContent) {
//     const logs = [
//         { text: "> ESTABLISHING SECURE CONNECTION...", color: "text-gray-400" },
//         { text: "> ACCESSING NEURAL_NET_V5 [ROOT]", color: "text-white" },
//         { text: "> ...", color: "text-gray-500" },
//         { text: "> BYPASSING FIREWALL... SUCCESS", color: "text-green-400" },
//         { text: "> LOAD MODULE: AGENTIC_AI_WORKFORCE", color: "text-white" },
//         { text: "> OPTIMIZING VECTORS... 99.9%", color: "text-blue-400" },
//         { text: "> SCANNING FOR VULNERABILITIES...", color: "text-gray-400" },
//         { text: "> 0 THREATS DETECTED. ZERO_TRUST ACTIVE.", color: "text-green-400" },
//         { text: "> INITIATING DEPLOYMENT SEQUENCE...", color: "text-[#C8102E]" },
//         { text: "> WELCOME TO KRISINTEK.", color: "text-white font-bold" }
//     ];

//     let logIndex = 0;
//     let charIndex = 0;

//     function typeLog() {
//         if (logIndex < logs.length) {
//             const currentLog = logs[logIndex];
//             if (charIndex === 0) {
//                 const line = document.createElement('div');
//                 line.className = `${currentLog.color} font-mono tracking-wide`;
//                 line.id = `log-${logIndex}`;
//                 terminalContent.appendChild(line);
//             }
//             const lineElement = document.getElementById(`log-${logIndex}`);
//             lineElement.textContent += currentLog.text.charAt(charIndex);
//             charIndex++;
//             terminalContent.scrollTop = terminalContent.scrollHeight;
//             if (charIndex < currentLog.text.length) {
//                 setTimeout(typeLog, Math.random() * 60 + 20);
//             } else {
//                 charIndex = 0;
//                 logIndex++;
//                 setTimeout(typeLog, 400);
//             }
//         }
//     }
//     setTimeout(typeLog, 2500);
// }



// import * as THREE from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// const container = document.getElementById('eve-container');
// const canvas = document.getElementById('eve-canvas');

// // 1. SCENE SETUP (Alpha: true makes background transparent)
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
// camera.position.set(0, 0, 5);

// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
// renderer.setSize(container.clientWidth, container.clientHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.outputColorSpace = THREE.SRGBColorSpace; // Makes textures pop

// // 2. LIGHTING (Essential for "Rendered" look)
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
// scene.add(ambientLight);

// const spotLight = new THREE.SpotLight(0xffffff, 5);
// spotLight.position.set(5, 5, 5);
// scene.add(spotLight);

// // 3. LOAD EVE + ANIMATIONS
// let eveModel, mixer;
// const clock = new THREE.Clock(); // Required for animation timing

// const loader = new GLTFLoader();
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
// loader.setDRACOLoader(dracoLoader);

// loader.load('./eveT.glb', (gltf) => {
//     eveModel = gltf.scene;

//     // POSITIONING
//     eveModel.scale.set(0.8, 0.8, 0.8);
//     eveModel.position.set(0, -1.2, 0.5); // Moves her to the right side
//     scene.add(eveModel);

//     // PLAY ANIMATION
//     if (gltf.animations.length > 0) {
//         mixer = new THREE.AnimationMixer(eveModel);
//         const action = mixer.clipAction(gltf.animations[0]); // Plays the 1st animation
//         action.play();
//     }
//     if (gltf.animations && gltf.animations.length > 0) {
//         // 1. Create the mixer
//         mixer = new THREE.AnimationMixer(model);

//         // 2. Tell the mixer which animation to play (usually the first one, index 0)
//         const action = mixer.clipAction(gltf.animations[0]);

//         // 3. Start the animation
//         action.play();

//         console.log("Animation started!");
//     }
// }, undefined, (e) => console.error(e));


// // 4. MOUSE INTERACTION (Subtle look-at)
// const mouse = { x: 0, y: 0 };
// window.addEventListener('mousemove', (e) => {
//     mouse.x = (e.clientX / window.innerWidth) - 0.5;
//     mouse.y = (e.clientY / window.innerHeight) - 0.5;
// });

// // 5. RENDER LOOP
// function animate() {
//     const delta = clock.getDelta();
//     if (mixer) mixer.update(delta); // Updates the animation every frame

//     if (eveModel) {
//         // Smooth mouse following
//         eveModel.rotation.y = THREE.MathUtils.lerp(eveModel.rotation.y, mouse.x * 0.5, 0.05);
//         eveModel.rotation.x = THREE.MathUtils.lerp(eveModel.rotation.x, mouse.y * 0.2, 0.05);
//     }
//     // If the mixer exists, update it
//     if (mixer) {
//         mixer.update(delta);
//     }

//     // Your existing mouse rotation code...
//     if (eveModel) {
//         eveModel.rotation.y = THREE.MathUtils.lerp(eveModel.rotation.y, mouse.x * 0.8, 0.1);
//     }


//     renderer.render(scene, camera);
//     requestAnimationFrame(animate);



// }
// animate();

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const container = document.getElementById('eve-container');
const canvas = document.getElementById('eve-canvas');

// 1. SCENE SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

// 2. LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 3. LOAD EVE + ANIMATIONS
let eveModel, mixer;
const clock = new THREE.Clock();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load('./EVEB.glb', (gltf) => {
    eveModel = gltf.scene;
    eveModel.scale.set(0.8, 0.8, 0.8);
    eveModel.position.set(0, -1.2, 0);
    scene.add(eveModel);

    if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(eveModel);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
    }
}, undefined, (error) => console.error('Error loading model:', error));

// 4. MOUSE INTERACTION
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) - 0.5;
    mouse.y = ((e.clientY - rect.top) / rect.height) - 0.5;
});

// Window Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// 5. RENDER LOOP
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    if (eveModel) {
        eveModel.rotation.y = THREE.MathUtils.lerp(eveModel.rotation.y, mouse.x * 0.8, 0.1);
        eveModel.rotation.x = THREE.MathUtils.lerp(eveModel.rotation.x, mouse.y * 0.3, 0.1);
    }

    renderer.render(scene, camera);
}

animate();



// 1. Setup Raycaster and Mouse for clicking
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();

// 2. Add Click Event Listener to the canvas
renderer.domElement.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = renderer.domElement.getBoundingClientRect();
    clickMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    clickMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(clickMouse, camera);

    // Check if the ray intersects the model
    if (eveModel) {
        const intersects = raycaster.intersectObject(eveModel, true);

        if (intersects.length > 0) {
            // Trigger the existing chat window logic from your index.html
            openAiChat();
        }
    }
});

// 3. Function to trigger the Chat Widget (matches your existing UI logic)
function openAiChat() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
        chatWindow.classList.remove('invisible', 'opacity-0', 'scale-90', 'translate-y-10');
        chatWindow.classList.add('opacity-100', 'scale-100', 'translate-y-0');

        // Focus the input automatically
        const chatInput = document.getElementById('chat-input');
        if (chatInput) chatInput.focus();
    }
}




// At the very end of main.js
window.sendToGmail = function () {
    const nameElement = document.getElementById('contact-name');
    const messageElement = document.getElementById('contact-message');

    if (!nameElement || !messageElement) return;

    const name = nameElement.value;
    const message = messageElement.value;

    if (!name || !message) {
        alert("Please fill out both fields.");
        return;
    }

    const subject = `${name} - Website Inquiry`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@krisintek.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    window.open(gmailUrl, '_blank');
}