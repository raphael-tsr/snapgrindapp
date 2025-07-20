// JS combiné
let score = 0;
const scoreDisplay = document.getElementById("score");
const scoreInput = document.getElementById("scoreInput");
const errorMsg = document.getElementById("error-message");

function increaseScore() {
  if (score < 1000000) {
    score += 5000;
    scoreDisplay.textContent = score.toLocaleString() + " ";
    scoreInput.value = score;
    updatePrice();
    setTimeout(increaseScore, 10);
  }
}

function updatePrice() {
  const inputScore = parseInt(scoreInput.value);
  let price = 0;

  if (inputScore > 1000000) {
    errorMsg.style.display = 'block';
    return;
  } else {
    errorMsg.style.display = 'none';
  }

  if (inputScore % 5000 !== 0) {
    document.getElementById('price').textContent = '❌ Le score doit être un multiple de 5 000.';
    return;
  }

  if (inputScore === 50000) {
    price = 9;
  } else if (inputScore === 100000) {
    price = 17;
  } else if (inputScore === 500000) {
    price = 75;
  } else if (inputScore === 1000000) {
    price = 140;
  } else {
    price = inputScore / 5000;
  }

  const priceUSD = (price * 1.1).toFixed(2);
  document.getElementById('price').textContent = `Prix : ${price}€ / ≈ ${priceUSD}$`;
}

// Lance l’animation
increaseScore();

// Recalcule le prix si l'utilisateur change le score manuellement
scoreInput.addEventListener("input", updatePrice);
