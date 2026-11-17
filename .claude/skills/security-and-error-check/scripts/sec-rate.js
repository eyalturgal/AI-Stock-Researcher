// Reads a build log made with SEC_LOG_REQUESTS=1 and reports how fast the
// site asked the SEC for data. The SEC allows at most 10 requests a second,
// and the site's queue allows 8. Exits with 1 above 8.
// Usage: node .claude/skills/security-and-error-check/scripts/sec-rate.js build.log

const fs = require("fs");
const times = fs.readFileSync(process.argv[2], "utf8").split("\n")
  .map((line) => line.match(/SEC request: (\S+Z) /)?.[1])
  .filter(Boolean)
  .map((t) => Date.parse(t))
  .sort((a, b) => a - b);
if (times.length < 2) {
  console.log(`${times.length} SEC request(s): too few to measure a rate.`);
  process.exit(0);
}
const gaps = times.slice(1).map((t, i) => t - times[i]);
const most = Math.max(...times.map((t) => times.filter((u) => u >= t && u < t + 1000).length));
console.log(`${times.length} SEC requests over ${((times.at(-1) - times[0]) / 1000).toFixed(1)} s`);
console.log(`smallest gap: ${Math.min(...gaps)} ms, most in any one second: ${most}`);
process.exit(most > 8 ? 1 : 0);
