var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var bot = require('../lib/bot.js');

describe('bot ?coin', function() {
    it('expect to equal', function() {
        console.log(bot.usage)
        bot.parsecmd('?coin -h').help.should.true;
        bot.parsecmd('?coin -v').verbose.should.true;
        bot.parsecmd('?coin --mbtc 100').mbtc.should.equal(100);
        bot.parsecmd('?coin --mbtc 0.998').mbtc.should.equal(0.998);
        bot.parsecmd('?coin --twd 15.0').twd.should.equal(15.0);
    });
});

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
