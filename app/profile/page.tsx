"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Download, Music, Star, Zap, Shield, Clock, User,
  LogOut, ChevronRight, BarChart2, Film, Loader2
} from "lucide-react";

interface UserData {
  id: number;
  google_id: string;
  email: string;
  name: string;
  picture: string;
  plan: string;
  plan_expires_at: number | null;
  created_at: number;
}

interface UsageToday {
  download_count: number;
  ai_count: number;
}

interface DownloadRecord {
  id: number;
  video_title: string;
  video_url: string;
  thumbnail_url: string;
  quality: string;
  format: string;
  created_at: number;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [usage, setUsage] = useState<UsageToday>({ download_count: 0, ai_count: 0 });
  const [history, setHistory] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/downloader");
      return;
    }

    // 注册/更新用户，然后获取数据
    const init = async () => {
      try {
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            google_id: user.email, // 用 email 作为唯一标识
            email: user.email,
            name: user.name,
            picture: user.picture,
          }),
        });

        const res = await fetch(`/api/user?google_id=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        if (data.user) setUserData(data.user);
        if (data.today_usage) setUsage(data.today_usage);
        setHistory(data.history || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, router]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  const isPro = userData?.plan === "pro";
  const downloadLimit = isPro ? "Unlimited" : "5 / day";
  const downloadUsed = usage.download_count;
  const downloadMax = isPro ? null : 5;

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* 用户信息卡片 */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center gap-5">
          {user.picture ? (
            <Image src={user.picture} alt={user.name} width={72} height={72} className="rounded-full border-2 border-red-500" />
          ) : (
            <div className="w-18 h-18 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{user.name}</h1>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {isPro ? (
                <span className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full font-semibold">
                  <Star className="w-3 h-3" /> Pro
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-gray-700 text-gray-400 px-2.5 py-1 rounded-full">
                  <Shield className="w-3 h-3" /> Free
                </span>
              )}
              {userData?.created_at && (
                <span className="text-xs text-gray-500">
                  Joined {new Date(userData.created_at * 1000).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/downloader"); }}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-2 rounded-xl hover:bg-gray-800 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>

        {/* 今日使用量 */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" /> Today&apos;s Usage
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-400">Downloads</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {downloadUsed}
                {downloadMax && <span className="text-sm text-gray-500 font-normal"> / {downloadMax}</span>}
              </div>
              {downloadMax && (
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (downloadUsed / downloadMax) * 100)}%` }}
                  />
                </div>
              )}
              {!downloadMax && <p className="text-xs text-green-400 mt-1">Unlimited</p>}
            </div>
            <div className="bg-gray-800/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">AI Uses</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {usage.ai_count}
                {!isPro && <span className="text-sm text-gray-500 font-normal"> / 3</span>}
              </div>
              {!isPro && (
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (usage.ai_count / 3) * 100)}%` }}
                  />
                </div>
              )}
              {isPro && <p className="text-xs text-green-400 mt-1">Unlimited</p>}
            </div>
          </div>
        </div>

        {/* 升级 Pro 横幅（仅 Free 用户显示） */}
        {!isPro && (
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/20 rounded-3xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">Upgrade to Pro</p>
              <p className="text-gray-400 text-xs">Unlimited downloads, 4K quality, unlimited AI</p>
            </div>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap shadow-lg shadow-red-600/20"
            >
              <Star className="w-3.5 h-3.5" /> Upgrade
            </Link>
          </div>
        )}

        {/* 下载历史 */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Download History
          </h2>
          {history.length === 0 ? (
            <div className="text-center py-10">
              <Film className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No downloads yet</p>
              <Link href="/downloader" className="text-red-400 text-sm hover:text-red-300 mt-1 inline-block">
                Start downloading →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <a
                  key={item.id}
                  href={item.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-all group"
                >
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt="" className="w-16 h-10 object-cover rounded-lg shrink-0" />
                  ) : (
                    <div className="w-16 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                      <Film className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate font-medium group-hover:text-red-400 transition-colors">
                      {item.video_title || "Unknown Title"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.quality && (
                        <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                          {item.quality}
                        </span>
                      )}
                      {item.format && (
                        <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded uppercase">
                          {item.format}
                        </span>
                      )}
                      <span className="text-xs text-gray-600">
                        {new Date(item.created_at * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
