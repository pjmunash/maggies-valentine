// ================================
// ROMANTIC UNIVERSE EXPERIENCE
// ================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initBackgroundMusic();
    initParticles();
    initParallax();
    initFloatingObjects();
    initSceneNavigation();
    initStars();
    initSurprise();
    initSceneParticles();
});

// ================================
// LOGIN SYSTEM
// ================================

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const loginScreen = document.getElementById('loginScreen');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = passwordInput.value.toLowerCase().trim();
        
        if (password === 'maggie') {
            // Correct password
            errorMessage.textContent = '';
            loginScreen.classList.add('hidden');
            
            // Remove login screen after animation
            setTimeout(() => {
                loginScreen.style.display = 'none';
                // Start home music after login
                startHomeMusic();
            }, 800);
        } else {
            // Wrong password
            errorMessage.textContent = 'Oops! Try again 💕';
            passwordInput.value = '';
            passwordInput.style.animation = 'shake 0.5s';
            
            setTimeout(() => {
                passwordInput.style.animation = '';
            }, 500);
        }
    });
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ================================
// BACKGROUND MUSIC
// ================================

let currentMusic = null;
let homeMusic = null;
let homeMusicPosition = 0;
let musicInitialized = false;

const sceneMusic = {
    'why-i-like-you': 'musicReasons',
    'late-night': 'musicNight',
    'special': 'musicSpecial',
    'surprise': 'musicSurprise',
    'letter': 'musicLetter'
};

function initBackgroundMusic() {
    homeMusic = document.getElementById('musicHome');
    if (homeMusic) {
        homeMusic.volume = 0.7;
    }
    musicInitialized = true;
}

function startHomeMusic() {
    if (homeMusic && !currentMusic) {
        // Resume from saved position
        homeMusic.currentTime = homeMusicPosition;
        homeMusic.volume = 0;
        homeMusic.play().then(() => {
            const fadeInInterval = setInterval(() => {
                if (homeMusic.volume < 0.65) {
                    homeMusic.volume = Math.min(0.7, homeMusic.volume + 0.05);
                } else {
                    homeMusic.volume = 0.7;
                    clearInterval(fadeInInterval);
                }
            }, 50);
        }).catch(err => console.log('Home music play failed:', err));
    }
}

function switchMusic(sceneId) {
    const musicId = sceneMusic[sceneId];
    if (!musicId) return;
    
    const newMusic = document.getElementById(musicId);
    if (!newMusic) return;
    
    // Stop home music if playing (preserve position)
    if (homeMusic && !homeMusic.paused) {
        homeMusicPosition = homeMusic.currentTime; // Save position
        const fadeOutHome = setInterval(() => {
            if (homeMusic.volume > 0.05) {
                homeMusic.volume = Math.max(0, homeMusic.volume - 0.05);
            } else {
                homeMusic.volume = 0;
                homeMusic.pause();
                clearInterval(fadeOutHome);
            }
        }, 30);
    }
    
    // If same music, just ensure it's playing
    if (currentMusic === newMusic) {
        newMusic.play();
        return;
    }
    
    // Fade out current music
    if (currentMusic) {
        const fadeOutInterval = setInterval(() => {
            if (currentMusic.volume > 0.05) {
                currentMusic.volume = Math.max(0, currentMusic.volume - 0.05);
            } else {
                currentMusic.volume = 0;
                currentMusic.pause();
                currentMusic.currentTime = 0;
                clearInterval(fadeOutInterval);
            }
        }, 30);
    }
    
    // Fade in new music
    setTimeout(() => {
        newMusic.volume = 0;
        newMusic.play().then(() => {
            currentMusic = newMusic;
            
            const fadeInInterval = setInterval(() => {
                if (newMusic.volume < 0.95) {
                    newMusic.volume = Math.min(1, newMusic.volume + 0.05);
                } else {
                    newMusic.volume = 1;
                    clearInterval(fadeInInterval);
                }
            }, 30);
        }).catch(err => {
            console.log('Music play failed:', err);
            currentMusic = newMusic;
        });
    }, 400);
}

// ================================
// PARTICLE SYSTEM
// ================================

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const stars = [];
    const particleCount = 40;
    const starCount = 120;
    
    // Particle types: hearts, stars, sparkles
    const types = ['❤', '✨', '💫', '⭐', '💕', '🌟'];
    
    // Create floating emoji particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 15 + 5,
            type: types[Math.floor(Math.random() * types.length)],
            opacity: Math.random() * 0.5 + 0.2,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.02 + 0.01
        });
    }
    
    // Create small twinkling stars for cosmic effect
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw twinkling stars
        stars.forEach(s => {
            s.twinklePhase += s.twinkleSpeed;
            const currentOpacity = Math.abs(Math.sin(s.twinklePhase)) * s.opacity;
            
            ctx.save();
            ctx.globalAlpha = currentOpacity;
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Draw floating particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.wobble += p.wobbleSpeed;
            
            // Boundary wrap
            if (p.x < -20) p.x = canvas.width + 20;
            if (p.x > canvas.width + 20) p.x = -20;
            if (p.y < -20) p.y = canvas.height + 20;
            if (p.y > canvas.height + 20) p.y = -20;
            
            // Draw particle
            ctx.save();
            ctx.globalAlpha = p.opacity + Math.sin(p.wobble) * 0.2;
            ctx.font = `${p.size}px Arial`;
            ctx.fillText(p.type, p.x + Math.sin(p.wobble) * 5, p.y);
            ctx.restore();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ================================
// PARALLAX EFFECT
// ================================

function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        layers[0].style.transform = `translate(${x * 20}px, ${y * 20}px)`; // back
        layers[1].style.transform = `translate(${x * 10}px, ${y * 10}px)`; // mid
        layers[2].style.transform = `translate(${x * 5}px, ${y * 5}px)`;  // front
    });
}

// ================================
// FLOATING OBJECTS INTERACTION
// ================================

function initFloatingObjects() {
    const floatingObjects = document.querySelectorAll('.floating-object');
    
    floatingObjects.forEach(obj => {
        obj.addEventListener('click', (e) => {
            const sceneName = obj.getAttribute('data-scene');
            openScene(sceneName);
        });
        
        // Add random rotation on hover
        obj.addEventListener('mouseenter', (e) => {
            const randomRotation = (Math.random() - 0.5) * 10;
            e.currentTarget.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
        });
        
        obj.addEventListener('mouseleave', (e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        });
    });
}

// ================================
// SCENE NAVIGATION
// ================================

function openScene(sceneName) {
    const universeView = document.getElementById('universeView');
    const scene = document.getElementById(sceneName);
    
    if (!scene) return;
    
    // Switch to scene-specific music
    switchMusic(sceneName);
    
    // Fade out universe
    universeView.style.transition = 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    universeView.style.opacity = '0';
    universeView.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        universeView.style.display = 'none';
        scene.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Trigger scene-specific animations
        if (sceneName === 'late-night') {
            startTypewriter();
        }
    }, 600);
}

function closeScene() {
    const activeScene = document.querySelector('.scene-container.active');
    const universeView = document.getElementById('universeView');
    
    if (!activeScene) return;
    
    // Stop scene music and resume home music
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
        currentMusic.volume = 1; // Reset volume for next play
        currentMusic = null;
    }
    
    // Resume home music (wait for scene music to stop)
    setTimeout(() => {
        startHomeMusic();
    }, 500);
    
    activeScene.classList.remove('active');
    
    setTimeout(() => {
        universeView.style.display = 'block';
        setTimeout(() => {
            universeView.style.opacity = '1';
            universeView.style.transform = 'scale(1)';
        }, 50);
    }, 600);
}

function initSceneNavigation() {
    const backButtons = document.querySelectorAll('.back-button');
    
    backButtons.forEach(btn => {
        btn.addEventListener('click', closeScene);
    });
}

// ================================
// TYPEWRITER EFFECT
// ================================

function startTypewriter() {
    const textElement = document.querySelector('.typewriter-text');
    if (!textElement || textElement.classList.contains('typed')) return;
    
    textElement.classList.add('typed');
    // Just fade in - the CSS handles the rest
}

// ================================
// STARS FOR NIGHT SCENE
// ================================

function initStars() {
    const starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) return;
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'decorative-star';
        star.style.setProperty('--x', `${Math.random() * 100}%`);
        star.style.setProperty('--y', `${Math.random() * 100}%`);
        star.style.setProperty('--delay', `${Math.random() * 3}s`);
        star.style.position = 'absolute';
        starsContainer.appendChild(star);
    }
}

// ================================
// SURPRISE SCENE
// ================================

function initSurprise() {
    const surpriseButton = document.getElementById('surpriseButton');
    const surpriseMessage = document.getElementById('surpriseMessage');
    
    if (!surpriseButton) return;
    
    surpriseButton.addEventListener('click', () => {
        surpriseButton.style.transform = 'scale(0)';
        surpriseButton.style.opacity = '0';
        
        setTimeout(() => {
            surpriseButton.style.display = 'none';
            surpriseMessage.classList.add('visible');
            createConfetti();
            createFloatingHearts();
        }, 400);
    });
}

function createConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#FFB6C1', '#FFD1DC', '#E6E6FA', '#FFD700', '#FFC0CB'];
    
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4
        });
    }
    
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((c, index) => {
            c.x += c.vx;
            c.y += c.vy;
            c.rotation += c.rotationSpeed;
            c.vy += 0.1; // gravity
            
            if (c.y > canvas.height + 20) {
                confetti.splice(index, 1);
            }
            
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
            ctx.restore();
        });
        
        if (confetti.length > 0) {
            requestAnimationFrame(animateConfetti);
        }
    }
    
    animateConfetti();
}

function createFloatingHearts() {
    const scene = document.getElementById('surprise');
    const heartCount = 30;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.textContent = Math.random() > 0.5 ? '❤️' : '💕';
        heart.style.position = 'fixed';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.bottom = '-50px';
        heart.style.fontSize = `${Math.random() * 20 + 15}px`;
        heart.style.opacity = '0.8';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '999';
        heart.style.transition = `all ${Math.random() * 2 + 3}s ease-out`;
        
        scene.appendChild(heart);
        
        setTimeout(() => {
            heart.style.bottom = '120vh';
            heart.style.opacity = '0';
            heart.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
        }, 100);
        
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }
}

// ================================
// SCENE PARTICLES
// ================================

function initSceneParticles() {
    const sceneParticles = document.querySelectorAll('.scene-particles');
    
    sceneParticles.forEach(container => {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.textContent = '✨';
            particle.style.position = 'absolute';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.fontSize = `${Math.random() * 15 + 10}px`;
            particle.style.opacity = `${Math.random() * 0.4 + 0.2}`;
            particle.style.animation = `floatDrift ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * 2}s infinite alternate`;
            particle.style.pointerEvents = 'none';
            container.appendChild(particle);
        }
    });
}

// ================================
// TOUCH SUPPORT FOR MOBILE
// ================================

// Add touch event handlers
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const layers = document.querySelectorAll('.parallax-layer');
    
    const x = (touch.clientX / window.innerWidth - 0.5) * 2;
    const y = (touch.clientY / window.innerHeight - 0.5) * 2;
    
    layers[0].style.transform = `translate(${x * 15}px, ${y * 15}px)`;
    layers[1].style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    layers[2].style.transform = `translate(${x * 4}px, ${y * 4}px)`;
});

// ================================
// KEYBOARD NAVIGATION
// ================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeScene();
    }
});

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

// Reduce animations when battery is low
if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        if (battery.level < 0.2 && !battery.charging) {
            document.body.classList.add('low-power-mode');
        }
    });
}

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.querySelectorAll('.floating-object').forEach(obj => {
            obj.style.animationPlayState = 'paused';
        });
    } else {
        document.querySelectorAll('.floating-object').forEach(obj => {
            obj.style.animationPlayState = 'running';
        });
    }
});
