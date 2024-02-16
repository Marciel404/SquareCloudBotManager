const { ButtonInteraction, AttachmentBuilder } = require("discord.js");
const { RequestsClientSquareCloud } = require("../../utils/Requests");
/**
 * @param {ButtonInteraction} interaction
 */
exports.execute = async (interaction) => {

    await interaction.deferReply({ ephemeral: true })

    await interaction.followUp({ content: "Criando Backup" })

    const bufferFile = Buffer.from(await RequestsClientSquareCloud.backup(interaction.message.embeds[0].author.name))

    await interaction.followUp({
        content: "Backup Criado com sucesso",
        ephemeral: true
    })

    await interaction.user.send({
        files: [
            new AttachmentBuilder(bufferFile, { name: "backup.zip" })
        ]
    })
}