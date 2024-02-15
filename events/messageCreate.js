const { ClientBot } = require("../index");
const configData = require("../configData");
const { runCommand } = require("../utils/loaders");

console.log("Gerenciador de commando de prefixo carregado");

ClientBot.on("messageCreate", async (message) => {

    if (!message.content.startsWith(configData.prefix) || message.author.bot || !message.guild) return;

    const commandName = message.content.toLowerCase().split(" ")[0].substring(configData.prefix.length); //Pega o nome do comando

    if (commandName.length == 0) return;

    try {

        await runCommand("./commands", commandName, message);

    } catch (err) {

        console.error(err);

    };

})