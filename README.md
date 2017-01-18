# Relative date parser

Parse a relative date description to a native `Date` object. By default, the
result is relative to the current date, but it's possible to provide a different
reference date.

## Usage

```bash
npm install connectedmolecules/relative-date-parser
```

#### Object input

```js
const parseDate = require('relative-date-parser');

let date = parseDate({ year: -1, month: 0, day: 1 });
```

#### Array input

```js
let date = parseDate([ 2017, "+3", "last" ]);
```

#### Reference date

```js
let reference = new Date(1984, 3, 4);
let date = parseDate([ 0, 0, 1 ], reference); // 1984-04-01
```


## Relative date description format

A date description can describe a **date** (year, month, day) or a **weekday**
(year, week, day).

Each part of the description can be **absolute** (e.g. the year `2017`) or a **relative** value (e.g. `-1`, `0` or `+42`).

#### Dates

Dates are described by a `year`, `month`, and `day`. In this case `day` is the
day of the month. It can have the special value `"last"`, meaning "the last day
of the given month". Unlike with native JavaScript dates, `month` is base 1
(januari is month `1`).

#### Weekdays

Weekdays are described by a `year`, `week` and `day`. In this case, `day` is the
day of the week, starting with monday as `1`. Keep in mind that a date in a
certain year's first or last week does not necessarily fall in that year. For
example, `{ year: 2000, week: 1, day: 1 }` means 1999-12-27.

## License

MIT
