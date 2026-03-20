"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Download, Star, Zap, Shield, Clock, User,
  LogOut, ChevronRight, BarChart2, Film, Loader2,
  Copy, Check, Users, Gift, Crown, TrendingUp
} from "lucide-react";

interface UserData {
  id: number;
  google_id: string;
  email: string;
  name: string;
  picture: string;
  plan: string;
  plan_expires_at: number | null;
  referral_code: string;
  monthly_download_count: number;
  monthly_ai_count: number;
  created_at: number;
}

interface Limits {
  monthly_downloads: number;
  monthly_ai: number;
  max_quality: string;
  remove_ads: boolean;
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

interface ReferralRecord {
  id: number;
  referee_name: string;
  referee_email: string;
  referee_picture: string;
  status: string;
  reward_days: number;
  created_at: number;
  sub_plan: string | null;
  billing_cycle: string | null;
}

interface ReferralData {
  referral_code: string;
  referral_url: string;
  stats: { total: number; converted: number; totalRewardDays: number };
  referrals: ReferralRecord[];
}

type Tab = "overview" | "history" | "referrals";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [limits, setLimits] = useState<Limits>({ monthly_downloads: 30, monthly_ai: 10, max_quality: "720p", remove_ads: false });
  const [history, setHistory] = useState<DownloadRecord[]>([]);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/downloader"); return; }

    const init = async () => {
      try {
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ google_id: user.email, email: user.email, name: user.name, picture: user.picture }),
        });
        const res = await fetch(`/api/user?google_id=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        if (data.user) setUserData(data.user);
        if (data.limits) setLimits(data.limits);
        setHistory(data.history || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    init();
  }, [user, router]);

  useEffect(() => {
    if (tab === "referrals" && user && !referralData) {
      fetch(`/api/referral?google_id=${encodeURIComponent(user.email)}`)
        .then(r => r.json()).then(setReferralData).catch(console.error);
    }
  }, [tab, user, referralData]);

  if (!user) return null;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <Loader2 className="w-8 h-8 animate-spin text-red-500" />
    </div>
  );

  const isPro = userData?.plan === "pro" || userData?.plan === "unlimited";
  const isUnlimited = userData?.plan === "unlimited";
  const planLabel = isUnlimited ? "Unlimited" : isPro ? "Pro" : "Free";
  const dlUsed = userData?.monthly_download_count || 0;
  const dlMax = limits.monthly_downloads;
  const aiUsed = userData?.monthly_ai_count || 0;
  const aiMax = limits.monthly_ai;

  const copyLink = () => {
    if (!referralData) return;
    navigator.clipboard.writeText(referralData.referral_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* 用户卡片 */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center gap-4">
          {user.picture ? (
            <Image src={user.picture} alt={user.name} width={64} height={64} className="rounded-full border-2 border-red-500 shrink-0" />
          ) : (
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">{user.name}</h1>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {isUnlimited ? (
                <span className="flex items-center gap-1 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                  <Crown className="w-3 h-3" /> Unlimited
                </span>
              ) : isPro ? (
                <span className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                  <Star className="w-3 h-3" /> Pro
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-gray-700 text-gray-400 px-2.5 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" /> Free
                </span>
              )}
              {userData?.plan_expires_at && (
                <span className="text-xs text-gray-500">
                  到期 {new Date(userData.plan_expires_at * 1000).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/downloader"); }}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-2 rounded-xl hover:bg-gray-800 transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Tab 导航 */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-2xl p-1">
          {([
            { id: "overview", label: "概览", icon: BarChart2 },
            { id: "history",  label: "下载记录", icon: Clock },
            { id: "referrals", label: "推荐计划", icon: Users },
          ] as { id: Tab; label: string; icon: any }[]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-xl transition-all font-medium ${
                tab === t.id ? "bg-red-600 text-white shadow" : "text-gray-400 hover:text-white"
              }`}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* 概览 Tab */}
        {tab === "overview" && (
          <>
            {/* 月度用量 */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">本月用量</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/60 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-gray-400">下载次数</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {dlUsed}
                    {dlMax !== -1 && <span className="text-sm text-gray-500 font-normal"> / {dlMax}</span>}
                  </div>
                  {dlMax !== -1 ? (
                    <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (dlUsed / dlMax) * 100)}%` }} />
                    </div>
                  ) : <p className="text-xs text-green-400 mt-1">无限制</p>}
                </div>
                <div className="bg-gray-800/60 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400">AI 使用</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {aiUsed}
                    {aiMax !== -1 && <span className="text-sm text-gray-500 font-normal"> / {aiMax}</span>}
                  </div>
                  {aiMax !== -1 ? (
                    <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (aiUsed / aiMax) * 100)}%` }} />
                    </div>
                  ) : <p className="text-xs text-green-400 mt-1">无限制</p>}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">最高画质</span>
                  <span className="text-white font-semibold">{limits.max_quality}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">去广告</span>
                  <span className={limits.remove_ads ? "text-green-400 font-semibold" : "text-gray-500"}>
                    {limits.remove_ads ? "✓ 已开启" : "✗ 未开启"}
                  </span>
                </div>
              </div>
            </div>

            {/* 升级横幅 */}
            {!isPro && (
              <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/20 rounded-3xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">升级到 Pro</p>
                  <p className="text-gray-400 text-xs">每月 500 次下载 · 4K 画质 · 无广告 · $9.9/月</p>
                </div>
                <Link href="/pricing"
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap shadow-lg shadow-red-600/20">
                  <Star className="w-3.5 h-3.5" /> 立即升级
                </Link>
              </div>
            )}
          </>
        )}

        {/* 下载记录 Tab */}
        {tab === "history" && (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">最近 20 条下载记录</h2>
            {history.length === 0 ? (
              <div className="text-center py-10">
                <Film className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">暂无下载记录</p>
                <Link href="/downloader" className="text-red-400 text-sm hover:text-red-300 mt-1 inline-block">开始下载 →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map(item => (
                  <a key={item.id} href={item.video_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-all group">
                    {item.thumbnail_url ? (
                      <img src={item.thumbnail_url} alt="" className="w-16 h-10 object-cover rounded-lg shrink-0" />
                    ) : (
                      <div className="w-16 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        <Film className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate font-medium group-hover:text-red-400 transition-colors">
                        {item.video_title || "未知标题"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {item.quality && <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{item.quality}</span>}
                        {item.format && <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded uppercase">{item.format}</span>}
                        <span className="text-xs text-gray-600">{new Date(item.created_at * 1000).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 推荐计划 Tab */}
        {tab === "referrals" && (
          <>
            {/* 推荐链接 */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">你的专属推荐���接</h2>
              <p className="text-gray-500 text-xs mb-4">好友注册送你 1 天 Pro · 好友付费后再送 15 天 Pro</p>
              {referralData ? (
                <>
                  <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 mb-3">
                    <span className="text-gray-300 text-sm flex-1 truncate">{referralData.referral_url}</span>
                    <button onClick={copyLink}
                      className="flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-all shrink-0 font-medium">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "已复制" : "复制"}
                    </button>
                  </div>
                  {/* 统计卡片 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-800/60 rounded-2xl p-3 text-center">
                      <p className="text-2xl font-bold text-white">{referralData.stats.total}</p>
                      <p className="text-xs text-gray-400 mt-0.5">已推荐</p>
                    </div>
                    <div className="bg-gray-800/60 rounded-2xl p-3 text-center">
                      <p className="text-2xl font-bold text-green-400">{referralData.stats.converted}</p>
                      <p className="text-xs text-gray-400 mt-0.5">已付费</p>
                    </div>
                    <div className="bg-gray-800/60 rounded-2xl p-3 text-center">
                      <p className="text-2xl font-bold text-yellow-400">{referralData.stats.totalRewardDays}</p>
                      <p className="text-xs text-gray-400 mt-0.5">获得天数</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                </div>
              )}
            </div>

            {/* 推荐规则 */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">奖励规则</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">好友注册</p>
                    <p className="text-gray-400 text-xs mt-0.5">好友通过你的链接注册后，你立即获得 <span className="text-yellow-400 font-semibold">1 天 Pro</span> 体验</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">好友付费</p>
                    <p className="text-gray-400 text-xs mt-0.5">好友订阅任意付费套餐后，再额外奖励你 <span className="text-yellow-400 font-semibold">15 天 Pro</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Gift className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">无上限累积</p>
                    <p className="text-gray-400 text-xs mt-0.5">推荐越多，获得越多，Pro 天数叠加计算，永不清零</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 推荐列表 */}
            {referralData && referralData.referrals.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">推荐详情</h2>
                <div className="space-y-3">
                  {referralData.referrals.map(r => (
                    <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-xl">
                      {r.referee_picture ? (
                        <img src={r.referee_picture} alt="" className="w-9 h-9 rounded-full shrink-0" />
                      ) : (
                        <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{r.referee_name}</p>
                        <p className="text-gray-500 text-xs truncate">{r.referee_email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          r.status === "converted" ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {r.status === "converted" ? "已付费" : "已注册"}
                        </span>
                        {r.sub_plan && (
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">{r.sub_plan} · {r.billing_cycle}</p>
                        )}
                        <p className="text-xs text-yellow-500 mt-0.5">+{r.reward_days}天</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
