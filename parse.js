const moment = require('moment');

const relativePartRegex = /^[+-]/;

module.exports = function parse ({ year, month, day, week }, referenceDate) {
  let valid = {
    year: isValidPart(year),
    month: isValidPart(month),
    day: isValidDay(day),
    week: isValidPart(week)
  };

  if (!(valid.year && valid.day && (valid.week || valid.month))) {
    throw new Error('Invalid input');
  }

  let result = moment(referenceDate || new Date()).locale('nl'); // TODO FIXME XXX locale

  if (valid.week) {
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

function isRelative (part) {
  return relativePartRegex.test(part) || part === '0' || part <= 0;
}
