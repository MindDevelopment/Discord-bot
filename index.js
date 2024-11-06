// Importeer de nodige modules
const fs = require('fs');
const Discord = require('discord.js');
const { Intents } = require('discord.js'); // Importeer Intents
const config = require('./config.json');

// Maak een nieuwe Discord Client aan met de benodigde intents
const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,                 // Nodig voor guild-specifieke functies
        Intents.FLAGS.GUILD_MESSAGES,         // Nodig om berichten te lezen en te reageren
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS // Nodig om te reageren op berichten
    ]
});

// Laad alle commands in uit de commands-map
client.commands = new Discord.Collection();
fs.readdirSync('./commands').forEach(file => {
    if (file.endsWith('.js')) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
});

// Start het dashboard door het dashboard-bestand te importeren
require('./dashboard/dashboard');

// Event: Wanneer de bot online gaat
client.once('ready', () => {
    console.log('Bot is online!');
});

// Event: Wanneer een bericht wordt ontvangen
client.on('message', message => {
    // Controleer of het bericht begint met de prefix en niet van een bot afkomstig is
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    // Verwijder de prefix en splits het bericht in command en argumenten
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Zoek het command in de client.commands collectie
    const command = client.commands.get(commandName);
    if (command) {
        // Voer het command uit als het bestaat
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Er is iets fout gegaan bij het uitvoeren van dat command!');
        }
    }
});

// Login de bot met de token uit config.json
client.login(config.token);
