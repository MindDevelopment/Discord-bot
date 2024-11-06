const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.commands = new Discord.Collection();

// Lees de command-bestanden
fs.readdirSync('./commands').forEach(file => {
    if (file.endsWith('.js')) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
});

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) command.execute(message, args);
});

client.login(config.token);
