const moment = require('moment');

const relativePartRegex = /^[+-]/;

/**
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
  if (Array.isArray(input)) {
    var [ year, month, day, week ] = input;
  }
  else if (typeof input === 'object') {
    var { year, month, day, week } = input;
  }
  else {
    throw new Error('Missing input');
  }

  if (!isValidPart(year)) {
    throw new Error('Invalid year');
  }

  if (!isValidDay(day)) {
    throw new Error('Invalid day');
  }

  let validMonth = isValidPart(month);
  let validWeek = isValidPart(week);

  if (!isValidPart(month) && !isValidPart(week)) {
    throw new Error('Invalid month / week');
  }

  if (validWeek && day === 'last') {
    throw new Error('Invalid day: "last" only supported with month');
  }

  let result = moment(referenceDate || new Date()).locale('nl'); // TODO FIXME XXX locale

  if (isValidPart(week)) {
    if (isRelative(week)) {
      applyInput(result, year, 'year');
      applyInput(result, week, 'week');
      applyInput(result, day, 'day');
    }
    else {
      let parsedYear = parseInt(year, 10);
      let newYear = isRelative(year)
        ? (result.year() + parsedYear)
        : parsedYear;

      result.weekYear(newYear);
      applyInput(result, week, 'week');
      applyInput(result, day, 'day');
    }
  }
  else {
    applyInput(result, year, 'year');
    applyInput(result, month, 'month');
    applyInput(result, day, 'date');
  }

  return result.toDate();
};

function isValidPart (part) {
  return (
    (typeof part === 'string' && !isNaN(parseInt(part, 10))) ||
    typeof part === 'number'
  );
}

function isValidDay (day) {
  return isValidPart(day) || day === 'last';
}

function isRelative (part) {
  return relativePartRegex.test(part) || part === '0' || part <= 0;
}

function applyInput (result, input, unit) {
  if (isRelative(input)) {
    if (unit === 'date') {
      result.add(parseInt(input, 10), 'day');
    }
    else if (unit === 'week') {
      result.add(parseInt(input, 10) * 7, 'day');
    }
    else {
      result.add(parseInt(input, 10), unit);
    }
  }
  else if (input === 'last') {
    result.endOf('month');
  }
  else {
    input = parseInt(input, 10);
    input = (unit === 'month') ? input - 1 : input;
    result.set(unit, input);
  }
}
