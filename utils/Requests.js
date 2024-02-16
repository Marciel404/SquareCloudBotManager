const { SquareCloudAPI } = require("@squarecloud/api");
const { AttachmentBuilder } = require("discord.js");

exports.RequestsClientSquareCloud = new class Requests extends SquareCloudAPI {

    constructor() {

        super(process.env.APIKEY)

        this.user = null

        this.getUser()

    }

    async getUser() {
        this.user = await this.users.get()
    }

    async getApplications() { //Retorna todas as aplicações
        await this.getUser()
        return this.user.applications
    }

    async getApplicationStatus(applicationId) { // retorna uma Aplicação especifica

        const application = await this.applications.get(applicationId)

        return await application.getStatus()

    }

    async getApplicationLogs(applicationId) { // retorna uma Aplicação especifica

        const application = await this.applications.get(applicationId)

        return await application.getLogs()

    }

    async commit(applicationId, restartApplication) { //Envia um commit

        const application = await this.applications.get(applicationId) //Pega a aplicação desejada

        const shouldRestart = restartApplication;

        const success = await application.commit("../", "application.zip", shouldRestart);

        if (success) {
            console.log(`Commit de aplicação realizado com sucesso.`);
        } else {
            console.error(`FailErro ao dar commit na aplicação.`);
        }


    }

    async uploadApplication() {

        try {

            const { join } = require("path");
            const filePath = join(__dirname, "application.zip");

            // Execute a função de upload
            const success = await this.applications.create(filePath);

            // Verifica resultado do upload
            if (success) {
                return success
                // Retorna as informações carregadas da aplicação (id, tag, descrição, etc.)
            } else {
                console.error(`Falha ao enviar aplicação.`);
            }

        } catch (err) {
            console.log(err)
        }

    }

    async backup(applicationId) { //Envia o backup para o usuario

        const application = await this.applications.get(applicationId);

        const started = await application.backup.download();

        return started

    }

    async start(applicationId) { //Inicia a aplicação

        const application = await this.applications.get(applicationId);

        const started = await application.start();

        return started

    }

    async stop(applicationId) { //Desliga a aplicação

        const application = await this.applications.get(applicationId);

        const stopped = await application.stop();

        return this.stop

    }

    async restart(applicationId) { //Reinicia a aplicação

        const application = await this.applications.get(applicationId);

        const restarted = await application.restart();

        return restarted

    }

    async delete(applicationId) { //Deleta a aplicação

        const application = await this.applications.get(applicationId);

        const deleted = await application.delete();

        return deleted

    }

    async logs(applicationId) { // Retorna as logs da aplicação

        const application = await this.applications.get(applicationId);

        const logs = await application.getLogs();

        return logs

    }

}
