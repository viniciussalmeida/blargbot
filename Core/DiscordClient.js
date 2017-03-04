const { CommandManager, EventManager } = require('./Managers/index.js');

class DiscordClient extends _dep.Eris.Client {
    constructor(shardId) {
        super(_config.discord.token, {
            autoReconnect: true,
            disableEveryone: true,
            disableEvents: {
                TYPING_START: true
            },
            getAllUsers: true,
            maxShards: 1,
            firstShardId: shardId || 0,
            lastShardId: shardId || 0,
            restMode: true,
            defaultImageFormat: 'png',
            defaultImageSize: 512,
            messageLimit: 1
        });

        global._discord = this;
        this.Core = require('./index.js');

        this.CommandManager = new CommandManager();
        this.CommandManager.init();

        this.EventManager = new EventManager();
        this.EventManager.init();
    }
}

module.exports = DiscordClient;