# AI Driven QA AUTOMATION WORKFLOW
An Event-driven AI-assisted workflow design to automate requirements analysis, Playwright test generation, and GitHub pull-request creation. 
This is a proof of concept. It connects Jira Cloud → GitHub Actions → OpenAI Codex + Atlassian MCP → Playwright → draft GitHub pull request → Jira feedback. It explores how an SDET can use AI agents to convert testable acceptance criteria into reviewed, executable end-to-end tests while retaining validation gates and human oversight.

It uses a self-hosted Github Runner on masOS.

## Purpose
This repository is an AI Quality Engineering proof of concept, not a replacement for human effort in test design or code review. Its aim is to demonstrate a traceable, event-driven workflow in which AI accelerates requirements analysis and test generation while deterministic checks and human review retain control over quality.

## Architecture

flowchart TD
    A[Jira Cloud story] -->|Transition: Ready for Automation| B[Jira Automation webhook]
    B -->|repository_dispatch| C[GitHub Actions: AI Test Generation]
    C --> D[Self-hosted macOS ARM64 runner]
    D --> E[Codex requirements analyst]
    E <-->|Atlassian MCP| A
    E --> F[Validated JSON specification]
    F --> G[Markdown test plan]
    G --> H[Codex + Playwright Planner / Generator]
    H --> I[TypeScript Playwright tests]
    I --> J{Validation and tests pass?}
    J -->|No| K[Report blocked / failed]
    J -->|Yes| L[Upload generated artifacts]
    L --> M[GitHub Actions: create-pr]
    M --> N[Draft pull request]
    N --> O[Independent Playwright CI]
    O --> P[Human review]
    K --> Q[Jira feedback]
    M --> Q

## Design Decisions
    _ Generate tests only when the Jira specification is valid and marked ready.
    _ Agents must not invent missing acceptance criteria or silently alter expected behaviour.
    _ Browser-grounded tests: Use the Playwright Planner and Generator to check application behaviour before finalising tests
    _ Still requires Human intervention: Generated code is submitted as a draft PR, to be reviewed before being merged.
    _ Separation of duties: Test creation is seperated from PR generation pipeline, such that one finishes before the other. 
    _ Traceability: Links Jira acceptance criteria, generated scenarios, tests, workflow runs, and PRs.

## Technology Stack
    | Jira Cloud + Jira Automation | Requirements source of truth also used to trigger events
    | Atlassian MCP | Jira access from Codex |
    | OpenAI Codex CLI | Requirements analysis and agent orchestration |
    | Playwright Planner / Generator | Browser-informed test planning and generation |
    | TypeScript + Playwright Test | Executable end-to-end tests |
    | Zod + `tsx` | Specification schema and validation |
    | GitHub Actions | Orchestration, CI and artifact transfer |
    | Self-hosted macOS ARM64 runner | Runs Codex, MCP and browser automation |
    | GitHub App | Scoped credentials for automated branch/PR creation |
    | Jira REST API | Automation outcome comments |
    | GitHub CLI (`gh`) | Pull-request operations and workflow inspection |

## System under Test
 | https://www.saucedemo.com/

# Prerequisites
    - macOS runner host (Apple Silicon in this POC), connected to the internet.
    - Node.js and npm compatible with the repository's package.json.
    - Git and GitHub CLI.
    - Codex CLI installed and authenticated.
    - Atlassian MCP configured in Codex with access to the relevant Jira Cloud site.
    - GitHub repository permissions to configure Actions, secrets, webhooks and a self-hosted runner.
    - Optional: GitHub App installed on this repository for automated PR creation and normal PR-triggered CI.

### Install project dependencies and browser (chromium used)
    npm ci
    npx playwright install chromium
    
### Codex and Atlassian MCP authentication
    codex login
    codex login status
    codex mcp list
    codex mcp login atlassian

### If the Atlassian OAuth refresh token becomes invalid:
    codex mcp logout atlassian
    codex mcp login atlassian

### Verify actual Jira access, not just the MCP registration:
    codex exec --approve-for-me \
    "Retrieve Jira ticket (ticket issue here) using Atlassian MCP and report its summary. Do not modify files."

## Configuration
    GitHub Actions secrets
    Configure under Repository → Settings → Secrets and variables → Actions.

    | Secret | Purpose | Required when |
    |---|---|---|
    | `SAUCEDEMO_PASSWORD` | Existing valid SauceDemo test password | Running authentication scenarios such as `SCRUM-6` |
    | `AI_QA_APP_PRIVATE_KEY` | GitHub App private key | Publishing PRs with a GitHub App |
    | `AI_QA_APP_ID` or App Client ID | Identifies the GitHub App; match the action version/input | Publishing PRs with a GitHub App |
    | `JIRA_BASE_URL` | Jira Cloud site URL | Posting Jira results |
    | `JIRA_EMAIL` | Jira API account email | Basic-auth Jira reporting |
    | `JIRA_API_TOKEN` | Jira API token | Posting Jira results |

## Environment Variables
    - env: SAUCEDEMO_PASSWORD: ${{ secrets.SAUCEDEMO_PASSWORD }}

## Self-hosted Workflow
    The worflow uses labels equivalent to:
    - runs-on: [self-hosted, macOS, ai-qa-generation]

    To Start the runner from the installation directory:
    - ./run.sh

## Running the Event Driven Workflow
    1. Create a Jira story with clear, independently testable acceptance criteria.
    2. Transition from TO DO to IN PROGRESS.
    3. Jira Automation sends a repository_dispatch event to GitHub.
    4. GitHub Actions schedules the AI generation job on the self-hosted runner.
    5. Codex retrieves the Jira issue via Atlassian MCP, produces a specification and generates a plan.
    6. The Planner/Generator creates Playwright tests; typechecking and test execution must pass.
    7. The generation job uploads artifacts for a separate publishing job.
    8. The publishing job opens a draft PR using a scoped GitHub App token.
    9. Independent Playwright CI validates the PR.
    10. Jira receives a success, blocked or failure report, with links where available.

 ## Jira Automation dispatch payload
 Configure a Send web request action to POST to:
    https://api.github.com/repos/ChinweAnero/ai-qa-poc/dispatches

 - Body: 
    ...
    {
    "event_type": "jira_ready_for_automation",
    "client_payload": {
        "issue_key": "{{issue.key}}"
    }
    }
    ...
    Use a suitably scoped GitHub credential in Jira Automation's hidden Authorization header. 

## Manual workflow trigger
   ...
   gh workflow run ai-test-generation.yml -f issue_key=(your Jira issue key)
    gh run list --workflow ai-test-generation.yml --limit 5
    gh run watch 
    ...

    Should be tested on the main branch. 

## Pull requests and independent CI
    The publishing job should:
    - Download only the artifacts for the current Jira issue.
    - Validate expected filenames and file contents before publishing.
    - Avoid overwriting existing branches or creating duplicate PRs.
    - Commit only the expected specification, plan and test file.
    - Open a draft PR for human review.

## Running Locally
    1. Analyse a Jira story:
        ...
        ./scripts/analyse-jira.sh (jira-issue-issue-key)
        ...
        Expected outputs:
        - tests/specifications/jira-issue-key.json
        - tests/plans/jira-issue-key.md
    2. Validate a specification
        ...
        npm run validate:spec -- tests/specifications/jira-issue-key.json
        ...
    3. Generate Playwright tests (after the specification is marked 'Ready')
        ...
        ./scripts/generate-tests.sh jira-issue-key
        ...
        Expected output:
        tests/e2e/jira-issue-key.spec.ts
    4. Run checks
        npm run typecheck
        npx playwright test tests/e2e/jira-issue-key.spec.ts

    - For login scenarios requiring the SauceDemo test credential, enter it without writing it to shell history:
    ...
    read -rs SAUCEDEMO_PASSWORD
    export SAUCEDEMO_PASSWORD
    echo
    npx playwright test tests/e2e/SCRUM-6.spec.ts
    unset SAUCEDEMO_PASSWORD
    ...
    
 