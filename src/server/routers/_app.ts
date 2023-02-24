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
});

// export type definition of API
export type AppRouter = typeof appRouter;
