
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { TestSpecificationSchema } from '../orchestrator/scenario-schema.js';

const validSpec = {
  jiraKey: 'QA-1',
  summary: 'Validate SauceDemo login',
  applicationUrl: 'https://www.saucedemo.com',

  acceptanceCriteria: [
    {
      id: 'AC1',
      description: 'User can log in',
    },
  ],

  scenarios: [
    {
      id: 'QA-1-TC01',
      title: 'Successful user login',
      type: 'positive',
      source: 'acceptance_criteria',
      acceptanceCriteria: ['AC1'],
      preconditions: ['Login page is open'],
      steps: ['Enter credentials', 'Click Login'],
      expectedResult: 'Inventory page appears',
      priority: 'high',
    },
  ],

  ambiguities: [] as string[],
  status: 'ready',
};

// Test 1: Valid specification
test('accepts a valid specification', () => {
  const result = TestSpecificationSchema.safeParse(validSpec);

  assert.equal(result.success, true);
});

// Test 2: Invalid acceptance criterion reference
test('rejects unknown acceptance criteria', () => {
  const invalid = structuredClone(validSpec);

  invalid.scenarios[0].acceptanceCriteria = ['AC99'];

  const result = TestSpecificationSchema.safeParse(invalid);

  assert.equal(result.success, false);
});

// Test 3: Duplicate scenario IDs
test('rejects duplicate scenario IDs', () => {
  const invalid = structuredClone(validSpec);

  invalid.scenarios.push({
    ...invalid.scenarios[0],
  });

  const result = TestSpecificationSchema.safeParse(invalid);

  assert.equal(result.success, false);
});

// Test 4: Missing acceptance criteria coverage
test('rejects uncovered acceptance criteria', () => {
  const invalid = structuredClone(validSpec);

  invalid.acceptanceCriteria.push({
    id: 'AC2',
    description: 'Invalid login displays an error',
  });

  const result = TestSpecificationSchema.safeParse(invalid);

  assert.equal(result.success, false);
});

// Test 5: Ambiguous requirements cannot be ready
test('rejects ready specifications with ambiguities', () => {
  const invalid = structuredClone(validSpec);

  invalid.ambiguities.push(
    'Expected error message is not specified'
  );

  const result = TestSpecificationSchema.safeParse(invalid);

  assert.equal(result.success, false);
});
