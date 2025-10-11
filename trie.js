const fs = require('fs');
const path = require('path');

const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

// Lire les avis existants
let reviews = [];
if (fs.existsSync(REVIEWS_FILE)) {
    try {
        reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
    } catch (e) {
        console.error("Erreur lecture reviews.json");
        reviews = [];
    }
}

// Tri : d'abord par rating (5 -> 1), ensuite par createdAt (récent -> ancien)
reviews.sort((a, b) => {
    if (b.rating !== a.rating) {
        return b.rating - a.rating; // plus d'étoiles en premier
    }
    return b.createdAt - a.createdAt; // plus récent en premier
});

// Sauvegarder le résultat
fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');

console.log("Tri terminé ! Le fichier reviews.json a été mis à jour.");
