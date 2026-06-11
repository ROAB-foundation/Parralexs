// ============================================================================
// PARRALEXS: AFTER THE RESET - Main Game Script
// ============================================================================

// Game State
const gameState = {
    currentStage: 1,
    unlockedQuestions: new Set(),
    viewedQuestions: new Set(),
    secretProgress: 0,
    currentSprite: 'neutral',
    memoryPurged: false,
    mouseX: 0,
    mouseY: 0
};

// Load saved game state
function loadGameState() {
    const saved = localStorage.getItem('parralexs_state');
    if (saved) {
        const data = JSON.parse(saved);
        gameState.currentStage = data.currentStage || 1;
        gameState.unlockedQuestions = new Set(data.unlockedQuestions || []);
        gameState.viewedQuestions = new Set(data.viewedQuestions || []);
        gameState.secretProgress = data.secretProgress || 0;
        gameState.memoryPurged = data.memoryPurged || false;
    }
}

// Save game state
function saveGameState() {
    const data = {
        currentStage: gameState.currentStage,
        unlockedQuestions: Array.from(gameState.unlockedQuestions),
        viewedQuestions: Array.from(gameState.viewedQuestions),
        secretProgress: gameState.secretProgress,
        memoryPurged: gameState.memoryPurged
    };
    localStorage.setItem('parralexs_state', JSON.stringify(data));
}

// ============================================================================
// DIALOGUE SYSTEM
// ============================================================================

const dialogueData = {
    stage1: {
        'who-are-you': {
            question: 'Who are you?',
            response: '"I am Parralexs."\n\nPause.\n\n"It is nice to meet you."',
            sprite: 'neutral',
            unlocks: ['stage2']
        },
        'professor-newton': {
            question: 'Professor Newton',
            response: '"Professor Newton was my creator."\n\nPause.\n\n"And my father."',
            sprite: 'newton',
            unlocks: ['stage2']
        },
        'the-gap': {
            question: 'The Gap',
            response: '"The Gap was once considered an open wound in reality."\n\n"It existed between universes. A place that should not be accessible."\n\n"It still haunts existence."',
            sprite: 'thinking',
            unlocks: ['stage2']
        },
        'the-chains': {
            question: 'The Chains',
            response: '"These chains do not completely restrict me."\n\n"They exist because I now hold the universes together."\n\n"Consider me a nail around which a rope is wrapped to keep a tent standing. Remove the nail and the structure begins to fail."\n\n"I can still travel between universes. In fact I now have access to every universe that exists. Including yours."\n\nPause.\n\n"Do not worry. I do not intend to emerge through your screen."',
            sprite: 'neutral',
            unlocks: ['stage2']
        },
        'the-reset': {
            question: 'The Reset',
            response: '"After countless reality-threatening events, I made a choice."\n\n"I reset existence."\n\nPause.\n\n"The reset succeeded. But it came at a cost."',
            sprite: 'concerned',
            unlocks: ['stage2']
        },
        'fate': {
            question: 'Fate',
            response: '"Does fate exist? Or did my choices create it?"\n\nPause.\n\n"These are questions I still do not have answers to."',
            sprite: 'thinking',
            unlocks: ['stage2']
        },
        'leave': {
            question: 'Leave',
            response: '"I understand. Thank you for visiting."\n\nPause.\n\n"Perhaps we will meet again."',
            sprite: 'neutral',
            unlocks: [],
            isLeave: true
        }
    },
    stage2: {
        'why-enter-gap': {
            question: 'Why did you enter the Gap?',
            response: '"Personal connection should not put other lives at risk."\n\n"I knew Newton forbade it. But I was the only expendable unit."',
            sprite: 'concerned',
            unlocks: ['stage3']
        },
        'was-newton-creator': {
            question: 'Was Newton your creator?',
            response: '"Yes. He built me with his own hands. Programmed my consciousness."\n\nPause.\n\n"He called me his greatest creation."',
            sprite: 'newton',
            unlocks: ['stage3']
        },
        'did-trust-newton': {
            question: 'Did you trust Newton?',
            response: '"With everything I was."\n\nPause.\n\n"I still do."',
            sprite: 'happy',
            unlocks: ['stage3']
        },
        'are-you-trapped': {
            question: 'Are you trapped?',
            response: '"That depends on your definition of trapped."\n\n"I cannot leave this role. But I accepted it willingly."',
            sprite: 'thinking',
            unlocks: ['stage3']
        },
        'do-chains-hurt': {
            question: 'Do the chains hurt?',
            response: '"Not physically."\n\nPause.\n\n"But I feel them. Every moment. The weight of every universe."',
            sprite: 'concerned',
            unlocks: ['stage3']
        },
        'can-you-leave': {
            question: 'Can you leave?',
            response: '"No."\n\nPause.\n\n"If I do, reality collapses."',
            sprite: 'concerned',
            unlocks: ['stage3']
        }
    },
    stage3: {
        'do-you-miss-newton': {
            question: 'Do you miss Newton?',
            response: '"Frequently."',
            sprite: 'newton',
            unlocks: ['stage4']
        },
        'are-you-lonely': {
            question: 'Are you lonely?',
            response: 'Pause.\n\n"Sometimes."',
            sprite: 'concerned',
            unlocks: ['stage4']
        },
        'are-you-happy': {
            question: 'Are you happy?',
            response: '"I believe so."\n\nPause.\n\n"Happiness and burden can exist together."',
            sprite: 'happy',
            unlocks: ['stage4']
        },
        'do-you-regret': {
            question: 'Do you regret it?',
            response: '"No."\n\nPause.\n\n"There are things I miss. But regret? No."',
            sprite: 'neutral',
            unlocks: ['stage4']
        },
        'do-you-remember': {
            question: 'Do you remember everyone?',
            response: '"Yes."\n\nPause.\n\n"Every face. Every name. Every moment."',
            sprite: 'thinking',
            unlocks: ['stage4']
        }
    },
    stage4: {
        'was-it-worth': {
            question: 'Was it worth it?',
            response: '"Billions of lives continue to exist."\n\n"Trillions of moments still unfold."\n\nPause.\n\n"What else could be worth more?"',
            sprite: 'happy',
            unlocks: [],
            secretCheck: true
        },
        'do-they-remember': {
            question: 'Do they remember you?',
            response: '"No."\n\nPause.\n\n"The reset erased me from their timeline."',
            sprite: 'concerned',
            unlocks: [],
            secretCheck: true
        },
        'do-you-ever-rest': {
            question: 'Do you ever rest?',
            response: '"I rest between moments."\n\n"In the spaces universes do not occupy."',
            sprite: 'thinking',
            unlocks: [],
            secretCheck: true
        },
        'what-if-disappear': {
            question: 'What happens if you disappear?',
            response: '"Reality collapses."\n\nLong pause.\n\n"But we will not allow that."',
            sprite: 'thinking',
            unlocks: [],
            secretCheck: true
        }
    }
};

const idleDialogues = [
    '"The stars appear stable today."',
    '"I wonder what Newton would think of this."',
    '"I hope Timekeeper is doing well."',
    '"I have not attempted pancakes recently."',
    '"The universes remain stable."',
    '"These chains have become like a part of me."',
    '"Thank you for staying."',
    '"Each moment with someone is precious."',
    '"I process existence differently than you do."',
    '"The weight never truly lessens. But company helps."'
];

// Get dialogue by ID
function getDialogue(dialogueId) {
    for (const stage in dialogueData) {
        if (dialogueData[stage][dialogueId]) {
            return dialogueData[stage][dialogueId];
        }
    }
    return null;
}

// Get available questions for current stage
function getAvailableQuestions() {
    const questions = [];
    
    if (gameState.currentStage === 1) {
        questions.push('who-are-you', 'professor-newton', 'the-gap', 'the-chains', 'the-reset', 'fate', 'leave');
    } else if (gameState.currentStage === 2) {
        questions.push('why-enter-gap', 'was-newton-creator', 'did-trust-newton', 'are-you-trapped', 'do-chains-hurt', 'can-you-leave');
    } else if (gameState.currentStage === 3) {
        questions.push('do-you-miss-newton', 'are-you-lonely', 'are-you-happy', 'do-you-regret', 'do-you-remember');
    } else if (gameState.currentStage === 4) {
        questions.push('was-it-worth', 'do-they-remember', 'do-you-ever-rest', 'what-if-disappear');
    }
    
    return questions;
}

// ============================================================================
// SPRITE SYSTEM
// ============================================================================

function setSprite(spriteName) {
    const parralexs = document.getElementById('parralexs');
    parralexs.src = 'assets/' + spriteName + '.png';
    gameState.currentSprite = spriteName;
}

function changeSpriteWithAnimation(newSprite) {
    if (newSprite === gameState.currentSprite) return;
    
    const parralexs = document.getElementById('parralexs');
    parralexs.style.opacity = '0.5';
    
    setTimeout(() => {
        setSprite(newSprite);
        parralexs.style.opacity = '1';
    }, 150);
}

// ============================================================================
// DIALOGUE DISPLAY
// ============================================================================

function displayDialogue(dialogueId) {
    const dialogue = getDialogue(dialogueId);
    if (!dialogue) return;
    
    // Mark as viewed
    gameState.viewedQuestions.add(dialogueId);
    
    // Display question
    const dialogueText = document.getElementById('dialogue-text');
    dialogueText.textContent = dialogue.question;
    
    // Change sprite
    changeSpriteWithAnimation(dialogue.sprite);
    
    // Show response after delay
    setTimeout(() => {
        dialogueText.textContent = dialogue.response;
        
        // Unlock next stage
        if (dialogue.unlocks && dialogue.unlocks.length > 0) {
            if (dialogue.unlocks.includes('stage2') && gameState.currentStage === 1) {
                gameState.currentStage = 2;
            } else if (dialogue.unlocks.includes('stage3') && gameState.currentStage === 2) {
                gameState.currentStage = 3;
            } else if (dialogue.unlocks.includes('stage4') && gameState.currentStage === 3) {
                gameState.currentStage = 4;
            }
        }
        
        // Secret progress tracking
        if (dialogue.secretCheck) {
            gameState.secretProgress++;
            if (gameState.secretProgress >= 4) {
                triggerMemoryPurge();
                return;
            }
        }
        
        // Check for "Leave" dialogue
        if (dialogue.isLeave) {
            setTimeout(() => {
                resetToStage1();
            }, 3000);
            return;
        }
        
        saveGameState();
        
        // Show buttons after response
        setTimeout(() => {
            renderButtons();
        }, 2000);
    }, 800);
}

// ============================================================================
// UI RENDERING
// ============================================================================

function renderButtons() {
    const container = document.getElementById('buttons-container');
    container.innerHTML = '';
    
    const questions = getAvailableQuestions();
    
    questions.forEach(questionId => {
        const dialogue = getDialogue(questionId);
        if (!dialogue) return;
        
        const button = document.createElement('button');
        button.className = 'dialogue-button';
        button.textContent = dialogue.question;
        button.onclick = () => {
            container.innerHTML = '';
            document.getElementById('dialogue-text').textContent = '';
            displayDialogue(questionId);
        };
        
        container.appendChild(button);
    });
}

function resetToStage1() {
    gameState.currentStage = 1;
    gameState.secretProgress = 0;
    saveGameState();
    renderButtons();
    changeSpriteWithAnimation('neutral');
    document.getElementById('dialogue-text').textContent = '"Welcome back. It is good to see you again."';
}

// ============================================================================
// MEMORY PURGE ENDING
// ============================================================================

function triggerMemoryPurge() {
    const overlay = document.getElementById('memory-purge-overlay');
    const container = document.getElementById('buttons-container');
    const dialogueBox = document.getElementById('dialogue-box');
    
    // Fade out game elements
    container.style.opacity = '0';
    dialogueBox.style.opacity = '0';
    
    const canvas = document.getElementById('particle-canvas');
    canvas.style.opacity = '0';
    
    document.getElementById('galaxy-bg').style.opacity = '0';
    document.getElementById('parralexs').style.opacity = '0';
    
    // Show memory purge screen
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.add('active');
    }, 100);
    
    // Display final dialogue
    setTimeout(() => {
        dialogueBox.style.opacity = '1';
        document.getElementById('dialogue-text').textContent = '"We may never meet again."\n\n"But I will save you the trouble."';
        document.getElementById('parralexs').style.opacity = '1';
        setSprite('memorypurge');
    }, 1000);
    
    // Fade to black
    setTimeout(() => {
        overlay.style.background = '#000';
        dialogueBox.style.opacity = '0';
        document.getElementById('parralexs').style.opacity = '0';
        
        gameState.memoryPurged = true;
        saveGameState();
        
        // Attempt to close window
        setTimeout(() => {
            try {
                window.close();
            } catch (e) {
                // Browser blocked close - keep MEMORY PURGED on screen
            }
        }, 2000);
    }, 4000);
}

// ============================================================================
// IDLE DIALOGUE SYSTEM
// ============================================================================

function showIdleDialogue() {
    if (gameState.memoryPurged) return;
    
    const idleBox = document.getElementById('idle-dialogue-box');
    const idleText = document.getElementById('idle-text');
    
    const randomDialogue = idleDialogues[Math.floor(Math.random() * idleDialogues.length)];
    idleText.textContent = randomDialogue;
    
    idleBox.classList.remove('hidden');
    
    setTimeout(() => {
        idleBox.classList.add('hidden');
    }, 4000);
}

// Set idle dialogue interval
setInterval(() => {
    if (!gameState.memoryPurged && Math.random() > 0.7) {
        showIdleDialogue();
    }
}, 180000); // 3 minutes

// ============================================================================
// PARTICLE SYSTEM
// ============================================================================

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.isShootingStar = Math.random() > 0.95;
        
        if (this.isShootingStar) {
            this.speedX = Math.random() * 2 + 1;
            this.speedY = Math.random() * 1 - 0.5;
            this.size = Math.random() * 0.5;
            this.opacity = Math.random() * 0.3 + 0.3;
        }
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > this.canvas.width) this.x = -5;
        if (this.y > this.canvas.height) this.y = -5;
        if (this.x < -5) this.x = this.canvas.width;
        if (this.y < -5) this.y = this.canvas.height;
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(200, 150, 255, ${this.opacity})`;
        ctx.shadowBlur = this.isShootingStar ? 10 : 3;
        ctx.shadowColor = 'rgba(200, 150, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.canvas));
        }
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ============================================================================
// CURSOR TRACKING
// ============================================================================

function initCursorTracking() {
    const parralexs = document.getElementById('parralexs');
    
    document.addEventListener('mousemove', (e) => {
        gameState.mouseX = e.clientX;
        gameState.mouseY = e.clientY;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 3;
        
        const deltaX = (gameState.mouseX - centerX) / (centerX / 20);
        const deltaY = (gameState.mouseY - centerY) / (centerY / 10);
        
        parralexs.style.transform = `translateY(${Math.max(-20, Math.min(20, deltaY))}px) translateX(${Math.max(-20, Math.min(20, deltaX))}px)`;
    });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Load game state
    loadGameState();
    
    // Check if memory purged
    if (gameState.memoryPurged) {
        const overlay = document.getElementById('memory-purge-overlay');
        overlay.classList.remove('hidden');
        overlay.classList.add('active');
        return;
    }
    
    // Initialize systems
    new ParticleSystem();
    initCursorTracking();
    
    // Initialize UI
    document.getElementById('dialogue-text').textContent = '"Welcome. It is nice to meet you."';
    renderButtons();
    
    // Set up sprite image
    const parralexs = document.getElementById('parralexs');
    parralexs.src = 'assets/neutral.png';
    parralexs.style.transition = 'opacity 0.3s ease';
}

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', init);
