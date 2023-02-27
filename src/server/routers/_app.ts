import { prisma } from './../prisma';
import { z } from 'zod';
import { procedure, router } from '../trpc';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.message}`,
      };
    }),
  addNote: procedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const newNote = await prisma.notes.create({
        data: {
          title: input.title,
          content: input.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
