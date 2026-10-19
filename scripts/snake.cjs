const fs = require('node:fs');
const path = require('node:path');
const key = ([x, y]) => x + ',' + y;
const same = (a, b) => key(a) === key(b);

function buildRoute(weeks) {
  // Stable randomness: different contribution patterns produce different journeys.
  let seed = 2166136261;
  const targets = new Map();
  weeks.forEach((week, x) => week.contributionDays.forEach(day => {
    seed = Math.imul(seed ^ (day.contributionCount + x * 7 + day.weekday), 16777619) >>> 0;
    if (day.contributionCount > 0) targets.set(key([x, day.weekday]), [x, day.weekday]);
  }));
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const route = [[-1, -1], [-1, 0], [-1, 1]];
  let body = [[-1, 1], [-1, 0], [-1, -1]];
  const arrivals = new Map();
  const move = point => {
    route.push(point);
    body.unshift(point);
    body = body.slice(0, 8);
    const id = key(point);
    if (targets.has(id)) {
      targets.delete(id);
      if (!arrivals.has(id)) arrivals.set(id, route.length - 1);
    }
  };
  function findPath(target, reserveExit = false) {
    const start = route[route.length - 1];
    const blocked = new Set(body.slice(1).map(key));
    const queue = [start], parents = new Map([[key(start), null]]);
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    // A new neighbor order adds bends without jumps or diagonal movement.
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      if (same(current, target)) {
        const result = [];
        let cursor = current;
        while (!same(cursor, start)) {
          result.push(cursor);
          cursor = parents.get(key(cursor));
        }
        return result.reverse();
      }
      for (const [dx, dy] of directions) {
        const next = [current[0] + dx, current[1] + dy];
        if (next[0] < -1 || next[0] > weeks.length + (reserveExit ? 1 : 0) || next[1] < -1 || next[1] > (reserveExit ? 8 : 7) ||
            blocked.has(key(next)) || parents.has(key(next))) continue;
        parents.set(key(next), current);
        queue.push(next);
      }
    }
    return null;
  }
  while (targets.size) {
    const head = route[route.length - 1];
    const candidates = [...targets.values()].map(point => ({
      point, score: Math.abs(head[0] - point[0]) + Math.abs(head[1] - point[1]) + random() * 10
    })).sort((a, b) => a.score - b.score);
    let chosen;
    for (const candidate of candidates) {
      chosen = findPath(candidate.point);
      if (chosen) break;
    }
    if (!chosen) {
      // Remaining food can be underneath the tail. Keep moving until it is free.
      const occupied = new Set(body.slice(0, -1).map(key));
      const options = [[1, 0], [0, 1], [-1, 0], [0, -1]]
        .map(([dx, dy]) => [head[0] + dx, head[1] + dy])
        .filter(p => p[0] >= -1 && p[0] <= weeks.length && p[1] >= -1 && p[1] <= 7 && !occupied.has(key(p)));
      if (!options.length || route.length > 50000) throw new Error('Snake route could not be completed safely.');
      chosen = [options[Math.floor(random() * options.length)]];
    }
    chosen.forEach(move);
  }
  // Exit and return around the perimeter to join the first frame continuously.
  const exit = findPath([weeks.length + 1, 8], true);
  if (!exit) throw new Error('Snake could not leave the grid safely.');
  exit.forEach(move);
  move([weeks.length + 2, 8]);
  for (let y = 7; y >= -2; y--) move([weeks.length + 2, y]);
  for (let x = weeks.length + 1; x >= -1; x--) move([x, -2]);
  move([-1, -1]);
  return { route, arrivals };
}

function renderSnake(collection, dark) {
  const calendar = collection.contributionCalendar;
  const weeks = calendar.weeks;
  const { route, arrivals } = buildRoute(weeks);
  const palette = dark
    ? ['#182333', '#134e4a', '#0f766e', '#14b8a6', '#5eead4']
    : ['#e9e7f2', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6'];
  const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
  const steps = route.length - 1;
  const duration = Math.max(24, steps * 0.085);
  const styles = [];
  let active = 0;
  const cells = weeks.map((week, x) => week.contributionDays.map(day => {
    const level = Math.max(0, levels.indexOf(day.contributionLevel));
    const id = 'd' + x + '-' + day.weekday;
    if (day.contributionCount > 0) {
      active++;
      const arrival = arrivals.get(key([x, day.weekday]));
      const before = Math.max(0, arrival / steps * 100 - 0.01).toFixed(5);
      const eaten = (arrival / steps * 100).toFixed(5);
      styles.push('@keyframes ' + id + '{0%,' + before + '%{fill:' + palette[level] +
        '} ' + eaten + '%,100%{fill:' + palette[0] + '}} .' + id +
        '{animation:' + id + ' ' + duration + 's linear infinite}');
    }
    return '<rect class="' + id + '" x="' + (30 + x * 16) + '" y="' +
      (72 + day.weekday * 16) + '" width="12" height="12" rx="3.5" fill="' +
      palette[level] + '"><title>' + day.date + ': ' + day.contributionCount + ' contributions</title></rect>';
  }).join('')).join('');
  // All segments use the same clock and shifted route, including the first frame.
  const cycle = route.slice(0, -1);
  const wrap = i => cycle[(i % steps + steps) % steps];
  const times = route.map((_, i) => (i / steps).toFixed(7)).join(';');
  const skin = dark
    ? ['#f5eaff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8']
    : ['#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];
  const segments = Array.from({ length: 8 }, (_, index) => 7 - index).map(segment => {
    const positions = route.map((_, i) => {
      const [x, y] = wrap(i - segment);
      return (36 + x * 16) + ',' + (78 + y * 16);
    }).join(';');
    let shape = '<rect x="-6" y="-6" width="12" height="12" rx="4.5" fill="' + skin[segment] + '"/>';
    if (!segment) {
      const angles = route.map((_, i) => {
        const current = wrap(i), next = wrap(i + 1);
        const angle = Math.atan2(next[1] - current[1], next[0] - current[0]) * 180 / Math.PI;
        return angle + ' 0 0';
      }).join(';');
      shape = '<g>' + shape + '<circle cx="2.5" cy="-2.8" r="1.5" fill="#171329"/>' +
        '<circle cx="2.5" cy="2.8" r="1.5" fill="#171329"/>' +
        '<animateTransform attributeName="transform" type="rotate" values="' + angles +
        '" keyTimes="' + times + '" calcMode="discrete" dur="' + duration +
        's" repeatCount="indefinite"/></g>';
    }
    return '<g class="snake" transform="translate(' + positions.split(';')[0] + ')">' + shape +
      '<animateTransform attributeName="transform" type="translate" values="' + positions +
      '" keyTimes="' + times + '" dur="' + duration + 's" repeatCount="indefinite"/></g>';
  }).join('');
  const width = Math.max(800, weeks.length * 16 + 100);
  const text = dark ? '#cbd5e1' : '#334155';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width +
    '" height="270" viewBox="0 0 ' + width + ' 270" role="img" aria-labelledby="title desc">' +
    '<title id="title">Contribution snake — ' + calendar.totalContributions + ' contributions</title>' +
    '<desc id="desc">' + active + ' active days. A winding snake hunts active contribution cells. Private activity is represented only by daily counts.</desc>' +
    '<style>' + styles.join('') + '@media(prefers-reduced-motion:reduce){rect{animation:none!important}.snake{display:none}}</style>' +
    '<rect width="100%" height="100%" rx="16" fill="' + (dark ? '#0b1220' : '#f8fafc') + '"/>' +
    '<text x="30" y="28" font-family="Segoe UI,Arial,sans-serif" font-size="13" fill="' + text +
    '">CONTRIBUTION SNAKE / ' + calendar.totalContributions + ' contributions / ' + active + ' active days</text>' +
    cells + segments + '<text x="30" y="245" font-family="Segoe UI,Arial,sans-serif" font-size="11" fill="' +
    text + '">Owner calendar · Daily counts only · Updated ' + new Date().toISOString().slice(0, 10) + '</text></svg>';
}

if (require.main === module) {
  const collection = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const output = process.argv[3] || 'dist';
  fs.mkdirSync(output, { recursive: true });
  for (const dark of [false, true]) {
    fs.writeFileSync(path.join(output, 'github-contribution-grid-snake' + (dark ? '-dark' : '') + '.svg'),
      renderSnake(collection, dark));
  }
  console.log('Both snake themes generated from the authenticated contribution calendar.');
}
module.exports = { renderSnake, buildRoute };
