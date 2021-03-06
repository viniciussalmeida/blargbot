/*
 * @Author: zoomah
 * @Date: 2018-07-11 18:02:57
 * @Last Modified by: stupid cat
 * @Last Modified time: 2018-07-16 09:02:20
 *
 * This project uses the AGPLv3 license. Please read the license file before using/adapting any of the code.
 */

const Builder = require('../structures/TagBuilder');

module.exports =
    Builder.AutoTag('numformat')
        .withArgs(a => [
            a.require('number'),
            a.optional('roundTo'),
            a.optional('decimal'),
            a.optional('thousands')
        ]).withDesc('Rounds `number` to `roundTo` digits. Also you can specify `decimal` and `thousands` delimitors. To skip `roundTo` or `decimal` leave them empty.')
        .withExample(
            '{numformat;123456.789;2}\n{numformat;123456.789;-3}\n{numformat;123456.789;;;,}',
            '123456.79\n123000\n123,456.789'
        )
        .whenArgs('0-1', Builder.errors.notEnoughArguments)
        .whenArgs('2-4', async function (subtag, context, args) {
            let number = bu.parseFloat(args[0]);
            if (number === NaN) return number;
            let roundto = bu.parseInt(args[1]);

            let options = {} // create formatter options
            if (roundto != NaN) {
                roundto = Math.min(20, Math.max(-21, roundto));
                let trunclen = Math.trunc(number).toString().length;
                if (roundto >= 0) {
                    options.minimumFractionDigits = roundto;
                    options.maximumFractionDigits = roundto;
                } else if (trunclen + roundto >= 0) {
                    options.maximumSignificantDigits = trunclen + roundto;
                }
            }
            let num = number.toLocaleString('en-US', options).split('.');
            num[0] = num[0].split(',').join(args[3] || '');
            num = num.join(args[2] || '.');
            return num;
        }).whenDefault(Builder.errors.tooManyArguments)
        .build();
