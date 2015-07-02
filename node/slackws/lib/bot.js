var validator = require('validator');

var cliArgs = require("command-line-args");

/* define the command-line options */
var cli = cliArgs([{
    name: "verbose",
    alias: "v",
    type: Boolean,
    description: "Write plenty output"
}, {
    name: "help",
    type: Boolean,
    alias: "h",
    description: "Print usage instructions"
}, {
    name: "mbtc",
    type: Number
}, {
    name: "btc",
    type: Number
}, {
    name: "twd",
    type: Number
}]);

/* generate a usage guide */
var usage = cli.getUsage({
    header: "A slack RTM bankbot application.",
    footer: "For more information, visit https://y12.slack.com/"
});

function res(result, msg) {
    return {
        error: !result,
        msg: msg
    };
};

module.exports = {

    usage: cli.getUsage({
        header: "A slack RTM bankbot application.",
        footer: "For more information, visit https://y12.slack.com/"
    }),

    parsecmd: function(msg) {
        if (msg.indexOf('?coin') != 0) {
            return res(false, 'prefix error');
        }
        var argv = msg.substring(5).split(' ');
        return cli.parse(argv);
    },

    parsembtc: function(msg) {
        var r = res(true, 'ok')
        if (msg.charAt(0) != '?') {
            return res(false, 'prefix without ?');
        }
        var command = msg.substring(1).split(' ');
        if (command[0].toLowerCase() == 'mbtc') {
            var len = command.length;
            if (len <= 2) {
                var amount = 1000;
                if (len == 2) {
                    var pstr = command[1]
                    if (validator.isFloat(pstr)) {
                        amount = validator.toFloat(pstr);
                    } else {
                        return res(false, 'parse error with ' + pstr);
                    }
                }
                r.amount = amount;
            } else {
                return res(false, 'only one argument accepted!');
            }
        } else {
            return res(false, 'mbtc ?')
        }
        return r;
    },

    add: function(x, y) {
        return x + y;
    },
    echo: function(x) {
        return x;
    }
}
