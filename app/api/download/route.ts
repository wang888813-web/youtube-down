import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import os from "os";
import path from "path";
import { existsSync, unlinkSync } from "fs";
import { readFile } from "fs/promises";

// Increase timeout for large file downloads
export const maxDuration = 300; // 5 minutes

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

  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  const tmpId = `ytdl-${Date.now()}`;
  const outTemplate = path.join(os.tmpdir(), `${tmpId}.%(ext)s`);
  const commonArgs = [
    "--cookies", "/root/yt-cookies.txt",
    "--js-runtimes", "deno",
    "--remote-components", "ejs:github",
    "-o", outTemplate,
    url,
  ];

  const args =
    format === "mp3"
      ? ["-x", "--audio-format", "mp3", "--audio-quality", "0", ...commonArgs]
      : ["-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best", "--merge-output-format", "mp4", ...commonArgs];

  try {
    await runYtDlp(args);

    // Find output file
    const { readdirSync } = await import("fs");
    const files = readdirSync(os.tmpdir()).filter((f) => f.startsWith(tmpId));
    if (!files.length) return NextResponse.json({ error: "Output file not found" }, { status: 500 });

    const filePath = path.join(os.tmpdir(), files[0]);
    const ext = path.extname(files[0]).slice(1);
    const buffer = await readFile(filePath);
    try { unlinkSync(filePath); } catch {}

    const contentType = ext === "mp3" ? "audio/mpeg" : "video/mp4";
    const filename = ext === "mp3" ? "audio.mp3" : "video.mp4";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Download failed";
    console.error("[download]", message);
    return NextResponse.json({ error: "Download failed. The video may be unavailable or restricted." }, { status: 500 });
  }
}
