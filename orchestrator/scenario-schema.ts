
import { z } from 'zod';

const AcceptanceCriterionSchema = z.object({
  id: z.string().regex(/^AC\d+$/),
  description: z.string().min(5),
});

const ScenarioSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(5),
  type: z.enum([
    'positive',
    'negative',
    'boundary',
    'edge',
    'security',
  ]),
  source: z.enum([
    'acceptance_criteria',
    'proposed',
  ]),
  acceptanceCriteria: z.array(z.string()),
  preconditions: z.array(z.string()),
  steps: z.array(z.string()).min(1),
  expectedResult: z.string().min(5),
  priority: z.enum(['high', 'medium', 'low']),
});

export const TestSpecificationSchema = z.object({
  jiraKey: z.string().regex(/^[A-Z][A-Z0-9]+-\d+$/),
  summary: z.string().min(5),
  applicationUrl: z.string().url(),
  acceptanceCriteria: z.array(
    AcceptanceCriterionSchema
  ).min(1),
  scenarios: z.array(ScenarioSchema).min(1),
  ambiguities: z.array(z.string()),
  status: z.enum(['ready', 'blocked']),
}).superRefine((spec, ctx) => {
  const acIds = spec.acceptanceCriteria.map(ac => ac.id);
  const scenarioIds = spec.scenarios.map(s => s.id);

  const addIssue = (message: string) =>
    ctx.addIssue({
      code: 'custom',
      message,
    });

  if (new Set(acIds).size !== acIds.length) {
    addIssue('Duplicate acceptance criterion IDs');
  }

  if (new Set(scenarioIds).size !== scenarioIds.length) {
    addIssue('Duplicate scenario IDs');
  }

  for (const scenario of spec.scenarios) {
    for (const acId of scenario.acceptanceCriteria) {
      if (!acIds.includes(acId)) {
        addIssue(
          `${scenario.id} references unknown ${acId}`
        );
      }
    }

    if (
      scenario.source === 'acceptance_criteria' &&
      scenario.acceptanceCriteria.length === 0
    ) {
      addIssue(
        `${scenario.id} must reference an AC`
      );
    }
  }

  for (const acId of acIds) {
    const covered = spec.scenarios.some(
      scenario =>
        scenario.source === 'acceptance_criteria' &&
        scenario.acceptanceCriteria.includes(acId)
    );

    if (!covered) {
      addIssue(`${acId} has no mapped test scenario`);
    }
  }

  if (spec.status === 'ready' && spec.ambiguities.length) {
    addIssue(
      'Specification cannot be ready with ambiguities'
    );
  }
});

export type TestSpecification = z.infer<
  typeof TestSpecificationSchema
>;
