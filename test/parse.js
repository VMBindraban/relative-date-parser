const test = require('tape');

const parse = require('../parse');

test('export type', t => {
  t.ok(typeof parse === 'function', 'function');
  t.end();
});

test('throw on invalid input', t => {
  t.throws(() => {
    parse();
  }, 'no input');

  t.throws(() => {
    parse('2017-01-01');
  }, 'invalid input (string)');

  t.throws(() => {
    parse({ year: 0 });
  }, 'invalid input (year only)');

  t.throws(() => {
    parse({ year: 0, day: 0 });
  }, 'invalid input (missing month)');

  t.throws(() => {
    parse({ year: 0, month: 0 });
  }, 'invalid input (missing day)');

  t.throws(() => {
    parse({ year: 0, week: 0 });
  }, 'invalid input (missing day)');

  t.throws(() => {
    parse({ year: 0, week: 0, day: 'last' });
  }, 'invalid input ("last" day of week)');

  t.end();
})

test('return type', t => {
  t.ok(parse({ year: 0, month: 0, day: 0 }) instanceof Date, 'Date');
  t.end();
});

test('current date', t => {
  let now = new Date();
  let result = parse({ year: 0, month: 0, day: 0 });

  t.equal(result.getFullYear(), now.getFullYear(), 'year');
  t.equal(result.getMonth(), now.getMonth(), 'month');
  t.equal(result.getDate(), now.getDate(), 'day');
  t.end();
});

test('reference date ', t => {
  let now = new Date();
  let reference = new Date(1984, 11, 31);
  let result = parse({ year: 0, month: 0, day: 0 }, reference);

  t.equal(result.getFullYear(), 1984, 'year');
  t.equal(result.getMonth(), 11, 'month');
  t.equal(result.getDate(), 31, 'day');
  t.end();
});

const cases = [
  // relative all the things
  {
    input: [0, 0, 0, null],
    reference: [1984, 11, 31],
    expected: [1984, 11, 31]
  },

  // relative day
  {
    input: [0, 0, -1, null],
    reference: [1984, 11, 31],
    expected: [1984, 11, 30]
  },
  {
    input: [0, 0, -1, null],
    reference: [1984, 0, 1],
    expected: [1983, 11, 31]
  },
  {
    input: [0, 0, '+1', null],
    reference: [1984, 0, 1],
    expected: [1984, 0, 2]
  },
  {
    input: [0, 0, '+1', null],
    reference: [1984, 11, 31],
    expected: [1985, 0, 1]
  },

  // relative month
  {
    input: [0, -1, 0, null],
    reference: [1984, 11, 31],
    expected: [1984, 10, 30]
  },
  {
    input: [0, -1, 0, null],
    reference: [1984, 0, 31],
    expected: [1983, 11, 31]
  },
  {
    input: [0, '+1', 0, null],
    reference: [1984, 0, 31],
    expected: [1984, 1, 29] // leap year
  },
  {
    input: [0, '+1', 0, null],
    reference: [1985, 0, 31],
    expected: [1985, 1, 28] // not a leap year
  },
  {
    input: [0, '+1', 0, null],
    reference: [1984, 11, 31],
    expected: [1985, 0, 31]
  },

  // relative year
  {
    input: [-1, 0, 0, null],
    reference: [1984, 0, 1],
    expected: [1983, 0, 1]
  },
  {
    input: ['+1', 0, 0, null],
    reference: [1984, 0, 1],
    expected: [1985, 0, 1]
  },


  // absolute week (assumes locale "nl")
  {
    input: [2000, null, 1, 1],
    reference: [1984, 0, 1],
    expected: [2000, 0, 3]
  },

  // relative week
  {
    input: [0, null, 0, -1],
    reference: [1984, 7, 14],
    expected: [1984, 7, 7]
  },
  {
    input: [0, null, 0, '+1'],
    reference: [1984, 7, 14],
    expected: [1984, 7, 21]
  },

  // same week in other year
  {
    input: [-1, null, 0, 0],
    reference: [2000, 0, 1],
    expected: [1999, 0, 1]
  },
  {
    input: ['+1', null, 0, 0],
    reference: [2000, 0, 1],
    expected: [2001, 0, 1]
  },


  // absolute last day of month
  {
    input: [0, -2, "last", null],
    reference: [1984, 7, 14],
    expected: [1984, 5, 30]
  }
];

cases.forEach(function (testCase, i) {
  let { input, reference, expected } = testCase;
  let [ year, month, day, week ] = input;

  test(`case ${i + 1}: ${JSON.stringify(input)} (as array)`, t => {
    let result = parse(
      { year, month, day, week },
      new Date(...reference)
    );

    t.equal(result.getFullYear(), expected[0], 'year');
    t.equal(result.getMonth(), expected[1], 'month');
    t.equal(result.getDate(), expected[2], 'day');
    t.end();
  });

  test(`case ${i + 1}: ${JSON.stringify(input)} (as object)`, t => {
    let result = parse(
      { year, month, day, week },
      new Date(...reference)
    );

    t.equal(result.getFullYear(), expected[0], 'year');
    t.equal(result.getMonth(), expected[1], 'month');
    t.equal(result.getDate(), expected[2], 'day');
    t.end();
  });
});
