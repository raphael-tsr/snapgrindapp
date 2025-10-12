import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// ⚙️ CONFIG
const DISCORD_TOKEN = "MTM5MTQ0ODE4OTM4MjQyNjczNQ.G93eEl.NmPs9Li5U3uuQGC3wDdJJ77Z3VCjOZgsXccjmk";
const CHANNEL_ID = "1426882761674854512";
const FILE_REVIEWS = "./reviews.json";
const FILE_SENT = "./sentReviews.json";

// --- Fonctions utilitaires ---
function loadJSON(path, defaultValue = []) {
  if (!fs.existsSync(path)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch {
    return defaultValue;
  }
}

function saveJSON(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function calculerMoyenne(reviews) {
  if (reviews.length === 0) return 0;
  const somme = reviews.reduce((a, r) => a + (r.rating || 0), 0);
  return somme / reviews.length;
}

// --- Fonction pour envoyer les nouveaux avis ---
async function checkAndSendReviews(channel) {
  const sentList = loadJSON(FILE_SENT, []);
  const allReviews = loadJSON(FILE_REVIEWS, []);

  const nouveaux = allReviews.filter(r => !sentList.includes(r.createdAt));

  if (nouveaux.length === 0) return;

  for (const review of nouveaux) {
    const msg = `💬 **${review.pseudo}** a laissé ${review.rating}⭐\n> ${review.comment}`;
    await channel.send(msg);
    sentList.push(review.createdAt);
  }

  saveJSON(FILE_SENT, sentList);

  const moyenne = calculerMoyenne(allReviews);
  await channel.send(`📊 **Moyenne actuelle :** ${moyenne.toFixed(2)}⭐ sur ${allReviews.length} avis.`);
}

// --- Lancement du bot ---
client.once("ready", async () => {
  console.log(`🤖 Connecté en tant que ${client.user.tag}`);
  const channel = await client.channels.fetch(CHANNEL_ID);

  // Vérifie toutes les 30 secondes
  setInterval(() => {
    checkAndSendReviews(channel).catch(console.error);
  }, 30000);

  // Envoi immédiat au démarrage
  checkAndSendReviews(channel).catch(console.error);
});

client.login(DISCORD_TOKEN);
