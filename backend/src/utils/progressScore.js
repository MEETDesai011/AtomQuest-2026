const { differenceInDays } = require('date-fns');

function computeProgressScore(uom, target, actual, targetDate = null, actualDate = null) {
  if (actual === null || actual === undefined) return 0;

  switch (uom) {
    case 'MIN':
      return actual === 0
        ? 100
        : Math.min(parseFloat(((target / actual) * 100).toFixed(2)), 100);

    case 'MAX':
      return target === 0
        ? 100
        : Math.min(parseFloat(((actual / target) * 100).toFixed(2)), 100);

    case 'ZERO':
      return actual === 0 ? 100 : 0;

    case 'TIMELINE': {
      if (!targetDate || !actualDate) return 0;
      const targetDays = differenceInDays(new Date(targetDate), new Date());
      const actualDays = differenceInDays(new Date(actualDate), new Date());
      if (actualDays <= targetDays) return 100;
      return Math.max(
        0,
        parseFloat(
          (100 - ((actualDays - targetDays) / targetDays) * 100).toFixed(2)
        )
      );
    }

    default:
      return 0;
  }
}

module.exports = { computeProgressScore };
