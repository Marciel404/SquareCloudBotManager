const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");
const { RequestsClientSquareCloud } = require("../utils/Requests");
const { createWriteStream } = require('fs');
const { default: axios } = require("axios");
const { Readable } = require("stream");

module.exports = {
    data: new SlashCommandBuilder() //construto de SlashCommand
        .setName("up")
        .setDescription("Realiza o upload de uma aplicação")
        .addAttachmentOption(option =>
            option
                .setName("arquivo")
                .setDescription("Arquivo a fazer upload")
                .setRequired(true)
        ),
    names: ["up", "upload"], // Nomes que o comando vai atender (certifique de estar tudo em minusculo)
    decription: "Realiza o upload de uma aplicação", // Descrição que ira aparecer no comando de ajuda
    /**
     * @param {ChatInputCommandInteraction} context 
     */
    async execute(context) {

        if (RequestsClientSquareCloud.user.id != context.member.user.id)
            return await context.reply({ content: "Você não é o dono da APIKEY registrada" })

        await context.deferReply({ ephemeral: true })

        await context.followUp({ content: "Realizando Upload da applicação" })

        const file = (context.options.getAttachment("arquivo"))

        if (file.contentType != "application/zip")
            return await context.reply({
                content: "Tipo de arquivo invalido",
                ephemeral: true
            })

        fetch(file.url)
            .then(async (response) => {

                const escritor = createWriteStream('./utils/application.zip')

                const reader = response.body.getReader();

                const rs = new Readable();

                rs._read = async () => {

                    const result = await reader.read();

                    if (!result.done) {

                        rs.push(Buffer.from(result.value));

                    } else {

                        rs.push(null);

                        return;

                    }
                };

                rs.pipe(escritor) // Baixa o arquivo para upload

                escritor
                    .on("finish", async () => {

                        const response = await RequestsClientSquareCloud.uploadApplication()
                        //Inicia a função de upload da aplicação

                        if (response) //Se o upload for bem sucedido entra nesse bloco
                            return await context.followUp({ content: "Upload realizado com sucesso", ephemeral: true })

                        await context.followUp({ content: "Erro ao dar upload na aplicação", ephemeral: true })

                    })

            })

    }
}