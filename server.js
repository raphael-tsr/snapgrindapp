const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Fichier JSON pour stocker les avis
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

// Crée le fichier si inexistant
if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, '[]', 'utf8');
}

// Charger les avis existants
let reviews = [];
try {
    reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
} catch (e) {
    console.error('Erreur lecture reviews.json, fichier vide ou corrompu');
    reviews = [];
}

// Sauvegarde des avis
function saveReviews() {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
}

// GET résumé
app.get('/api/summary', (req, res) => {
    const total = reviews.length;
    const average = total ? reviews.reduce((sum,r) => sum + r.rating, 0) / total : 0;
    res.json({ total, average });
});

// GET tous les avis
app.get('/api/reviews', (req, res) => {
    res.json({ total: reviews.length, reviews });
});

// POST nouvel avis
app.post('/api/reviews', (req, res) => {
    const { pseudo, rating, comment } = req.body;

    if (!pseudo || !comment || !rating) {
        return res.status(400).json({ message: "Données invalides : pseudo, rating ou comment manquant" });
    }

    const newReview = {
        id: 'rv_' + String(reviews.length + 1).padStart(6,'0'),
        pseudo,
        rating: Math.max(1, Math.min(5, rating)),
        comment,
        createdAt: Date.now()
    };

    reviews.push(newReview);
    saveReviews();
    res.json({ review: newReview });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
