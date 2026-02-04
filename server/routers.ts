import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createReport } from "./db";
import { sendReportEmail } from "./gmailService";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  reports: router({
    submit: publicProcedure
      .input((data: unknown) => {
        if (typeof data !== 'object' || data === null) throw new Error('Invalid input');
        const obj = data as Record<string, unknown>;
        return {
          reportType: String(obj.reportType),
          promoter: String(obj.promoter),
          visitDate: String(obj.visitDate),
          network: String(obj.network),
          store: String(obj.store),
          leaderName: obj.leaderName ? String(obj.leaderName) : undefined,
          leaderPhone: obj.leaderPhone ? String(obj.leaderPhone) : undefined,
          productsInFreezer: obj.productsInFreezer ? String(obj.productsInFreezer) : undefined,
          freezerProducts: obj.freezerProducts ? String(obj.freezerProducts) : undefined,
          freezerOrganization: obj.freezerOrganization ? String(obj.freezerOrganization) : undefined,
          freezerProblems: obj.freezerProblems ? String(obj.freezerProblems) : undefined,
          productsToasted: obj.productsToasted ? String(obj.productsToasted) : undefined,
          toastedProducts: obj.toastedProducts ? String(obj.toastedProducts) : undefined,
          visualQuality: obj.visualQuality ? String(obj.visualQuality) : undefined,
          exposure: obj.exposure ? String(obj.exposure) : undefined,
          exposureProblems: obj.exposureProblems ? String(obj.exposureProblems) : undefined,
          generalObservations: obj.generalObservations ? String(obj.generalObservations) : undefined,
          mainProblem: obj.mainProblem ? String(obj.mainProblem) : undefined,
          stockDetails: obj.stockDetails ? String(obj.stockDetails) : undefined,
          counterDetails: obj.counterDetails ? String(obj.counterDetails) : undefined,
          actionTaken: obj.actionTaken ? String(obj.actionTaken) : undefined,
          feedback: obj.feedback ? String(obj.feedback) : undefined,
          report: String(obj.report),
        };
      })
      .mutation(async ({ input }) => {
        // For now, use a default userId of 1 (can be updated to use ctx.user.id if authentication is required)
        const result = await createReport({
          userId: 1,
          ...input,
        });

        // Send email asynchronously (don't wait for it)
        const mockReport = {
          id: 0,
          userId: 1,
          reportType: input.reportType,
          promoter: input.promoter,
          visitDate: input.visitDate,
          network: input.network,
          store: input.store,
          leaderName: input.leaderName ?? null,
          leaderPhone: input.leaderPhone ?? null,
          productsInFreezer: input.productsInFreezer ?? null,
          freezerProducts: input.freezerProducts ?? null,
          freezerOrganization: input.freezerOrganization ?? null,
          freezerProblems: input.freezerProblems ?? null,
          productsToasted: input.productsToasted ?? null,
          toastedProducts: input.toastedProducts ?? null,
          visualQuality: input.visualQuality ?? null,
          exposure: input.exposure ?? null,
          exposureProblems: input.exposureProblems ?? null,
          generalObservations: input.generalObservations ?? null,
          mainProblem: input.mainProblem ?? null,
          stockDetails: input.stockDetails ?? null,
          counterDetails: input.counterDetails ?? null,
          actionTaken: input.actionTaken ?? null,
          feedback: input.feedback ?? null,
          report: input.report,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        sendReportEmail(mockReport, process.env.GMAIL_USER || 'edumcorrea11@gmail.com').catch(err => console.error('Failed to send email:', err));

        return { success: true, message: 'Report submitted successfully' };
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
