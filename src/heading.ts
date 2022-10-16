function getDelta(from: number, to: number, modulus: number) {
    // You can think of the valid range of values as a ring. 
    // so there is two ways to get from one Point to another.
    // try both ways and pick the ones with a smaller absolute value
    from += modulus // move from (-mod, mod) to (0, 2mod)
    to += modulus
    from %= 2*modulus
    to %= 2*modulus

    // Passing Zero
    const deltaOverZero = to-from;
    if( Math.abs(deltaOverZero) < modulus) {
        return deltaOverZero
    }

    if (deltaOverZero < 0) {
        return (2*modulus) + deltaOverZero
    } else {
        return -((2*modulus) - deltaOverZero)
    }
       
}

// note: Modulus is in +/- value. So a mod of 90 means +/-90
export function calculateHeading( fromLat: number, fromLong: number, toLat: number, toLong: number) : number {
    const deg2rad = 0.01745329
    const rad2deg = 57.29578
    // first get Delta-Value for Longtitude as it is needed by the formula below.
    const dLong = getDelta(fromLong, toLong, 180);
    const fromLatRad = fromLat*deg2rad
    const toLatRad = toLat*deg2rad
    const dLongRad = dLong*deg2rad

    // Formula stolen from 
    // https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/
    const x = Math.cos(toLatRad) * Math.sin(dLongRad)
    const y = Math.cos(fromLatRad) * Math.sin(toLatRad) - Math.sin(fromLatRad) * Math.cos(toLatRad) * Math.cos(dLongRad);


    const heading = Math.atan2(x,y);
    // convert Rads back to Degs

    const asDegreesHundreths = (heading * rad2deg) * 100
    let degrees = Math.round(asDegreesHundreths) / 100
    if(degrees < 0) {
        degrees = -degrees + 180
    }
    return degrees;
}

if (import.meta.vitest) {
    const {it, expect, describe} = import.meta.vitest
    describe("Delta Function", () => {
        it("Inner Delta", () => {
            expect(getDelta(0, 80, 90)).toBe(80);
            expect(getDelta(80, 0, 90)).toBe(-80);
            expect(getDelta(-40, 40, 90)).toBe(80);
        })
        it("Outer Delta", () => {
            expect(getDelta(80, -50, 100)).toBe(70);
            expect(getDelta(-80, 80, 100)).toBe(-40);
            expect(getDelta(50, -50, 100)).toBe(100);
            expect(getDelta(-200, 200, 100)).toBe(-0); 
        })
    })

    it("Heading", () => {
        expect(calculateHeading(0, 0, 0, 50)).toBe(90)
        expect(calculateHeading(0, 0, 0, -50)).toBe(270)
        expect(calculateHeading(0, 0, 50, 0)).toBe(0)
        expect(calculateHeading(0, 0, -50, 0)).toBe(180)
    })
}