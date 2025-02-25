// Cursor movement handler
document.addEventListener('mousemove', function(event) {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    
    const moveX = Math.round(event.pageX / 16) * 16;
    const moveY = Math.round(event.pageY / 16) * 16;

    cursor.style.left = `${moveX}px`;
    cursor.style.top = `${moveY}px`;

    const element = document.elementFromPoint(event.clientX, event.clientY);
    if (!element) return;
    
    const backgroundColor = getComputedStyle(element).backgroundColor;
    cursor.style.backgroundColor = isDark(backgroundColor) ? 'white' : 'black';
});

// Check if color is dark
function isDark(color) {
    const rgb = color.match(/\d+/g);
    if (!rgb) return false;
    const brightness = (Number(rgb[0]) * 299 + Number(rgb[1]) * 587 + Number(rgb[2]) * 114) / 1000;
    return brightness < 128;
}


// Quiz variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// File loading function
function loadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput?.files[0];
    if (!file) return alert('Please select a file');
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            const yesNo = Object.entries(data.pytania || {}).flatMap(([_, q]) => Object.entries(q));
            const abcd = Object.entries(data.pytania_abcd || {}).flatMap(([_, q]) => Object.entries(q));
            
            questions = [...yesNo, ...abcd].sort(() => Math.random() - 0.5).slice(0, 10);
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                quizContainer.classList.remove('hidden');
                showQuestion();
            }
        } catch (error) {
            console.error('Error parsing file:', error);
            alert('Error loading file. Please check the file format.');
        }
    };
    reader.readAsText(file);
}
// Show question function
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showFinalScore();
        return;
    }
    
    const [questionText, answerData] = questions[currentQuestionIndex];
    console.log('Displaying question:', questionText); // Debugging line for question display
    
    const counterEl = document.getElementById('counter');
    const scoreEl = document.getElementById('score');
    const questionEl = document.getElementById('question');
    
    if (counterEl) counterEl.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    if (scoreEl) scoreEl.innerText = `Score: ${score}`;
    if (questionEl) questionEl.innerText = questionText;
    
    const answersDiv = document.getElementById('answers');
    if (!answersDiv) return;
    
    answersDiv.innerHTML = '';

    if (typeof answerData === 'string') {
        // Yes/No questions
        ['TAK', 'NIE'].forEach(option => {
            const btn = document.createElement('button');
            btn.innerText = option;
            btn.className = 'answer-button';
            btn.onclick = () => submitAnswer(option === answerData);
            answersDiv.appendChild(btn);
        });
    } else {
        // Multiple choice questions
        Object.entries(answerData.odpowiedzi).forEach(([key, value]) => {
            const label = document.createElement('label');
            label.classList.add('answer-label');

            const span = document.createElement('span');
            span.innerText = '[   ] ' + key + '. ' + value;
            span.setAttribute('data-key', key);
            span.onclick = () => toggleSelection(span);

            label.appendChild(span);
            answersDiv.appendChild(label);
            answersDiv.appendChild(document.createElement('br'));
        });
    }
}

// Toggle selection function
function toggleSelection(span) {
    if (!span) return;
    if (span.innerText.startsWith('[ * ]')) {
        span.innerText = '[   ] ' + span.innerText.substring(5);
    } else {
        span.innerText = '[ * ] ' + span.innerText.substring(5);
    }
}

// Submit answer function
function submitAnswer(isCorrect) {
    if (typeof isCorrect === 'boolean') {
        if (isCorrect) score++;
    } else {
        const selected = [...document.querySelectorAll('.answer-label span')]
            .filter(span => span.innerText.startsWith('[ * ]'))
            .map(span => span.getAttribute('data-key'));

        const correct = new Set(questions[currentQuestionIndex][1].poprawne);
        if (selected.length && selected.every(ans => correct.has(ans)) && selected.length === correct.size) {
            score++;
        }
    }
    currentQuestionIndex++;
    showQuestion();
}

// Show final score function
function showFinalScore() {
    const counterEl = document.getElementById('counter');
    const questionEl = document.getElementById('question');
    const answersEl = document.getElementById('answers');
    const submitEl = document.getElementById('submit');
    const scoreEl = document.getElementById('score');
    
    if (counterEl) counterEl.innerText = '';
    if (questionEl) questionEl.innerText = `Quiz Finished!`;
    if (scoreEl) scoreEl.innerText = `Final Score: ${score}/${questions.length}`;
    if (answersEl) answersEl.innerHTML = '';
    if (submitEl) submitEl.style.display = 'none';
}

function updateClock() {
    const clock = document.getElementById('clock');
    if (!clock) {
        console.error('Clock element not found');
        return;
    }
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    clock.textContent = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

document.addEventListener("DOMContentLoaded", function() {
    // Create clock element if it doesn't exist
    if (!document.getElementById('clock')) {
        const clockDiv = document.createElement('div');
        clockDiv.id = 'clock';
        clockDiv.className = 'clock';
        document.body.appendChild(clockDiv);
    }
    
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
});

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(`${sectionName}-section`);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }
}

// // Show instruction section by default
// showSection('main');


// Initialize clock when DOM is loaded
// Dropdown toggle functionality
document.querySelectorAll('.dropdown').forEach(function(dropdown) {
    const button = dropdown.querySelector('.dropbtn');
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    
    button.addEventListener('click', function() {
        dropdownContent.classList.toggle('show');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Calculator toggle
    const calculatorLink = document.getElementById('open-calculator-link');
    const calculatorPopup = document.getElementById('calculator-popup');
    const closeCalculatorBtn = document.getElementById('close-calculator-btn');
    const calculatorHeader = calculatorPopup?.querySelector('.calculator-header');

    // Dragging functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target.closest('.calculator-header')) {
            isDragging = true;
        }
    }

    function dragEnd() {
        isDragging = false;
    }

    function drag(e) {
        if (isDragging && calculatorPopup) {
            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            // Remove the transform: translateX(-50%) when dragging starts
            calculatorPopup.style.transform = 'none';
            calculatorPopup.style.left = currentX + "px";
            calculatorPopup.style.top = currentY + "px";
        }
    }

    // Calculator toggle functionality
    if (calculatorLink) {
        calculatorLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (calculatorPopup) {
                calculatorPopup.style.display = 'block';
                // Reset position when opening
                if (!xOffset && !yOffset) {
                    const rect = calculatorPopup.getBoundingClientRect();
                    xOffset = window.innerWidth / 2 - rect.width / 2;
                    yOffset = window.innerHeight / 5;
                    calculatorPopup.style.transform = 'none';
                    calculatorPopup.style.left = xOffset + "px";
                    calculatorPopup.style.top = yOffset + "px";
                }
            }
        });
    }

    if (closeCalculatorBtn) {
        closeCalculatorBtn.addEventListener('click', function() {
            if (calculatorPopup) {
                calculatorPopup.style.display = 'none';
            }
        });
    }

    // Add drag event listeners
    if (calculatorHeader) {
        calculatorHeader.addEventListener("mousedown", dragStart);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", dragEnd);
        
        // Touch events for mobile
        calculatorHeader.addEventListener("touchstart", dragStart);
        document.addEventListener("touchmove", drag);
        document.addEventListener("touchend", dragEnd);
    }

    // Calculator functions
    window.appendToDisplay = function(value) {
        const display = document.getElementById('calc-display');
        if (display) {
            if (display.value === 'Error') {
                display.value = '';
            }
            display.value += value;
        }
    };

    window.clearDisplay = function() {
        const display = document.getElementById('calc-display');
        if (display) {
            display.value = '';
        }
    };

    window.calculateResult = function() {
        const display = document.getElementById('calc-display');
        if (!display) return;
        
        try {
            // Sanitize the input to only allow basic math operations
            const sanitizedExpression = display.value.replace(/[^0-9+\-*/().]/g, '');
            // Use Function instead of eval for better security
            const result = new Function('return ' + sanitizedExpression)();
            display.value = Number.isFinite(result) ? result : 'Error';
        } catch (error) {
            display.value = 'Error';
        }
    };
});


// Remove the duplicate updateActions call since it's not defined
// window.onload = updateActions;