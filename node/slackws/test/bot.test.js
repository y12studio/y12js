var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var bot = require('../lib/bot.js');

describe('bot utility', function() {
    it('expect to equal', function() {
        (bot.add(1, 100)).should.equal(101);
    });
});

describe('bot parsembtc', function() {
    it('expect to error', function() {
        bot.parsembtc('haha').error.should.true;
        bot.parsembtc('?mbtc 100 100').error.should.true;
        bot.parsembtc('?8btc 100').error.should.true;
        bot.parsembtc('?mbtc 10.5ABC').error.should.true;
    });

    it('expect to equal', function() {
        bot.parsembtc('?mbtc 10.05').error.should.false;
        bot.parsembtc('?mbtc 10.05').amount.should.equal(10.05);
        bot.parsembtc('?mbtc').amount.should.equal(1000);
    });
});
