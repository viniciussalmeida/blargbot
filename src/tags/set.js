/*
 * @Author: stupid cat
 * @Date: 2017-05-07 18:57:14
 * @Last Modified by: stupid cat
 * @Last Modified time: 2017-05-21 11:30:13
 *
 * This project uses the AGPLv3 license. Please read the license file before using/adapting any of the code.
 */

const Builder = require('../structures/TagBuilder');

module.exports =
    Builder.AutoTag('set')
        .acceptsArrays()
        .withArgs(a => [a.require('name'), a.optional('value', true)])
        .withDesc('Stores `value` under `name`. These variables are saved between sessions. ' +
            'You can use a character prefix to determine the scope of your variable.\n' +
            'Valid scopes are: ' + bu.tagVariableScopes.map(s => '`' + (s.prefix || 'none') + '` (' + s.name + ')').join(', ') +
            '. For more information, use `b!t docs variable` or `b!cc docs variable`'
        ).withExample(
            '{set;var1;This is local var1}\n{set;~var2;This is temporary var2}\n{set;var3;this;is;an;array}\n' +
            '{get;var1}\n{get;~var2}\n{get;var3}',
            'This is local var1\nThis is temporary var2\n{"v":["this","is","an","array"],"n":"var3"}'
        ).beforeExecute(Builder.util.processAllSubtags)
        .whenArgs('1', Builder.errors.notEnoughArguments)
        .whenDefault(async function (params) {
            let value;

            if (params.args.length == 3) {
                let deserialized = bu.deserializeTagArray(params.args[2]);
                if (deserialized && deserialized.v) {
                    value = deserialized.v;
                } else value = params.args[2];
            } else if (params.args.length > 3)
                value = params.args.slice(2);
            else
                value = null;

            return this.setVar(params, params.args[1], value);
        })
        .withProp('setVar', async function (params, varName, value) {
            for (const scope of bu.tagVariableScopes) {
                if (varName.startsWith(scope.prefix))
                    return await scope.setter(params, varName.substring(scope.prefix.length), value);
            }
            throw new Error('Missing default variable scope!');
        }).build();