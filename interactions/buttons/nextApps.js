const { tempDbApplications } = require("../../utils/dbSelectMenuApplication");

exports.execute = async (interaction) => {

    if (interaction.member.user.id != interaction.message.interaction.user.id)
        return await interaction.update({})

    let disabled = false

    let page = parseInt(interaction.customId.split("-")[1]) + 1
    //Pega a quantidade de pagina atual e atualiza para a proxima

    const apps = await tempDbApplications.getApplicationsLine(interaction.member.user.id)
    //Retorna o array de applicações da dbtemporaria

    if (page + 1 >= apps.length) {
        page = apps.length - 1  //Seta o valor da pagina para o ultima
        disabled = true //Desativa o botão de passar a pagina
    }

    const componentsRow = [
        {
            type: 1,
            components: [
                {
                    type: 3,
                    placeholder: "Escolha uma aplicação",
                    custom_id: "selectApplication",
                    options: (await tempDbApplications.getApplicationsLine(interaction.member.user.id))[page],
                    disabled: false
                }
            ],

        },
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 1,
                    label: "⬅",
                    custom_id: `previousApps-${page}`,
                    disabled: false
                },
                {
                    type: 2,
                    style: 1,
                    label: "➡",
                    custom_id: `nextApps-${page}`,
                    disabled: disabled
                }
            ]
        }
    ] // Array de components para editar

    await interaction.update({ components: componentsRow }) // Edita os components da mensagem

}