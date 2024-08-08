let altitude = 0;
let isRising = false;
let swayInterval;

function startRandomSway() {
    const balloon = document.getElementById('balloon');

    function sway() {
        if (!isRising) {
            const randomTilt = Math.random() * 6 - 3;  // Rotation aléatoire entre -3 et 3 degrés
            const randomX = Math.random() * 10 - 5;   // Mouvement léger sur l'axe X entre -5 et 5 pixels

            balloon.style.transform = `translateX(${randomX}px) rotate(${randomTilt}deg)`;

            const nextSwayTime = Math.random() * 3000 + 2000;
            swayInterval = setTimeout(sway, nextSwayTime);
        }
    }

    sway();
}

function fetchData() {
    const simulatedApiResponse = Math.floor(Math.random() * 100) + 1;
    updateBalloon(simulatedApiResponse);
}

function stopSway() {
    clearTimeout(swayInterval);
}

function updateBalloon(newValue) {
    const balloon = document.getElementById('balloon');
    altitude += newValue;
    isRising = true;
    stopSway();

    document.getElementById('altitude').textContent = `Altitude: ${altitude}px`;

    const randomTilt = Math.random() * 20 - 10;
    const randomX = Math.random() * 10 - 5;

    balloon.style.transition = `bottom 1s ease-in-out, transform 0.5s ease-in-out`;
    balloon.style.bottom = `${altitude - 1850}px`;
    balloon.style.transform = `translateX(${randomX}px) rotate(${randomTilt}deg)`;

    // Calcul du défilement pour suivre la montgolfière
    const scrollY = Math.max(0, 1850 - (altitude - (innerHeight / 2)));
    window.scrollTo({
        top: scrollY,
        behavior: 'smooth' // Utilisation de 'smooth' pour un défilement fluide
    });

    setTimeout(() => {
        isRising = false;
        balloon.style.transition = `transform 2s ease-in-out`;
        startRandomSway();
    }, 1000);
}

function scrollToBottom() {
    // Calculer la hauteur totale du document
    const totalHeight = document.documentElement.scrollHeight;

    // Faire défiler la page jusqu'en bas
    window.scrollTo({
        top: totalHeight,
        behavior: 'instant' // Utilisation de 'instant' pour éviter les problèmes de défilement
    });
}
function resetBalloonPosition() {
    const balloon = document.getElementById('balloon');
    
    // Positionner la montgolfière hors de la vue (en haut de la fenêtre)
    balloon.style.bottom = '-100%';
    balloon.style.transition = 'none'; // Désactiver les transitions temporairement

    // Attendre un court instant pour permettre au navigateur de mettre à jour le style
    setTimeout(() => {
        // Définir la hauteur totale du contenu pour ajuster le défilement
        const totalHeight = document.documentElement.scrollHeight;

        // Faire défiler jusqu'en bas
        window.scrollTo({
            top: totalHeight - window.innerHeight, // Ajuster pour voir le bas de la page
            behavior: 'instant' // Utiliser 'instant' pour éviter les animations de défilement
        });

        // Déplacer la montgolfière en bas de la fenêtre et réactiver les transitions
        balloon.style.transition = 'bottom 1s ease-in-out, transform 2s ease-in-out';
        balloon.style.bottom = '-1850px';
        altitude = 0;
    }, 100); // Délai pour s'assurer que le style est appliqué
}

window.onload = function() {
    // S'assurer que la montgolfière est en bas après le chargement complet
    resetBalloonPosition(); // Réinitialiser la position de la montgolfière
    startRandomSway(); // Démarre le tangage aléatoire
};