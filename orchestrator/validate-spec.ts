
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TestSpecificationSchema } from './scenario-schema.js';

const filePath = process.argv[2];

if (!filePath) {
  console.error(
    'Usage: npm run validate:spec -- <file.json>'
  );
  process.exit(1);
}

try {
  const raw = readFileSync(resolve(filePath), 'utf8');
  const data: unknown = JSON.parse(raw);

  const result = TestSpecificationSchema.safeParse(data);

  if (!result.success) {
    console.error('Specification validation failed');

    for (const issue of result.error.issues) {
      console.error(
        `- ${issue.path.join('.')}: ${issue.message}`
      );
    }

    process.exit(1);
  }

  const spec = result.data;
  const mapped = new Set(
    spec.scenarios
      .filter(s => s.source === 'acceptance_criteria')
      .flatMap(s => s.acceptanceCriteria)
  );

  console.log('Specification structure: VALID');
  console.log(`Jira issue: ${spec.jiraKey}`);
  console.log(`Acceptance criteria: ${spec.acceptanceCriteria.length}`);
  console.log(`Scenarios: ${spec.scenarios.length}`);
  console.log(`ACs mapped: ${mapped.size}/${spec.acceptanceCriteria.length}`);
  console.log(`Status: ${spec.status}`);

  if (spec.status === 'blocked') {
    console.error('Specification is blocked from test generation');
    process.exit(2);
  }
} catch (error) {
  console.error('Could not validate specification:', error);
  process.exit(1);
}
