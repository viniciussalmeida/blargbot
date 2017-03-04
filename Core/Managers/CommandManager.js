const Manager = require('./Manager');
const Base = require('../Structures/Command/Base');

class CommandManager extends Manager {
    constructor() {
        super('Commands', Base);
        this.fullList = {};
    }

    unload(name) {
        if (this.builtList[name].aliases.length > 0) {
            for (const alias of this.builtList[name].aliases) {
                delete this.builtList[alias];
            }
        }
        super.unload(name);
    }

    build(name) {
        if (super.build(name)) {
            if (this.builtList[name].aliases.length > 0) {
                for (const alias of this.builtList[name].aliases) {
                    this.builtList[alias] = this.builtList[name];
                }
                this.builtList[name] == this.builtList[name];
            }
        }
    }

    async execute(name, ctx) {
        const command = this.list[name];
        if (command !== undefined) {
            console.dir(command, { depth: 1 });
            if (command.canExecute(ctx)) {
                try {
                    let response = await command.execute(ctx);
                    if (response !== undefined) {
                        await command.send(response);
                    }
                } catch (err) {
                    // TO-DO
                }
            }
        }
    }

    has(name) {
        return this.builtList.hasOwnProperty(name);
    }
}

module.exports = CommandManager;