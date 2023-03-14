import { prisma } from './../prisma';
import { z } from 'zod';
import { procedure, router } from '../trpc';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
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

      return newNote;
    }),
  allNotes: procedure.query(async () => {
    const notes = await prisma.notes.findMany();
    return notes;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
