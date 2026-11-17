#!/usr/bin/env bash
# Checks the live site: every page answers, sends its security headers and
# shows real data, not one of the site's "could not be loaded" messages.
#
# Run it yourself:
#   bash scripts/check-live.sh https://ai-stock-researcher-ten.vercel.app
# GitHub runs it every three hours (.github/workflows/live-check.yml) and
# opens an issue when it fails.
#
# A source can be busy for a minute or two (the SEC sometimes is), so a
# failed check is tried once more after a pause before it counts. Set
# RETRY_WAIT (seconds) to change the pause.

set -u
site="${1:?Give the site address, for example https://ai-stock-researcher-ten.vercel.app}"
site="${site%/}"
retry_wait="${RETRY_WAIT:-300}"

# Every page of the site. Add new pages here.
pages=(/ /chart /metrics /news /news/filings /news/announcements /news/industry /news/coverage)
headers=(content-security-policy x-frame-options x-content-type-options referrer-policy permissions-policy strict-transport-security)

check_once() {
  local problems=0 dir status page header
  dir=$(mktemp -d)
  for page in "${pages[@]}"; do
    status=$(curl -s -m 30 -D "$dir/headers" -o "$dir/body" -w '%{http_code}' "$site$page")
    if [ "$status" != "200" ]; then
      echo "FAIL $page answered $status"
      problems=$((problems + 1))
      continue
    fi
    for header in "${headers[@]}"; do
      if ! grep -q -i "^$header:" "$dir/headers"; then
        echo "FAIL $page is missing the $header header"
        problems=$((problems + 1))
      fi
    done
    if grep -q "could not be loaded right now" "$dir/body"; then
      echo "FAIL $page shows a \"could not be loaded\" message"
      problems=$((problems + 1))
    fi
  done
  # A page that does not exist should say so, not crash.
  status=$(curl -s -m 30 -o /dev/null -w '%{http_code}' "$site/this-page-does-not-exist")
  if [ "$status" != "404" ]; then
    echo "FAIL a missing page answered $status instead of 404"
    problems=$((problems + 1))
  fi
  rm -rf "$dir"
  [ "$problems" -eq 0 ]
}

echo "Checking $site (${#pages[@]} pages)"
if check_once; then
  echo "All good."
  exit 0
fi
echo "Trying again in $retry_wait seconds, in case a source was busy for a moment."
sleep "$retry_wait"
if check_once; then
  echo "All good on the second try."
  exit 0
fi
echo "The live site has the problems listed above."
exit 1
