import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureSchema, saveRun } from "@/lib/db";
import { newRun, runPipeline } from "@/lib/agents/orchestrator";

export const runtime = "nodejs";
export const maxDuration = 300; // allow long agent runs on Vercel

const BriefSchema = z.object({
  category: z.string().min(1),
  audience: z.string().min(1),
  style: z.string().min(1),
  budgetMin: z.number().nonnegative(),
  budgetMax: z.number().positive(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await req.json();
    const brief = BriefSchema.parse(body);
    const run = newRun(brief);
    await saveRun(run);

    // Run the pipeline to completion within this request (Vercel honors
    // maxDuration). Intermediate steps are persisted as it goes, so a separate
    // poll of GET /api/runs/[id] shows live progress while this resolves.
    await runPipeline(run);

    return NextResponse.json({ id: run.id, mode: run.mode, status: run.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "bad request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
