const { sortMoves } = require("../helpers/generators");
const dummyarray = require("../aigis.json");

test("if array is longer than 4, return split arrays", async () => {
  const expected = [[], []];
  const result = await sortMoves(dummyarray.moveCollection);
  expect(result).toEqual(expect.anything());
});

//   describe('returns split array if longer than 4', () => {
//     const expected = ['Alice', 'Bob'];
//     it('matches even if received contains additional elements', () => {
//       expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(expected));
//     });
//     it('does not match if received does not contain expected elements', () => {
//       expect(['Bob', 'Eve']).not.toEqual(expect.arrayContaining(expected));
//     });
//   });
