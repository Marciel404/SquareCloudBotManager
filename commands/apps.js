const { SlashCommandBuilder } = require("discord.js");
const { RequestsClient } = require("../utils/Requests");
const configData = require("../configData");
const { tempDbApplications } = require("../utils/dbSelectMenuApplication");

module.exports = {
    data: new SlashCommandBuilder() //construto de SlashCommand
        .setName("apps")
        .setDescription("Mostra as aplicações que você possui e gerencia elas"),
    names: ["apps"], // Nomes que o comando vai atender (certifique de estar tudo em minusculo)
    decription: "Mostra as aplicações que você possui e gerencia elas", // Descrição que ira aparecer no comando de ajuda
    async execute(context) {

        let options = []

        //tempDbApplications.clearApplications(context.member.user.id)

        for (const i of RequestsClient.getApplications()) {
            options.push({
                label: i[1].tag,
                value: i[1].id,
                description: i[1].description,
                emoji: configData.emojis[i[1].language]
            })

            if (options.length == 25) {

                tempDbApplications.saveApplictions(context.member.user.id, options)

                options = []
            }
        }

        tempDbApplications.saveApplictions(context.member.user.id, options)

        await context.reply({
            embeds: [
                {
                    title: "Escola uma aplicação para gerenciar",
                    color: 0x00008B
                }
            ]
        })
    }
}