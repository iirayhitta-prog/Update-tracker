const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const TOKEN = process.env.TOKEN;
const GAME_ID = "155615604";
const CHECK_INTERVAL = 300000; // 5 minutes

let lastUpdated = null;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function checkGameUpdate() {
  try {
    const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${GAME_ID}`);
    const data = await response.json();

    const game = data.data[0];
    const updated = game.updated;
    const description = game.description;

    if (lastUpdated && lastUpdated !== updated) {
      const channel = client.channels.cache.find(ch => ch.name === "updates");

      if (!channel) return;

      const role = channel.guild.roles.cache.find(r => r.name === "PL Update");

      const embed = new EmbedBuilder()
        .setColor(0xFFD700)
        .setTitle("Prison Life Updated!")
        .setDescription(description)
        .setTimestamp(new Date(updated));

      channel.send({
        content: role ? `<@&${role.id}>` : "",
        embeds: [embed]
      });
    }

    lastUpdated = updated;

  } catch (error) {
    console.error("Error checking update:", error);
  }
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  setInterval(checkGameUpdate, CHECK_INTERVAL);
  checkGameUpdate();
});

client.login(TOKEN);
