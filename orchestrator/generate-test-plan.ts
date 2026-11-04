
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TestSpecificationSchema } from './scenario-schema.js';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Provide a specification JSON path');
  process.exit(1);
}

const raw = JSON.parse(
  readFileSync(resolve(filePath), 'utf8')
);

const spec = TestSpecificationSchema.parse(raw);

if (spec.status !== 'ready') {
  throw new Error('Specification is blocked');
}

const lines: string[] = [
  `# Test Plan: ${spec.jiraKey}`,
  '',
  `## ${spec.summary}`,
  '',
  `Application: ${spec.applicationUrl}`,
  '',
  '## Acceptance Criteria',
  '',
];

for (const ac of spec.acceptanceCriteria) {
  lines.push(`- **${ac.id}:** ${ac.description}`);
}

lines.push('', '## Test Scenarios', '');

for (const scenario of spec.scenarios) {
  lines.push(
    `### ${scenario.id}: ${scenario.title}`,
    '',
    `- Type: ${scenario.type}`,
    `- Source: ${scenario.source}`,
    `- ACs: ${scenario.acceptanceCriteria.join(', ') || 'None'}`,
    `- Priority: ${scenario.priority}`,
    '',
    '**Preconditions**',
    ...scenario.preconditions.map(p => `- ${p}`),
    '',
    '**Steps**',
    ...scenario.steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    `**Expected result:** ${scenario.expectedResult}`,
    ''
  );
}

const output = resolve(
  `tests/plans/${spec.jiraKey}.md`
);

writeFileSync(output, lines.join('\n'));

console.log(`Test plan generated: ${output}`);
