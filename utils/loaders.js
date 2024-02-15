const { REST, Routes } = require("discord.js");
const { lstatSync, readdirSync } = require("fs");

const rest = new REST().setToken(process.env.TOKEN);

let commands = [];

function loadCommandsSlash(path = "./commands") {

    for (const i of readdirSync(path)) {

        if (lstatSync(`${path}/${i}`).isDirectory()) {

            loadCommandsSlash(`${path}/${i}`);

        } else {

            if (i.endsWith(".js")) {

                const command = require(`.${path}/${i}`);

                const data = command.data.toJSON()

                if (data) {

                    commands.push(data); //Salva o "corpo" do SlashCommand para registrar depois

                }

            };

        };

    };

};

async function runCommand(
    path, //Diretorio da pasta de comandos
    commandName, //O nome do comando a ser executado
    context //Contexto do "comando" slash ou prefixo
){ //Função para procurar a função de um comando

    for (const i of readdirSync(path)) {

        if (lstatSync(`${path}/${i}`).isDirectory()) { // Verifica se é uma pasta

            await runCommand(`${path}/${i}`, commandName, context); //Roda a função novamente se for uma pasta

        } else {

            if (i.endsWith(".js")) {

                const cmd = require(`.${path}/${i}`); // "Puxa o comando"

                if (cmd && cmd.names.includes(commandName)) { //Verifica se o arquivo existe e se é o comando desejado

                    try {

                        await cmd.execute(context); //Executa a função do comando

                    } catch (e) {

                        console.error(e); //Mostra no console se deu algum erro ao executar o comando

                    };

                };

            };

        };

    };

};

function loadEvents(path = "./events") {

    for (const i of readdirSync(path)) {

        if (lstatSync(`${path}/${i}`).isDirectory()) { //Se o arquivo for uma pasta entrar dentro da pasta

            loadEvents(`${path}/${i}`);

        } else {

            if (i.endsWith(".js")) {

                require(`.${path}/${i}`);

            };

        };

    };

};

async function registrySlash(CLIENT_ID) {

    try {

        const data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands }); //Retorna um objeto com os comandos registrados

        console.log(`Foram registrados ${data.length} Slash Commands.`); //Mostra no console se tudo ocorrer certo

    } catch (error) {

        console.error(error); // Mostra no console o erro ocorrido

    };

};

exports.loadEvents = loadEvents //Exporta a função para carrega os eventos necessarios para o bot fucionar
exports.registrySlash = registrySlash //Exporta a função para registrar comandos
exports.runCommand = runCommand //Exporta a função para rodar comandos

loadCommandsSlash("./commands") // já carrega os arquivos de comandos
