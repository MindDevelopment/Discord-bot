// bot.js - De bot die je beheert via PM2
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');  // Zorg ervoor dat dit bestand bestaat

// Maak een nieuwe Discord Client aan met de benodigde intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// Event: Wanneer de bot online gaat
client.once('ready', () => {
    console.log('Bot is online!');
});

// Event: Wanneer een bericht wordt ontvangen
client.on('messageCreate', message => {
    // Zorg ervoor dat de bot niet reageert op zijn eigen berichten
    if (message.author.bot) return;

    // Je kunt hier je eigen command-handling logica toevoegen
    if (message.content === '!ping') {
        message.reply('Pong!');
    }
});

// Login de bot met de token uit config.json
client.login(config.token);
