import { NextRequest, NextResponse } from "next/server";

// Mock transcript data for MVP demo
// In production: use youtube-transcript-api (Python) or a RapidAPI service
function mockTranscript(videoId: string) {
  return {
    title: `YouTube Video (${videoId})`,
    summary:
      "This video covers key concepts and practical insights on the topic. The presenter walks through the main ideas with clear examples, making it easy to understand and apply the knowledge.",
    keyPoints: [
      "Introduction to the core concept and why it matters",
      "Step-by-step breakdown of the main process",
      "Common mistakes to avoid and best practices",
      "Real-world examples and case studies",
      "Next steps and resources for further learning",
    ],
    transcript: [
      { time: "0:00", text: "Welcome to this video. Today we're going to cover something really important." },
      { time: "0:15", text: "Let's start with the basics and build up from there." },
      { time: "0:45", text: "The first key concept you need to understand is this..." },
      { time: "1:20", text: "Here's a practical example that illustrates the point clearly." },
      { time: "2:00", text: "Now let's look at some common mistakes people make." },
      { time: "2:45", text: "The best practice here is to always start with a clear plan." },
      { time: "3:30", text: "Let me show you a real-world case study to make this concrete." },
      { time: "4:15", text: "As you can see, the results speak for themselves." },
      { time: "5:00", text: "To summarize, remember these key takeaways going forward." },
      { time: "5:30", text: "Thanks for watching! Don't forget to like and subscribe." },
    ],
  };
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v") || u.pathname.split("/").pop() || null;
    }
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1);
    }
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  const videoId = extractVideoId(url);
  if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

  // TODO: Replace with real transcript API call
  // e.g. call a Python FastAPI service: await fetch(`${process.env.API_URL}/transcript?id=${videoId}`)
  const data = mockTranscript(videoId);
  return NextResponse.json(data);
}
