import '../auto_mock_off';
import { Point,BitBox } from '../point';

describe('Point', () => {
    it('sets up instance properties correctly', () => {
        let p = new Point(1, 5);
        console.log(JSON.stringify(p));
        expect(p.x).toBe(1);
        expect(p.y).toBe(5);

        let bb = new BitBox();
        console.log(bb.address());
        //expect(bb.address().length).toBe(32);
    });
});
