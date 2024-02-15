const { ClientBot } = require("..");
const { runCommand } = require("../utils/loaders");

console.log("Gerenciador de interações de prefixo carregado");

ClientBot.on("interactionCreate", async (interaction) => {

    if (interaction.isChatInputCommand()) { //Se for uma interação de SlashCommand iniciara esse bloco

        const commandsName = interaction.commandName //Pega o nome do comando executado

        try {

            await runCommand("./commands", commandsName, interaction) //Função que procura a função do comando para executar

        } catch (err) {

            console.error(err)

        }

    } else if (interaction.isButton()) { //Se for uma interação de Botão iniciara esse bloco

        try {

            const e = require(`../interaction/buttons/${interaction.customId}`) //Procura na pasta buttons a função do Botão

            if (e.execute) { //Verifica se existe uma função chamada "execute"
                await e.execute(interaction) //Executa a função do botão
            }

        } catch (err) {

            console.error(err)

        }

    } else if (interaction.isAnySelectMenu()) { //Se for uma interação de SelectMenu iniciara esse bloco

        try {

            const e = require(`../interaction/selectmenus/${interaction.customId}`) //Procura na pasta selectmenus a função do SelectMenu

            if (e.execute) { //Verifica se existe uma função chamada "execute"
                await e.execute(interaction) //Executa a função do botão
            }

        } catch (err) {

            console.error(err)

        }

    } else if (interaction.isModalSubmit()) { //Se for uma interação de Modal enviado iniciara esse bloco

        try {

            const e = require(`../interaction/modals/${interaction.customId}`) //Procura na pasta modals a função do Modal

            if (e.execute) { //Verifica se existe uma função chamada "execute"
                await e.execute(interaction) //Executa a função do botão
            }

        } catch (err) {

            console.error(err)

        }

    }

})