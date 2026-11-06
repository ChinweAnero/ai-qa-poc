
#!/usr/bin/env bash
set -euo pipefail

JIRA_KEY="${1:?Usage: ./scripts/generate-tests.sh QA-1}"

if [[ ! "$JIRA_KEY" =~ ^[A-Z][A-Z0-9]+-[0-9]+$ ]]; then
  echo "Invalid Jira key: $JIRA_KEY"
  exit 1
fi

TEST_FILE="tests/e2e/${JIRA_KEY}.spec.ts"
# Do not accept a test file from a previous run.
rm -f "$TEST_FILE"

SPEC="tests/specifications/${JIRA_KEY}.json"
PLAN="tests/plans/${JIRA_KEY}.md"
BROWSER_PLAN="specs/${JIRA_KEY}.md"
TEST_FILE="tests/e2e/${JIRA_KEY}.spec.ts"

echo "Validating requirements for $JIRA_KEY"

npm run validate:spec -- "$SPEC"

test -f "$PLAN" || {
  echo "Missing requirements plan: $PLAN"
  exit 1
}

mkdir -p specs tests/e2e

echo "Running Planner and Generator agents"

codex exec --approve-for-me \
  "Read agents/test-generator.md and AGENTS.md.

   Use the official Playwright Planner agent
   with $SPEC, $PLAN and tests/e2e/seed.spec.ts.
   Explore SauceDemo using Playwright browser tools.
   Save the browser-verified plan to $BROWSER_PLAN.

   Then use the official Playwright Generator agent
   to implement the plan in $TEST_FILE.

   Preserve Jira scenario IDs and assertions.
   Do not change requirements or skip tests.
   Do not create commits or pull requests."

  if [[ ! -s "$TEST_FILE" ]]; then
    echo "ERROR: No Playwright test file generated"
    exit 1
  fi

npm run typecheck
npx playwright test "$TEST_FILE"

test -s "$BROWSER_PLAN" || {
  echo "Browser plan not generated"
  exit 1
}

test -s "$TEST_FILE" || {
  echo "Test file not generated"
  exit 1
}

echo "Checking TypeScript"
npm run typecheck

echo "Running generated Playwright tests"

if npx playwright test "$TEST_FILE"; then
  echo "Generated tests passed"
else
  echo "Generated tests failed."
  echo "Review the Playwright report and run"
  echo "the Healer agent with failure evidence."
  exit 1
fi

echo "Milestone 3 generation completed"
