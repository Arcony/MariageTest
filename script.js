let altitude = 0;
let isRising = false;
let swayInterval;
let fetchInterval; // Ajout d'une variable pour gérer l'intervalle de récupération des données

// Fonction pour obtenir le jeton d'accès de l'API PayPal
async function getAccessToken(clientId, clientSecret) {
    const auth = btoa(`${clientId}:${clientSecret}`);
    
    const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    
    if (!response.ok) {
        throw new Error('Failed to obtain access token');
    }
    
    const data = await response.json();
    return data.access_token;
}

// Fonction pour récupérer le solde du compte PayPal
async function getAccountBalance(accessToken) {
    const response = await fetch('https://api.sandbox.paypal.com/v1/reporting/balances', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch account balance');
    }

    const data = await response.json();
    return data.balances[0].available_balance.value; // Assurez-vous de vérifier la structure de la réponse
}

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

async function fetchData() {
     const simulatedApiResponse = Math.floor(Math.random() * 100) + 1;
    updateBalloon(simulatedApiResponse);
}

async function fetchData2() {
    console.log("test")
    const spreadsheetId = '1q61_ZkAFCXc-XoBRyeT45KX_O-YzYKDo4u0BucxEjgI'; // Remplacez par votre ID de feuille Google Sheets
    const range = 'Data!A1'; // Remplacez 'Sheet1' par le nom de votre feuille si nécessaire
    const apiKey = 'AIzaSyDnGwknWZf4Hio5X_oSBPbnTII7bJ_FxYQ'; // Remplacez par votre clé API Google

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch data from Google Sheets');
        }

        const data = await response.json();
        const cellValue = parseInt(data.values[0][0], 10); // Supposant que la valeur est un nombre entier

        if (!isNaN(cellValue)) {
            updateBalloon(cellValue); // Utilise la valeur de A1 pour mettre à jour la montgolfière
        } else {
            console.error('La valeur dans A1 n\'est pas un nombre');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

function startFetchingDataInterval() {
    fetchData2(); // Utiliser fetchData2 au lieu de fetchData

    fetchInterval = setInterval(fetchData2, 250); // Appeler fetchData2 toutes les 5 minutes
}

function startFetchingDataInterval() {
    // Appeler fetchData immédiatement au démarrage
    fetchData();

    // Mettre en place l'intervalle pour récupérer les données toutes les 5 minutes (300000 ms)
    fetchInterval = setInterval(fetchData, 300000);
}

function stopSway() {
    clearTimeout(swayInterval);
}

function stopFetchingDataInterval() {
    clearInterval(fetchInterval);
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
    balloon.style.bottom = `${altitude - 2200}px`;
    balloon.style.transform = `translateX(${randomX}px) rotate(${randomTilt}deg)`;

    // Calcul du défilement pour suivre la montgolfière
    const scrollY = Math.max(0, 2200 - (altitude - (innerHeight / 2)));
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
        balloon.style.bottom = 2200;
        altitude = 0;
    }, 100); // Délai pour s'assurer que le style est appliqué
}

window.onload = function() {
    // S'assurer que la montgolfière est en bas après le chargement complet
    resetBalloonPosition(); // Réinitialiser la position de la montgolfière
    startRandomSway(); // Démarre le tangage aléatoire
    startFetchingDataInterval(); // Commencer la récupération des données à intervalles réguliers
};
