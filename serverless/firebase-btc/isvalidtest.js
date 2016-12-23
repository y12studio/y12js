var isvalid = require('isvalid')

function emptyTest(){
    isvalid({
        'foo': ' '
    }, {
        type: Object,
        schema: {
            'foo': {
                type: String,
                trim: true
            }
        },
        custom: function(data, schema) {
            if (data.foo == '') {
                throw new Error('foo must be non empty');
            }
            return data;
        }
    }, function(err, validData) {
        console.log(err)
    });
}

function formatTest(){
    isvalid('Month', {
        type: String,
        enum: ["day", "month", "year"],
        custom: function(data, schema) {
            return data.toLowerCase()
        }
    }, function(err, validData) {
        console.log(err)
    });
}

formatTest()
