jest.autoMockOff();
describe('Bitbox', function() {
    it('check Bitbox addr function', function() {
        var Bitbox = require('../bitbox');
        var addr1 = Bitbox.saddr();
        console.log(addr1);
        expect(addr1.length).toBe(34);
        var bo = new Bitbox();
        var addr2 = bo.addr();
        expect(addr2.length).toBe(34);
        expect(addr1).not.toBe(addr2);
        console.log(bo.toJSON());
    });
});
