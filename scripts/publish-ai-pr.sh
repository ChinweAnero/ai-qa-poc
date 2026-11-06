
#!/usr/bin/env bash
set -euo pipefail

JIRA_KEY="${1:?Usage: ./scripts/publish-ai-pr.sh SCRUM-3}"

if [[ ! "$JIRA_KEY" =~ ^[A-Z][A-Z0-9]*-[0-9]+$ ]]; then
  echo "Invalid Jira key"
  exit 1
fi

BRANCH="ai-tests/${JIRA_KEY}"
SPEC_FILE="tests/specifications/${JIRA_KEY}.json"
PLAN_FILE="tests/plans/${JIRA_KEY}.md"
TEST_FILE="tests/e2e/${JIRA_KEY}.spec.ts"

for file in "$SPEC_FILE" "$PLAN_FILE" "$TEST_FILE"; do
  test -s "$file" || {
    echo "Missing artifact: $file"
    exit 1
  }
done

git fetch origin main

# Detect an existing PR before creating anything.
EXISTING_PR=$(gh pr list \
  --state open \
  --head "$BRANCH" \
  --json url \
  --jq '.[0].url // empty')

if [[ -n "$EXISTING_PR" ]]; then
  echo "Existing PR: $EXISTING_PR"
  echo "PR_URL=$EXISTING_PR" >> "$GITHUB_ENV"
  exit 0
fi

if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null; then
  echo "Branch already exists without an open PR."
  echo "Manual review required before retrying."
  exit 1
fi

git switch -c "$BRANCH"

git config user.name "github-actions[bot]"
git config user.email \
  "41898282+github-actions[bot]@users.noreply.github.com"

git add -- "$SPEC_FILE" "$PLAN_FILE" "$TEST_FILE"

if git diff --cached --quiet; then
  echo "No changes to commit."
  exit 1
fi

git commit -m "test: AI-generated tests for $JIRA_KEY"
git push -u origin "$BRANCH"

PR_URL=$(gh pr create \
  --base main \
  --head "$BRANCH" \
  --draft \
  --title "test: AI-generated tests for $JIRA_KEY" \
  --body "Generated from Jira $JIRA_KEY.

Requires human review before merging.")

echo "PR_URL=$PR_URL" >> "$GITHUB_ENV"
echo "Draft PR: $PR_URL"
