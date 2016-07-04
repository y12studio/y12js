var utils = require('../utils')
var assert = require('chai').assert

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('XxBot', function() {
    var sample1 = ['09007030-004',
        '福正村',
        '莒光鄉',
        '連江縣',
        '0',
        '23874',
        '0',
        '22927',
        '0',
        '24627',
        '0',
        '35195',
        '0',
        '29947',
        '0',
        '24386',
        '0',
        '22949',
        '0',
        '21863',
        '0',
        '27129',
        '0',
        '40670',
        '171',
        '33099',
        '0',
        '29788',
        '0',
        '24975'
    ]
    var result1 = ['09007030-004',
        '福正村',
        '莒光鄉',
        '連江縣',
        '0',
        '23874',
        '0',
        '22927',
        '0',
        '24627',
        '0',
        '35195',
        '0',
        '29947',
        '0',
        '24386',
        '0',
        '22949',
        '0',
        '21863',
        '0',
        '27129',
        '0',
        '40670',
        '171',
        '33099',
        '0',
        '29788',
        '0',
        '24975'
    ]
    it('xxTest', function() {
        assert.deepEqual(sample1, result1)
    })
})
