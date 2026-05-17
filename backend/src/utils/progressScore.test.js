const { computeProgressScore } = require('./progressScore');

describe('Progress Score Algorithm', () => {
  it('should correctly calculate MIN (Minimize) targets', () => {
    // If target is 50 defects, actual 25 means doing better -> score should be > 100% (capped at 100%)
    expect(computeProgressScore('MIN', 50, 25)).toBe(100.0);
    // If actual is 100 defects, score should be 50%
    expect(computeProgressScore('MIN', 50, 100)).toBe(50.0);
  });

  it('should correctly calculate MAX (Maximize) targets', () => {
    // Target 1000 sales, actual 500 -> 50%
    expect(computeProgressScore('MAX', 1000, 500)).toBe(50.0);
    // Target 1000, actual 1200 -> 100% (capped)
    expect(computeProgressScore('MAX', 1000, 1200)).toBe(100.0);
  });

  it('should format everything to strict 2 decimal precision safely', () => {
    // 10 / 3 = 3.3333333333 -> should be 33.33
    expect(computeProgressScore('MAX', 30, 10)).toBe(33.33);
  });
});
