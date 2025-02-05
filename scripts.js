
document.addEventListener('mousemove', function(event) {
    const cursor = document.getElementById('cursor');
    const moveX = Math.round(event.pageX / 16) * 16;
    const moveY = Math.round(event.pageY / 16) * 16;

    cursor.style.left = `${moveX}px`;
    cursor.style.top = `${moveY}px`;

    // Pobierz kolor tła elementu pod kursorem
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const backgroundColor = getComputedStyle(element).backgroundColor;

    // Ustaw tło kursora na białe, jeśli tło pod kursorem jest ciemne
    cursor.style.backgroundColor = isDark(backgroundColor) ? 'white' : 'black';
});

// Funkcja sprawdzająca, czy kolor jest ciemny
function isDark(color) {
    // Pobierz wartości RGB z koloru
    const rgb = color.match(/\d+/g).map(Number);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 128; // Jeżeli jasność jest mniejsza niż 128, uznajemy za ciemny
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();

    document.getElementById('clock').textContent = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock(); // initial call to display the clock immediately
setInterval(updateClock, 1000);
updateClock(); // initial call to display the clock immediately



// Inicjalizuj opcje akcji przy ładowaniu strony
window.onload = updateActions;
