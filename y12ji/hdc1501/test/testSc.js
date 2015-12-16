var sc = require('../app')
var assert = require('chai').assert
var scard = sc.scard
var Mnemonic = sc.Mnemonic

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('SC', function() {
    describe('scard', function() {
        it('build', function() {
            var rs = scard.buildtw('helloabc',12)
            var rs24 = scard.buildtw('helloabc',24)
            var mcode = "堡 興 扶 證 改 光 歸 闊 豪 庭 劉 化"
            console.log(rs)
            assert.equal(mcode,rs.code.toString())
            assert.equal("堡 興 扶 證 改 光 歸 闊 豪 庭 劉 力 麼 玩 淀 怨 若 建 格 銷 延 構 柱 臂",rs24.code.toString())
            var rd = scard.derivetw(mcode,1,0,5)
            console.log(rd)
            assert.isUndefined(rd.error)
            assert.equal(rd.xpriv.toString(),rs.xpriv.toString())

            var mcodeerr1 = scard.derive('','ZH_TW',1,2,3)
            assert.isDefined(mcodeerr1.error)
            var mcodeerr2 = scard.derive('扶 證 改 光 歸 闊 豪 庭','ZH_TW',1,2,3)
            assert.isDefined(mcodeerr2.error)
            var mcodeerr3 = scard.derive('堡 興 扶 證 改 光 歸 闊 豪 庭 劉 力 麼 玩 淀 怨 若 建 格 銷 延 構 柱 臂 x','ZH_TW',1,2,3)
            assert.isDefined(mcodeerr3.error)
            assert.isUndefined(mcodeerr3.xpriv)

            var rsch = scard.build('helloabc','ZH_CN')
            var rsen = scard.build('helloabc','EN')
            var rsjp = scard.build('helloabc','JP',15)
            assert.equal('堡 兴 扶 证 改 光 归 阔 豪 庭 刘 化',rsch.code.toString())
            assert.equal('walnut entire swing certain chair can lamp salute still limit gloom answer',rsen.code.toString())
            assert.equal('らぞく　ごうきゅう　ほうりつ　おもたい　おもちゃ　おがむ　そうがんきょう　のりもの　ふはい　そもそも　したて　いじゅう　うえる　ひこく　ひうん',rsjp.code.toString())
        })
    })
})
