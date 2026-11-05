
#!/usr/bin/env bash
set -euo pipefail

JIRA_KEY="${1:?Usage: ./scripts/create-ai-pr.sh QA-1}"

if [[ ! "$JIRA_KEY" =~ ^[A-Z][A-Z0-9]+-[0-9]+$ ]]; then
  echo "Invalid Jira key: $JIRA_KEY"
  exit 1
fi

BRANCH="QA-ai-workflow/${JIRA_KEY}"
BASE_BRANCH="main"
SPEC="tests/specifications/${JIRA_KEY}.json"
PLAN="tests/plans/${JIRA_KEY}.md"
BROWSER_PLAN="specs/${JIRA_KEY}.md"
TEST_FILE="tests/e2e/${JIRA_KEY}.spec.ts"

echo "Starting AI QA PR workflow for $JIRA_KEY"

# 1. Check prerequisites
command -v git >/dev/null
command -v gh >/dev/null
command -v codex >/dev/null

gh auth status >/dev/null

# 2. Prevent unrelated changes being committed
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean."
  echo "Commit or stash existing changes first."
  exit 1
fi

# 3. Fetch latest main
git fetch origin "$BASE_BRANCH"

CURRENT_BRANCH="$(git branch --show-current)"

if [[ "$CURRENT_BRANCH" != "$BASE_BRANCH" ]]; then
  echo "Switch to main before running this script."
  exit 1
fi

git pull --ff-only origin "$BASE_BRANCH"

# 4. Validate required input files
test -f "$SPEC" || {
  echo "Missing specification: $SPEC"
  exit 1
}

test -f "$PLAN" || {
  echo "Missing test plan: $PLAN"
  exit 1
}

npm run validate:spec -- "$SPEC"

# 5. Prevent duplicate branches
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "Local branch already exists: $BRANCH"
  exit 1
fi

if git ls-remote --exit-code --heads origin "$BRANCH" \
  >/dev/null; then
  echo "Remote branch already exists: $BRANCH"
  exit 1
fi

# 6. Create feature branch
git switch -c "$BRANCH"

# 7. Run Milestone 3 AI generation
echo "Generating Playwright tests..."

./scripts/generate-tests.sh "$JIRA_KEY"

# 8. Independent local validation
npm run test:unit
npm run typecheck
npm run validate:spec -- "$SPEC"

npx playwright test "$TEST_FILE"

# 9. Check required outputs
test -s "$BROWSER_PLAN"
test -s "$TEST_FILE"

# 10. Reject skipped or focused tests
if grep -nE 'test\.(skip|fixme|only)\(' "$TEST_FILE"; then
  echo "Review required: skipped or focused tests found."
  exit 1
fi

# 11. Stage only expected generated artifacts
git add -- "$SPEC" "$PLAN" "$BROWSER_PLAN" "$TEST_FILE"

if git diff --cached --quiet; then
  echo "No changes generated. No PR created."
  exit 1
fi

# 12. Commit and push
git commit -m \
  "test(${JIRA_KEY}): generate AI Playwright tests"

git push -u origin "$BRANCH"

# 13. Prepare PR description
PR_BODY="$(mktemp)"

cat > "$PR_BODY" <<EOF
## AI-Generated Playwright Tests

**Jira:** ${JIRA_KEY}

### Generated Artifacts
- Specification: \`${SPEC}\`
- Requirements plan: \`${PLAN}\`
- Browser-verified plan: \`${BROWSER_PLAN}\`
- Playwright tests: \`${TEST_FILE}\`

### Local Validation
- Requirements validation: Passed
- Unit tests: Passed
- TypeScript: Passed
- Playwright: Passed

### Review Requirements
- Verify acceptance criteria mapping
- Review selectors and assertions
- Check test independence
- Review CI execution results

Generated using Codex and Playwright Test Agents.

Human approval is required before merging.
EOF

# 14. Create draft PR
gh pr create \
  --base "$BASE_BRANCH" \
  --head "$BRANCH" \
  --title "test(${JIRA_KEY}): AI-generated Playwright tests" \
  --body-file "$PR_BODY" \
  --draft

rm -f "$PR_BODY"

echo "AI QA pull request created successfully."
gh pr view --web
