import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import os from "os";
import path from "path";
import { existsSync, unlinkSync, readdirSync } from "fs";

export const maxDuration = 300;

// In-memory job store (resets on server restart, fine for MVP)
const jobs = new Map<string, { status: "pending" | "done" | "error"; file?: string; ext?: string; error?: string; createdAt: number }>();

// Clean up stale /tmp/ytdl-* files older than 30 minutes every 10 minutes
setInterval(() => {
  const now = Date.now();
  try {
    const files = readdirSync(os.tmpdir()).filter((f) => f.startsWith("ytdl-"));
    for (const f of files) {
      const fp = path.join(os.tmpdir(), f);
      try {
        const { mtimeMs } = require("fs").statSync(fp);
        if (now - mtimeMs > 30 * 60 * 1000) unlinkSync(fp);
      } catch {}
    }
  } catch {}
  // Also clean stale jobs from memory
  for (const [id, job] of jobs.entries()) {
    if (now - job.createdAt > 30 * 60 * 1000) jobs.delete(id);
  }
}, 10 * 60 * 1000);

function runYtDlp(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", args, {
      env: { ...process.env, PATH: `${process.env.PATH}:/root/.deno/bin` },
      timeout: 240000,
    });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.slice(-500)));
    });
  });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const format = req.nextUrl.searchParams.get("format") || "mp4";
  const jobId = req.nextUrl.searchParams.get("job");

  // Poll job status
  if (jobId) {
    const job = jobs.get(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    if (job.status === "pending") return NextResponse.json({ status: "pending" });

    if (job.status === "error") {
      jobs.delete(jobId);
      return NextResponse.json({ status: "error", error: job.error });
    }

    // Done — stream file directly (same origin, no Cloudflare timeout)
    if (job.status === "done" && job.file && existsSync(job.file)) {
      const { readFile } = await import("fs/promises");
      const buffer = await readFile(job.file);
      try { unlinkSync(job.file); } catch {}
      jobs.delete(jobId);

      const contentType = job.ext === "mp3" ? "audio/mpeg" : "video/mp4";
      const filename = job.ext === "mp3" ? "audio.mp3" : "video.mp4";
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    return NextResponse.json({ error: "File not found" }, { status: 500 });
  }

  // Start new job
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  const newJobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const tmpId = `ytdl-${newJobId}`;
  const outTemplate = path.join(os.tmpdir(), `${tmpId}.%(ext)s`);

  const commonArgs = [
    "--cookies", "/root/yt-cookies.txt",
    "--js-runtimes", "deno",
    "--remote-components", "ejs:github",
    "--concurrent-fragments", "8",
    "--no-part",
    "-o", outTemplate,
    url,
  ];

  const args =
    format === "mp3"
      ? ["-x", "--audio-format", "mp3", "--audio-quality", "0", ...commonArgs]
      : ["-f", "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best", "--merge-output-format", "mp4", ...commonArgs];

  jobs.set(newJobId, { status: "pending", createdAt: Date.now() });

  // Run in background
  runYtDlp(args).then(() => {
    const files = readdirSync(os.tmpdir()).filter((f) => f.startsWith(tmpId));
    if (files.length) {
      const filePath = path.join(os.tmpdir(), files[0]);
      const ext = path.extname(files[0]).slice(1);
      jobs.set(newJobId, { status: "done", file: filePath, ext, createdAt: Date.now() });
    } else {
      jobs.set(newJobId, { status: "error", error: "Output file not found", createdAt: Date.now() });
    }
  }).catch((err) => {
    jobs.set(newJobId, { status: "error", error: err.message, createdAt: Date.now() });
  });

  return NextResponse.json({ jobId: newJobId });
}
