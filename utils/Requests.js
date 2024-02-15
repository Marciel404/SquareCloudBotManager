const { SquareCloudAPI } = require("@squarecloud/api");

exports.RequestsClient = new class Requests extends SquareCloudAPI {

    constructor() {

        super(process.env.APIKEY)

        this.user = null
        
        this.getUser() //Executa função aonde atribui usuario ao atributo user da classe

    }

    async getUser() {
        this.user = await this.users.get()
    }

    getApplications() { //Retorna todas as aplicações
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

        const { join } = require("node:path");
        const filePath = join(__dirname, "application.zip");

        const shouldRestart = restartApplication;

        const success = await application.commit(filePath, "application.zip", shouldRestart);

        if (success) {
            console.log(`Commit de aplicação realizado com sucesso.`);
        } else {
            console.error(`FailErro ao dar commit na aplicação.`);
        }


    }

    async uploadApplication() {

        const { join } = require("node:path");
        const filePath = join(__dirname, "application.zip");

        // Execute a função de upload
        const success = await this.applications.create(filePath);

        // Verifica resultado do upload
        if (success) {
            console.log(`Aplicação enviada com sucesso.`, success);
            // Retorna as informações carregadas da aplicação (id, tag, descrição, etc.)
        } else {
            console.error(`Falha ao enviar aplicação.`);
        }

    }

}
