const moment = require('moment');

const relativePartRegex = /^[+-]/;
const units = ['year', 'month', 'day', 'week'];

/**
 * Parse a relative date description to a Date object, relative to the current
 * date or the given referenceDate.
 *
 * Input can be an object or an array. The year and day fields are mandatory.
 * In addition to that, either month or week must be given.
 *
 * @param {object|array}    input
 * @param   {number|string}   input.year
 * @param   {number|string}   [input.month]
 * @param   {number|string}   input.day
 * @param   {number|string}   [input.week]
 * @param {Date}            [referenceDate]
 *
 * @return {Date}
 */
module.exports = function parse (input, referenceDate) {
  input = parseInput(input);
  validateInput(input);

  var result = moment(referenceDate || new Date()).locale('nl'); // TODO FIXME XXX locale

  applyYear(result, input);
  applyMonth(result, input);
  applyWeek(result, input);
  applyDay(result, input);

  return result.toDate();
};

function applyYear (result, input) {
  var year = input.year;
  var week = input.week;

  if (week.valid && !week.relative) {
    var weekYear = year.relative
      ? (result.year() + year.value)
      : year.value;

    result.weekYear(weekYear);
  }
  else if (year.relative) {
    result.add(year.value, 'year');
  }
  else {
    result.set('year', year.value);
  }
}

function applyMonth (result, input) {
  var month = input.month;

  if (!month.valid) {
    return;
  }

  if (month.relative) {
    result.add(month.value, 'month');
  }
  else {
    result.set('month', month.value - 1);
  }
}

function applyWeek (result, input) {
  var week = input.week;

  if (week.relative) {
    result.add(week.value * 7, 'day');
  }
  else {
    result.set('week', week.value);
  }
}

function applyDay (result, input) {
  var week = input.week;
  var day = input.day;

  if (day.relative) {
    result.add(day.value, 'day');
  }
  else if (day.value === 'last') {
    result.endOf('month');
  }
  else {
    var unit = week.valid ? 'day' : 'date';
    result.set(unit, day.value);
  }
}

function parseInput (input) {
  if (typeof input !== 'object') {
    throw new Error('Invalid input type (' + (typeof input)+ ')');
  }

  var isArray = Array.isArray(input);
  var parsedInput = {};

  units.forEach(function (unit, i) {
    var value = isArray ? input[i] : input[unit];
    var valid = isValid(unit, value);
    var relative = valid && isRelative(value);

    value = (value === 'last') ? value : parseInt(value, 10);

    parsedInput[unit] = { value: value, valid: valid, relative: relative };
  });

  return parsedInput;
}

function isValid (unit, value) {
  return (
    (typeof value === 'string' && !isNaN(parseInt(value, 10))) ||
    typeof value === 'number' ||
    (unit === 'day' && value === 'last')
  );
}

function isRelative (value) {
  return relativePartRegex.test(value) || value === '0' || value <= 0;
}

function validateInput (input) {
  var year = input.year;
  var month = input.month;
  var week = input.week;
  var day = input.day;

  if (!year.valid) {
    throw new Error('Invalid year');
  }

  if (!day.valid) {
    throw new Error('Invalid day');
  }

  if (!month.valid && !week.valid) {
    throw new Error('Invalid month or week');
  }

  if (month.valid && week.valid) {
    throw new Error('Invalid input: month and week cannot be combined');
  }

  if (week.valid && day.value === 'last') {
    throw new Error('Invalid day: "last" day of week not supported');
  }
}
