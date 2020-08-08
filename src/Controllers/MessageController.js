const EventEmitter = require('events');

const logger = require('../Logging/Logger');


class MessageController extends EventEmitter {


    constructor() {

        super();

        this.clients = [];

        this.setBrowserHandshakeListeners();
    }


    setBrowserHandshakeListeners = () =>
    {
        this.on('browser:handshake', (browserWsClient) =>
        {
            logger.info('browser connected');

            this.browser = browserWsClient;

            browserWsClient.once('close', () =>
            {
                delete this.browser;

                logger.warn('browserWsClient has closed');
            });

            browserWsClient.once('error', () =>
            {
                delete this.browser;

                logger.error('browserWsClient error');
            });

        });

    }

    newMessage = (websocketClient, message) =>
    {
        message = JSON.parse(message);

        if (message.client_type == "browser" && message.event == "handshake") {

            this.emit('browser:handshake', websocketClient);

            return true;
        }



    }



}


module.exports = MessageController;