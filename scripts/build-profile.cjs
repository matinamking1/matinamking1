const fs = require('node:fs');
const path = require('node:path');
const { render } = require('./activity.cjs');
const { renderSnake } = require('./snake.cjs');

function buildProfile(collection) {
  const calendar = collection.contributionCalendar;
  const days = calendar.weeks.flatMap(week => week.contributionDays);
  const total = days.reduce((sum, day) => sum + day.contributionCount, 0);
  if (total !== calendar.totalContributions) {
    throw new Error('Calendar daily counts do not match its total; previous images preserved.');
  }
  const active = days.filter(day => day.contributionCount > 0).length;
  const outputs = {
    'activity.svg': render(collection, new Date().toISOString().slice(0, 10)),
    'snake-light.svg': renderSnake(collection, false),
    'snake-dark.svg': renderSnake(collection, true)
  };
  for (const [name, svg] of Object.entries(outputs)) {
    if (name.startsWith('snake-') && (!svg.includes(total + ' contributions / ' + active + ' active days') ||
        svg.includes('Generated with https://github.com/Platane/snk'))) {
      throw new Error('Snake generator or calendar mismatch; previous images preserved.');
    }
    for (const day of days) {
      if (!svg.includes('<title>' + day.date + ': ' + day.contributionCount + ' contributions</title>')) {
        throw new Error('Missing daily contribution count in ' + name);
      }
    }
  }
  return outputs;
}

if (require.main === module) {
  const collection = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const outputs = buildProfile(collection);
  const target = path.join(__dirname, '..', 'assets');
  fs.mkdirSync(target, { recursive: true });
  for (const [name, svg] of Object.entries(outputs)) fs.writeFileSync(path.join(target, name), svg);
  console.log('Verified dashboard and both snakes: ' + collection.contributionCalendar.totalContributions + ' contributions from one owner calendar.');
}
module.exports = { buildProfile };
