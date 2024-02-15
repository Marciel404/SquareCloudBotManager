require("dotenv").config()
const { Client, GatewayIntentBits } = require("discord.js");
const { loadEvents, registrySlash } = require("./utils/loaders");

if (!process.env.TOKEN) //Verifica se existe o token do bot no arqivo .env
    return console.error("TOKEN do bot não adicionado no arquivo .env")

if (!process.env.APIKEY) //Verifica se existe a APIKEY no arqivo .env
    return console.error("APIKEY do bot não adicionado no arquivo .env")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

client.once("ready", async (self) => {

    console.log(`✔ Fiquei online como ${self.user?.displayName}`) //Mostra mensagem no console

    loadEvents() //Carrega todos os eventos do bot na pasta "Events"

    await registrySlash(self.application.id) //Função para registrar os Slashs Commands

})

client.login(process.env.TOKEN) //Deixa o Bot online

exports.ClientBot = client //Exporta o client principal para usar em gerenciadores