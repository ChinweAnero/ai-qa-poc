
#!/usr/bin/env bash
set -euo pipefail

JIRA_KEY="${1:?Usage: ./scripts/analyse-jira.sh QA-1}"

if [[ ! "$JIRA_KEY" =~ ^[A-Z][A-Z0-9]+-[0-9]+$ ]]; then
  echo "Invalid Jira key"
  exit 1
fi

mkdir -p tests/specifications

codex exec --sandbox workspace-write \
  "Read agents/requirements-analyst.md.
   Retrieve Jira issue ${JIRA_KEY} through Atlassian MCP.
   Extract acceptance criteria and generate scenarios.
   Follow orchestrator/scenario-schema.ts.
   Write tests/specifications/${JIRA_KEY}.json.
   Do not generate Playwright tests or modify Jira."

npm run validate:spec -- \
  "tests/specifications/${JIRA_KEY}.json"

npm run generate:plan -- \
  "tests/specifications/${JIRA_KEY}.json"

echo "Analysis completed for ${JIRA_KEY}"
