const { z } = require('zod');

const importThemeSchema = z.object({
  name: z.string().min(1),
  missions: z
    .array(
      z.object({
        title: z.string().min(1),
        subTitle: z.string().optional(),
        image: z.string().optional(),
        status: z.string().optional(),
        order: z.number().int().optional(),
        subMissions: z
          .array(
            z.object({
              order: z.number().int(),
              title: z.string().min(1),
              objective: z.string().optional(),
              target: z.string().optional(),
              difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
              status: z.string().optional(),
              image: z.string().optional(),
              associatedChallengeId: z.string().uuid(),
              narration: z
                .object({
                  roleTitle: z.string().optional(),
                  roleBrief: z.string().optional(),
                  narrationText: z.string().optional(),
                  context: z.string().optional(),
                  target: z.string().optional(),
                  hints: z
                    .array(
                      z.object({
                        order: z.number().int(),
                        message: z.string().min(1),
                      }),
                    )
                    .optional(),
                })
                .optional(),
            }),
          )
          .default([]),
      }),
    )
    .default([]),
});

function validateImportPayload(body) {
  return importThemeSchema.parse(body);
}

module.exports = { validateImportPayload };
