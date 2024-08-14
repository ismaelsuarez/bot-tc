require("dotenv").config();
const { createBot, createProvider, addKeyword, createFlow, EVENTS } = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const ChatGPTClass = require('./chatgpt.class');
const { PROMP } = require("./promp.js");

const ChatGPTInstance = new ChatGPTClass()
const flowConfirmar = addKeyword('ok').addAnswer('Necesita algo mas?')





const flowInicial = addKeyword(EVENTS.WELCOME)
    .addAnswer('Hola! Bienvenido, soy el asistente virtual', null, async () => {
        await ChatGPTInstance.handleMsgChatGPT(PROMP)
    })
    .addAnswer('¿Cual es su consulta?', { capture: true },
        async (ctx, { flowDynamic, fallBack }) => {
            const response = await ChatGPTInstance.handleMsgChatGPT(ctx.body);
            const message = response.text;
            if (ctx.body.toString() !== 'ok') {
                return fallBack(message);
            }

        }, [flowConfirmar]
    )

const main = async () => {
    const adapterDB = new MockAdapter();

    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        provider: adapterProvider,
        database: adapterDB,
        flow: createFlow([flowInicial])
    });

    QRPortalWeb();
};

main();