const fs = require('node:fs');
const path = require('node:path');

function renderSnake(collection, dark) {
  const calendar = collection.contributionCalendar;
  const weeks = calendar.weeks;
  const colors = dark
    ? ['#161b22', '#134e4a', '#0f766e', '#14b8a6', '#5eead4']
    : ['#ebedf0', '#c4b5fd', '#a78bfa', '#8b5cf6', '#6d28d9'];
  const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
  // Traverse every calendar cell continuously, alternating down/up each week.
  const route = [];
  for (let x = 0; x < weeks.length; x++) {
    for (let row = 0; row < 7; row++) route.push([x, x % 2 ? 6 - row : row]);
  }
  // Return outside the grid, so the loop never jumps across the calendar.
  const last = route[route.length - 1];
  route.push([last[0] + 1, last[1]], [last[0] + 1, -1], [-1, -1], [-1, 0], [0, 0]);
  const position = new Map(route.slice(0, weeks.length * 7).map(([x, y], i) => [x + ',' + y, i]));
  const totalSteps = route.length - 1;
  const duration = 48;
  const styles = [];
  let active = 0;
  const cells = weeks.map((week, x) => week.contributionDays.map(day => {
    const level = Math.max(0, levels.indexOf(day.contributionLevel));
    const index = position.get(x + ',' + day.weekday);
    const id = 'd' + index;
    if (day.contributionCount > 0) {
      active++;
      const before = Math.max(0, (index / totalSteps * 100) - 0.01).toFixed(4);
      const eaten = (index / totalSteps * 100).toFixed(4);
      styles.push('@keyframes ' + id + '{0%,' + before + '%{fill:' + colors[level] +
        '} ' + eaten + '%,100%{fill:' + colors[0] + '}} .' + id +
        '{animation:' + id + ' ' + duration + 's linear infinite}');
    }
    return '<rect class="' + id + '" x="' + (30 + x * 16) + '" y="' +
      (56 + day.weekday * 16) + '" width="12" height="12" rx="3" fill="' +
      colors[level] + '"><title>' + day.date + ': ' + day.contributionCount + ' contributions</title></rect>';
  }).join('')).join('');
  const coordinates = route.map(([x, y]) => (36 + x * 16) + ',' + (62 + y * 16)).join(';');
  const times = route.map((_, i) => (i / totalSteps).toFixed(6)).join(';');
  const segments = [3, 2, 1, 0].map(segment =>
    '<g opacity="' + (1 - segment * 0.16) + '"><circle r="' + (segment ? 5 : 6) +
    '" fill="' + (dark ? '#c4b5fd' : '#7c3aed') + '"/>' +
    '<animateTransform attributeName="transform" type="translate" values="' + coordinates +
    '" keyTimes="' + times + '" dur="' + duration + 's" begin="' +
    (segment * duration / totalSteps).toFixed(4) + 's" repeatCount="indefinite"/></g>').join('');
  const width = Math.max(800, weeks.length * 16 + 70);
  const text = dark ? '#cbd5e1' : '#334155';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width +
    '" height="220" viewBox="0 0 ' + width + ' 220" role="img" aria-labelledby="title desc">' +
    '<title id="title">Contribution snake — ' + calendar.totalContributions + ' contributions</title>' +
    '<desc id="desc">' + active + ' active days. Generated from the same owner-authenticated GitHub calendar as the dashboard. Private activity is represented only by daily counts.</desc>' +
    '<style>' + styles.join('') + '@media(prefers-reduced-motion:reduce){rect{animation:none!important}g{display:none}}</style>' +
    '<rect width="100%" height="100%" rx="16" fill="' + (dark ? '#0b1220' : '#f8fafc') + '"/>' +
    '<text x="30" y="28" font-family="Segoe UI,Arial,sans-serif" font-size="13" fill="' + text +
    '">CONTRIBUTION SNAKE / ' + calendar.totalContributions + ' contributions / ' + active + ' active days</text>' +
    cells + segments + '<text x="30" y="199" font-family="Segoe UI,Arial,sans-serif" font-size="11" fill="' +
    text + '">Owner calendar · Daily counts only · Updated ' + new Date().toISOString().slice(0, 10) + '</text></svg>';
}

if (require.main === module) {
  const collection = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const output = process.argv[3] || 'dist';
  fs.mkdirSync(output, { recursive: true });
  for (const dark of [false, true]) {
    const filename = 'github-contribution-grid-snake' + (dark ? '-dark' : '') + '.svg';
    fs.writeFileSync(path.join(output, filename), renderSnake(collection, dark));
  }
  console.log('Both snake themes generated from the authenticated contribution calendar.');
}
module.exports = { renderSnake };
