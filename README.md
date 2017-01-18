# Relative date parser

Parse a relative date description to a native Date object.

For example:

```es6
const parseDate = require('relative-date-parser');

let date = parseDate({
  year: -1,
  month: 0,
  day: 1
});

typeof date; // Date
```

In this example, the resulting date object is for the first day of the current
month of the year before the current year.
