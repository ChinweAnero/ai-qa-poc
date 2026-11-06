
#!/usr/bin/env bash
set -euo pipefail

JIRA_KEY="${1:?Jira issue key required}"
RESULT="${2:?Result required}"
PR_URL="${3:-}"

if [[ ! "$JIRA_KEY" =~ ^[A-Z][A-Z0-9]*-[0-9]+$ ]]; then
  echo "Invalid Jira key"
  exit 1
fi

case "$RESULT" in
  success|blocked|failed) ;;
  *)
    echo "Invalid result: $RESULT"
    exit 1
    ;;
esac

: "${JIRA_BASE_URL:?Missing JIRA_BASE_URL}"
: "${JIRA_EMAIL:?Missing JIRA_EMAIL}"
: "${JIRA_API_TOKEN:?Missing JIRA_API_TOKEN}"

RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-ChinweAnero/ai-qa-poc}/actions/runs/${GITHUB_RUN_ID:-}"

case "$RESULT" in
  success)
    MESSAGE="AI QA Automation: SUCCESS
Requirements analysed and Playwright tests generated.
Draft PR: ${PR_URL}
Workflow: ${RUN_URL}
Human review is required before merging."
    ;;
  blocked)
    MESSAGE="AI QA Automation: BLOCKED
Requirements need clarification before tests can be generated.
Review the specification and workflow logs.
Workflow: ${RUN_URL}"
    ;;
  failed)
    MESSAGE="AI QA Automation: FAILED
The automation did not complete successfully.
Review the GitHub Actions logs for details.
Workflow: ${RUN_URL}"
    ;;
esac

PAYLOAD=$(jq -n --arg body "$MESSAGE" '{
  body: {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [
          {type: "text", text: $body}
        ]
      }
    ]
  }
}')

curl --fail-with-body --silent --show-error \
  --request POST \
  --url "${JIRA_BASE_URL%/}/rest/api/3/issue/${JIRA_KEY}/comment" \
  --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data "$PAYLOAD"

echo "Jira comment posted for $JIRA_KEY"
