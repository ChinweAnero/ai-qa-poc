
#!/usr/bin/env bash
set -euo pipefail

JIRA_KEY="${1:?Usage: ./scripts/analyse-jira.sh SCRUM-3}"

if [[ ! "$JIRA_KEY" =~ ^[A-Z][A-Z0-9]*-[0-9]+$ ]]; then
  echo "Invalid Jira key: $JIRA_KEY"
  exit 1
fi

SPEC_FILE="tests/specifications/${JIRA_KEY}.json"
PLAN_FILE="tests/plans/${JIRA_KEY}.md"

mkdir -p tests/specifications tests/plans

# Prevent stale artifacts being mistaken for a successful run.
rm -f "$SPEC_FILE" "$PLAN_FILE"

codex exec --approve-for-me \
  "Read agents/requirements-analyst.md.
   Retrieve Jira issue ${JIRA_KEY} through Atlassian MCP.
   Extract acceptance criteria and generate scenarios.
   Follow orchestrator/scenario-schema.ts.
   Write ${SPEC_FILE}.
   Do not generate Playwright tests or modify Jira."

if [[ ! -s "$SPEC_FILE" ]]; then
  echo "ERROR: Codex did not generate $SPEC_FILE"
  exit 1
fi

npm run validate:spec -- "$SPEC_FILE"
npm run generate:plan -- "$SPEC_FILE"

if [[ ! -s "$PLAN_FILE" ]]; then
  echo "ERROR: Test plan was not generated: $PLAN_FILE"
  exit 1
fi

echo "Analysis completed for $JIRA_KEY"
