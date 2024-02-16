const { JsonDB, Config } = require("node-json-db")

/*
Essa classe é uma db temporaria que ira salvar uma lista de applicações
caso o usuario ultrapassar 25 applicações,
Para pode utilizar futuramente em um SelecMenu para selecionar aplicações
*/

exports.tempDbApplications = new class tempDbApplications {

    constructor() {

        this.db = new JsonDB(new Config("tembdbApps", true, true)) // Acessa e configura a db

        this.db.load() //Carrega a Db

    }

    async saveApplictions(userId, ArrayApplitions) {
        if (await this.db.exists(`/${userId}/aplicationsSelectMenuOptions`)) {
            const applicationObj = await this.db.getObject(`/${userId}/aplicationsSelectMenuOptions`)
            const c = applicationObj
            c.push(ArrayApplitions)
            await this.db.push(`/${userId}/aplicationsSelectMenuOptions/`, c, true)
        } else {
            await this.db.push(`/${userId}/aplicationsSelectMenuOptions`, [ArrayApplitions], true)
        }
    }

    async clearApplications(userId) {
        if (await this.db.exists(`/${userId}/aplicationsSelectMenuOptions`)) {
            await this.db.delete(`/${userId}/aplicationsSelectMenuOptions`)
        }
    }

    async getApplicationsLine(userId) {
        await this.db.reload()
        if (await this.db.exists(`/${userId}/aplicationsSelectMenuOptions`)) {
            const applicationObj = await this.db.getObject(`/${userId}/aplicationsSelectMenuOptions`)
            return applicationObj
        } else {
            return []
        }
    }

}