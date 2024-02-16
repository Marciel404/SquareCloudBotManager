const { RequestsClientSquareCloud } = require("../../utils/Requests");
const moment = require("moment")

exports.execute = async (interaction) => {

    const status = await RequestsClientSquareCloud.getApplicationStatus(interaction.message.embeds[0].author.name)
    //Retorna o status do bot selecionado
    const application = (await RequestsClientSquareCloud.getApplications()).get(status.applicationId)

    await RequestsClientSquareCloud.start(interaction.message.embeds[0].author.name)

    let disabledStart = false
    let disabledStop = false
    let disabledRestart = false

    if (status.running) disabledStart = true
    else if (!status.running) {
        disabledStop = true
        disabledRestart = true
    }

    await interaction.message.edit({
        embeds: [ //Embed do menu
            {
                description: `**${application.tag}**`,
                thumbnail: {
                    url: interaction.user.avatarURL()
                },
                color: 0x00008B,
                author: {
                    name: `${status.applicationId}`,
                    url: `https://squarecloud.app/dashboard/app/${status.applicationId}`
                },
                fields: [
                    {
                        name: "Uso de CPU",
                        value: `${status.usage.cpu}`,
                        inline: true
                    },
                    {
                        name: "Uso de RAM",
                        value: `${status.usage.ram}`,
                        inline: true
                    },
                    {
                        name: "Uso de Internet (Total)",
                        value: `${status.usage.network.total}`,
                        inline: true
                    },
                    {
                        name: "Uso de Internet (Agora)",
                        value: `${status.usage.network.now}`,
                        inline: true
                    },
                    {
                        name: "Uso de Armazenamento",
                        value: `${status.usage.storage}`,
                        inline: true
                    },
                    {
                        name: "Status",
                        value: `${status.running}`,
                        inline: true
                    },
                    {
                        name: "Requests",
                        value: `${status.requests}`,
                        inline: true
                    },
                    {
                        name: "Esta online",
                        value: `${status.running}`,
                        inline: true
                    },
                    {
                        name: "Tempo online",
                        value: `<t:${moment(status.uptimeTimestamp).unix()}:R>`,
                        inline: true
                    }
                ]
            }
        ],
        components: [ //Botões para funções
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: "Menu",
                        custom_id: "menuApps",
                        style: 1,
                        emoji: {
                            name: "home",
                            id: "1207792075895083048"
                        }
                    },
                    {
                        type: 2,
                        label: "Commit",
                        custom_id: "commitApp",
                        style: 1,
                        emoji: {
                            name: "upload",
                            id: "1207804838562238504"
                        }
                    },
                    {
                        type: 2,
                        label: "Backup",
                        custom_id: "backupApp",
                        style: 1,
                        emoji: {
                            name: "DownloadCloud",
                            id: "1207792526547746856"
                        }
                    },
                    {
                        type: 2,
                        label: "Logs",
                        custom_id: "getLogsApp",
                        style: 1,
                        emoji: {
                            name: "terminal",
                            id: "1207803148597723157"
                        }
                    },
                    {
                        type: 2,
                        label: "Deletar",
                        custom_id: "deleteApp",
                        style: 1,
                        emoji: {
                            name: "trash",
                            id: "1207803633702539315"
                        }
                    },
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: "Start",
                        custom_id: "startApp",
                        style: 1,
                        disabled: disabledStart,
                        emoji: {
                            name: "▶",
                        }
                    },
                    {
                        type: 2,
                        label: "Restart",
                        custom_id: "restartApp",
                        style: 1,
                        disabled: disabledRestart,
                        emoji: {
                            name: "🔁",
                        }
                    },
                    {
                        type: 2,
                        label: "Stop",
                        custom_id: "stopApp",
                        style: 1,
                        disabled: disabledStop,
                        emoji: {
                            name: "⏹",
                        }
                    },
                    {
                        type: 2,
                        label: "Atualizar",
                        custom_id: "updateApp",
                        style: 1,
                        emoji: {
                            name: "📶",
                        }
                    }
                ]
            }
        ]
    })

}