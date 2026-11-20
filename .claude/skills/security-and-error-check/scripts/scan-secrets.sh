#!/usr/bin/env bash
# Looks for secrets where they must never be: the git history (every past
# change, not only today's files), the code sent to browsers (.next/static,
# so build first) and every tracked file. Prints counts, never the secrets.
#
# Each value in .env.local that is 8 characters or longer is searched for,
# and the contact email in SEC_USER_AGENT on its own. Then common secret
# formats. The README's placeholder examples are ignored.
# Usage: bash .claude/skills/security-and-error-check/scripts/scan-secrets.sh

cd "$(git rev-parse --show-toplevel)" || exit 1
found=0
report() {
  printf "  %-46s %s\n" "$1" "$2"
  if [ "$2" != "0" ]; then found=1; fi
}
placeholders='user:password@|you@example\.com'
# This script holds the patterns it searches for, so its own file (and
# its own past versions) are left out of the search.
self=".claude/skills/security-and-error-check/scripts/scan-secrets.sh"
history=$(git log --all -p --format='' -- . ":(exclude)$self" | grep -v -E "$placeholders")
files=$(git ls-files | grep -v -E '\.(png|ico|jpg|woff2?|svg)$|package-lock\.json$' | grep -v -F "$self")

echo "Files that must never be committed:"
report ".env files in the git history" "$(git log --all --format='' --name-only | grep -c -E '(^|/)\.env')"

echo "Values from .env.local:"
if [ -f .env.local ]; then
  while IFS='=' read -r name value; do
    [[ -z "$name" || "$name" == \#* ]] && continue
    value="${value%\"}"; value="${value#\"}"
    [ "$name" = "SEC_USER_AGENT" ] && value="${value##* }"   # just the email
    [ ${#value} -lt 8 ] && continue
    report "$name, in the git history" "$(printf '%s' "$history" | grep -c -F -- "$value")"
    report "$name, in the browser code" "$(grep -r -l -F -- "$value" .next/static 2>/dev/null | wc -l | tr -d ' ')"
  done < .env.local
else
  echo "  (no .env.local here, skipped)"
fi

echo "Common secret formats (git history / tracked files / browser code):"
while IFS='|' read -r label pattern; do
  h=$(printf '%s' "$history" | grep -E -c -i -- "$pattern")
  f=$(grep -E -i -- "$pattern" $files 2>/dev/null | grep -v -E "$placeholders" | wc -l | tr -d ' ')
  b=$(grep -r -E -i -l -- "$pattern" .next/static 2>/dev/null | wc -l | tr -d ' ')
  printf "  %-46s %s\n" "$label" "$h / $f / $b"
  [ "$h$f$b" != "000" ] && found=1
done <<'PATTERNS'
private key|-----BEGIN [A-Z ]*PRIVATE KEY
AWS key|AKIA[0-9A-Z]{16}
GitHub token|gh[pousr]_[A-Za-z0-9]{30,}|github_pat[_]
Anthropic or OpenAI key|sk-(ant-)?[A-Za-z0-9_-]{20,}
Slack token|xox[abpr]-
Google key|AIza[0-9A-Za-z_-]{30,}
Stripe key|[rs]k_live_
Neon password|npg_[A-Za-z0-9]{8,}
web address with a password|[a-z]+://[^/:@ ]+:[^/@ ]{3,}@
password, secret, token or key set to text|(password|secret|token|api[_-]?key)["']?[[:space:]]*[:=][[:space:]]*["'][^"']{8,}
PATTERNS

if [ "$found" -eq 0 ]; then echo "Nothing found."; else echo "FOUND SOMETHING: look at the lines above (the matches are not printed)."; fi
exit "$found"
