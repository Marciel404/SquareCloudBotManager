const { SlashCommandBuilder } = require("discord.js");
const { RequestsClientSquareCloud } = require("../utils/Requests");
const configData = require("../configData");
const { tempDbApplications } = require("../utils/dbSelectMenuApplication");

module.exports = {
    data: new SlashCommandBuilder() //construto de SlashCommand
        .setName("apps")
        .setDescription("Mostra as aplicações que você possui e gerencia elas"),
    names: ["apps"], // Nomes que o comando vai atender (certifique de estar tudo em minusculo)
    decription: "Mostra as aplicações que você possui e gerencia elas", // Descrição que ira aparecer no comando de ajuda
    async execute(context) {

        if (RequestsClientSquareCloud.user.id != context.member.user.id)
            return await context.reply({ content: "Você não é o dono da APIKEY registrada" })

        let options = []

        await tempDbApplications.clearApplications(context.member.user.id) //Limpa a db temporaria do usuario

        for (const i of await RequestsClientSquareCloud.getApplications()) { //Loop para adicionar as aplicações no SelectMenu

            options.push({
                label: i[1].tag,
                value: i[1].id,
                description: i[1].description,
                emoji: configData.emojis[i[1].language]
            })

            if (options.length == 25) {

                await tempDbApplications.saveApplictions(context.member.user.id, options)

                options = []

            };

        };

        if ((await tempDbApplications.getApplicationsLine(context.member.user.id)).length > 0) {
            //Se ja tiver um item na db temporaria de aplicativos

            await tempDbApplications.saveApplictions(context.member.user.id, options)

            return await context.reply({
                embeds: [
                    {
                        title: "Escola uma aplicação para gerenciar",
                        color: 0x00008B,
                        fields: [
                            {
                                name: "Quantidade de aplicações",
                                value: `${(await tempDbApplications.getApplicationsLine(interaction.member.user.id)).length}`
                            }
                        ]
                    },
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 3,
                                placeholder: "Escolha uma aplicação",
                                custom_id: "selectApplication",
                                options: (await tempDbApplications.getApplicationsLine(context.member.user.id))[0],
                                disabled: false
                            }
                        ]
                    },
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 1,
                                label: "⬅",
                                custom_id: "previousApps-0",
                                disabled: true
                            },
                            {
                                type: 2,
                                style: 1,
                                label: "➡",
                                custom_id: "nextApps-0",
                                disabled: false
                            }
                        ]
                    }
                ]
            }) //Envia um selecmenu com as aplicações com pagnator

        }

        await context.reply({
            embeds: [
                {
                    title: "Escola uma aplicação para gerenciar",
                    color: 0x00008B,
                    fields: [
                        {
                            name: "Quantidade de aplicações",
                            value: `${options.length}`
                        }
                    ]
                },
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            label: "Escolha uma aplicação",
                            custom_id: "selectApplication",
                            options: options
                        }
                    ]
                }
            ]
        }) //Envia um selecmenu com as aplicações

    }
}