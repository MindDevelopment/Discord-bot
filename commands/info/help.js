const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Toont een lijst van beschikbare commando\'s per categorie',

    async execute(message, args) {
        // Laad de submappen (categorieën) van de 'commands' map
        const categoriesPath = path.join(__dirname, '..', 'commands');  // Zorg ervoor dat het juiste pad naar de commands map wordt gebruikt
        const categories = fs.readdirSync(categoriesPath).filter(file => fs.statSync(path.join(categoriesPath, file)).isDirectory());

        // Help bericht met uitleg
        const helpMessage = `**Bot Help Menu**\nKies een categorie uit het dropdown-menu om de commando's te bekijken.`;

        // Maak de eerste dropdown met categorieën
        const row1 = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('category_select')
                    .setPlaceholder('Kies een categorie...')
                    .addOptions(categories.map(category => ({
                        label: category,
                        value: category,
                        description: `Bekijk de commando\'s voor ${category}`,
                    }))),
            );

        // Stuur de embed met de dropdown
        const embed = new EmbedBuilder()
            .setColor('BLUE')
            .setTitle('Help Menu')
            .setDescription(helpMessage);

        const initialMessage = await message.reply({
            embeds: [embed],
            components: [row1],
        });

        // Reageer op de dropdown selecties
        const filter = i => i.user.id === message.author.id;  // Zorg ervoor dat alleen de gebruiker die het commando uitvoerde reageert
        const collector = initialMessage.createMessageComponentCollector({
            filter,
            time: 15000,
        });

        collector.on('collect', async i => {
            if (i.customId === 'category_select') {
                // Haal de gekozen categorie op
                const selectedCategory = i.values[0];
                const categoryPath = path.join(categoriesPath, selectedCategory);
                const commandsInCategory = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

                // Maak een nieuw dropdown menu voor de geselecteerde categorie
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('command_select')
                            .setPlaceholder('Kies een commando...')
                            .addOptions(commandsInCategory.map(command => ({
                                label: command.replace('.js', ''),
                                value: command,
                                description: `Bekijk details voor ${command}`,
                            }))),
                    );

                // Update de embed en stuur een nieuw bericht met de tweede dropdown
                const updatedEmbed = new EmbedBuilder()
                    .setColor('GREEN')
                    .setTitle(`Commando's voor ${selectedCategory}`)
                    .setDescription(`Kies een commando uit de lijst`);

                await i.update({
                    embeds: [updatedEmbed],
                    components: [row2],
                });
            }
        });
    },
};
