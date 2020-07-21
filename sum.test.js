const sum = require('./sum');
const {exec} = require('child_process');
// beforeAll(() => {
//     // return(
//
//     // );
// })

it('adds 1 + 2 to equal 3', () => {
    console.log("test")
    expect(sum(1, 2)).toBe(3);
});


test('adds 1 + 2 to equal 3 part two', () => {
    expect(sum(1, 2)).toBe(2);
});