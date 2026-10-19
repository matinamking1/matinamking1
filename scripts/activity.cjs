const fs = require('node:fs');
const path = require('node:path');
const profileOwner = process.env.GITHUB_REPOSITORY_OWNER || 'matinamking1';

const query = `query($login: String!) {
  viewer { login }
  user(login: $login) {
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel weekday } }
      }
    }
  }
}`;
const escape = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
}[c]));
function render(collection, updated) {
  const calendar = collection.contributionCalendar;
  const days = calendar.weeks.flatMap(w => w.contributionDays);
  const active = days.filter(d => d.contributionCount > 0).length;
  const peak = Math.max(0, ...days.map(d => d.contributionCount));
  const colors = { NONE: '#1e293b', FIRST_QUARTILE: '#134e4a',
    SECOND_QUARTILE: '#0f766e', THIRD_QUARTILE: '#14b8a6', FOURTH_QUARTILE: '#5eead4' };
  const cards = [
    [calendar.totalContributions.toLocaleString('en-US'), 'CONTRIBUTIONS'],
    [active, 'ACTIVE DAYS'],
    [peak, 'BEST DAY'],
    [collection.restrictedContributionsCount.toLocaleString('en-US'), 'RESTRICTED CONTRIBUTIONS']
  ].map(([value, label], i) => `<g transform="translate(${40 + i * 225} 80)">
    <rect width="210" height="92" rx="12" fill="#142235"/>
    <text x="18" y="40" font-size="30" fill="#5eead4" font-weight="700">${escape(value)}</text>
    <text x="18" y="68" font-size="10" fill="#94a3b8" letter-spacing="1">${label}</text></g>`).join('');
  const cells = calendar.weeks.map((week, x) => week.contributionDays.map(d =>
    `<rect x="${40 + x * 17}" y="${202 + d.weekday * 17}" width="13" height="13" rx="3" fill="${colors[d.contributionLevel] || colors.NONE}"><title>${escape(d.date)}: ${d.contributionCount} contributions</title></rect>`
  ).join('')).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="980" height="380" viewBox="0 0 980 380" role="img" aria-labelledby="title desc">
  <title id="title">A year of building — GitHub activity</title>
  <desc id="desc">${calendar.totalContributions} contributions, ${active} active days. Restricted contributions: ${collection.restrictedContributionsCount}. Updated ${escape(updated)}.</desc>
  <rect width="980" height="380" rx="20" fill="#0b1220"/>
  <g font-family="Segoe UI,Arial,sans-serif">
  <text x="40" y="43" font-size="19" fill="#f1f5f9" font-weight="600">A YEAR OF BUILDING</text>
  <text x="940" y="43" text-anchor="end" font-size="12" fill="#94a3b8">@${escape(profileOwner)} / GitHub</text>
  ${cards}${cells}
  <text x="40" y="353" font-size="11" fill="#94a3b8">Last year · GitHub contribution rules · Private activity shown as counts only</text>
  <text x="940" y="353" text-anchor="end" font-size="11" fill="#94a3b8">Updated ${escape(updated)}</text>
  </g></svg>`;
}
async function main() {
  if (!process.env.GH_TOKEN) throw new Error('Set PROFILE_TOKEN to a personal token owned by ' + profileOwner + ' with read:user access.');
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.GH_TOKEN}`,
      'Content-Type': 'application/json', 'User-Agent': 'matinamking-profile' },
    body: JSON.stringify({ query, variables: { login: profileOwner } }),
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`GitHub API returned HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.errors || !payload.data?.user) throw new Error('GitHub contribution query failed; previous dashboard preserved.');
  if (payload.data.viewer?.login?.toLowerCase() !== profileOwner.toLowerCase()) {
    throw new Error('PROFILE_TOKEN must belong to ' + profileOwner + '; the supplied token belongs to a different account.');
  }
  const collection = payload.data.user.contributionsCollection;
  if (process.argv.includes('--check-token')) {
    console.log('Profile owner authenticated. Both visuals use the owner contribution calendar.');
    return;
  }
  const svg = render(collection, new Date().toISOString().slice(0, 10));
  const target = path.join(__dirname, '..', 'assets', 'activity.svg');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, svg);
  console.log('Updated aggregate contribution dashboard.');
}
module.exports = { render };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
