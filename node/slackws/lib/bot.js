var validator = require('validator');

function res(result, msg) {
    return {
        error: !result,
        msg: msg
    };
};

module.exports = {
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
