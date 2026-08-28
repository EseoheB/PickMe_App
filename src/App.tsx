import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "signup"
  | "profile-setup"
  | "profession-select"
  | "feed"
  | "user-profile"
  | "picked"
  | "vault"
  | "settings";

// ─── Circuit Board SVG Background ─────────────────────────────────────────────
function CircuitBg({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.5" fill="#4DA6D6" />
          <circle cx="40" cy="4" r="2.5" fill="#4DA6D6" />
          <circle cx="76" cy="4" r="2.5" fill="#4DA6D6" />
          <circle cx="4" cy="40" r="2.5" fill="#4DA6D6" />
          <circle cx="40" cy="40" r="4" fill="none" stroke="#4DA6D6" strokeWidth="1.5" />
          <circle cx="76" cy="40" r="2.5" fill="#4DA6D6" />
          <circle cx="4" cy="76" r="2.5" fill="#4DA6D6" />
          <circle cx="40" cy="76" r="2.5" fill="#4DA6D6" />
          <circle cx="76" cy="76" r="2.5" fill="#4DA6D6" />
          <line x1="4" y1="4" x2="40" y2="4" stroke="#4DA6D6" strokeWidth="1" />
          <line x1="4" y1="4" x2="4" y2="40" stroke="#4DA6D6" strokeWidth="1" />
          <line x1="40" y1="4" x2="40" y2="40" stroke="#4DA6D6" strokeWidth="1" />
          <line x1="76" y1="4" x2="76" y2="40" stroke="#4DA6D6" strokeWidth="1" />
          <line x1="40" y1="40" x2="76" y2="40" stroke="#4DA6D6" strokeWidth="1" />
          <line x1="4" y1="76" x2="40" y2="76" stroke="#4DA6D6" strokeWidth="1" />
          <line x1="76" y1="40" x2="76" y2="76" stroke="#4DA6D6" strokeWidth="1" />
          <rect x="36" y="36" width="8" height="8" fill="none" stroke="#4DA6D6" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}

// ─── Profession Badges ─────────────────────────────────────────────────────────
const PROFESSIONS = [
  { id: "actor", label: "Actor", color: "#E91E8C", icon: "🎭" },
  { id: "musician", label: "Musician", color: "#C8A455", icon: "🎵" },
  { id: "software-engineer", label: "Software engineer", color: "#C2185B", icon: "⚙️" },
  { id: "cinematographer", label: "Cinematographer", color: "#A0813C", icon: "🎬" },
  { id: "director", label: "Movie Director", color: "#7B1FA2", icon: "🎥" },
  { id: "gaffer", label: "Gaffer", color: "#455A64", icon: "💡" },
  { id: "camera-man", label: "Camera Man", color: "#1565C0", icon: "📷" },
  { id: "music-producer", label: "Music Producer", color: "#558B2F", icon: "🎧" },
  { id: "dop", label: "Director of Photography", color: "#4E342E", icon: "🏆" },
];

function ProfBadge({
  prof,
  active,
  small,
  onClick,
}: {
  prof: (typeof PROFESSIONS)[0];
  active?: boolean;
  small?: boolean;
  onClick?: () => void;
}) {
  const sz = small ? "w-14 h-14 text-2xl" : "w-20 h-20 text-4xl";
  const lbl = small ? "text-[10px]" : "text-xs";
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div
        className={`${sz} rounded-2xl flex items-center justify-center shadow-md transition-all`}
        style={{
          background: prof.color,
          boxShadow: active
            ? `0 0 0 3px white, 0 0 0 5px ${prof.color}`
            : undefined,
          filter: active ? "brightness(1.1)" : undefined,
        }}
      >
        <span style={{ fontSize: small ? "22px" : "34px" }}>{prof.icon}</span>
      </div>
      <span
        className={`${lbl} font-medium text-center leading-tight text-gray-700`}
        style={{ maxWidth: small ? 56 : 76 }}
      >
        {prof.label}
      </span>
      {!small && (
        <span className="text-[10px] text-gray-400">0 cards</span>
      )}
    </button>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ screen, goto }: { screen: Screen; goto: (s: Screen) => void }) {
  const tabs = [
    { id: "feed", icon: "🏠", label: "Feed" },
    { id: "vault", icon: "🗄️", label: "Vault" },
    { id: "picked", icon: "📹", label: "Picked" },
    { id: "user-profile", icon: "👤", label: "Profile" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ] as const;
  return (
    <div className="flex border-t border-gray-200 bg-white/90 backdrop-blur-sm">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => goto(t.id as Screen)}
          className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-all ${
            screen === t.id ? "text-[#E91E8C]" : "text-gray-400"
          }`}
        >
          <span className="text-xl">{t.icon}</span>
          <span className="text-[10px] font-medium">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({
  img,
  name,
  avatar,
  profession,
  profColor,
  liked,
  onLike,
  onProfile,
  comments = 50,
}: {
  img: string;
  name: string;
  avatar: string;
  profession: string;
  profColor: string;
  liked: boolean;
  onLike: () => void;
  onProfile: () => void;
  comments?: number;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  return (
    <div className="relative bg-[#EBE7E2] rounded-2xl overflow-hidden shadow-sm mb-4">
      {/* Post image */}
      <div className="relative h-72 overflow-hidden bg-gray-300">
        <img src={img} alt={name} className="w-full h-full object-cover" />
        {/* Circuit overlay */}
        <div className="absolute inset-0">
          <CircuitBg opacity={0.12} />
        </div>
      </div>

      {/* Action bar */}
      <div className="relative px-3 py-2">
        <CircuitBg opacity={0.1} />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onLike} className="transition-transform active:scale-90">
              <span className="text-2xl">{liked ? "❤️" : "🤍"}</span>
            </button>
            <button
              onClick={() => setShared((s) => !s)}
              className={`transition-transform active:scale-90 ${shared ? "opacity-100" : "opacity-60"}`}
            >
              <span className="text-xl">🔗</span>
            </button>
            <button className="relative transition-transform active:scale-90">
              <span className="text-xl">💬</span>
              <span className="absolute -top-1 -right-2 bg-gray-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {comments}
              </span>
            </button>
          </div>
          <button
            onClick={() => setBookmarked((b) => !b)}
            className="transition-transform active:scale-90"
          >
            <span className="text-xl">{bookmarked ? "🔖" : "🔖"}</span>
          </button>
        </div>

        {/* Author row */}
        <div className="relative flex items-center gap-2 mt-2">
          <button onClick={onProfile}>
            <img
              src={avatar}
              alt={name}
              className="w-8 h-8 rounded-full object-cover border-2"
              style={{ borderColor: profColor }}
            />
          </button>
          <button
            onClick={onProfile}
            className="text-sm font-medium text-gray-800"
            style={{ fontFamily: "'Dancing Script', cursive", fontSize: 16 }}
          >
            {name}
          </button>
          <span
            className="ml-auto text-[10px] font-semibold text-white px-2 py-0.5 rounded-full"
            style={{ background: profColor }}
          >
            {profession}
          </span>
        </div>

        {/* Comment input */}
        <div className="relative flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format" alt="me" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 bg-white/60 rounded-full px-3 py-1 text-xs text-gray-400 border border-gray-200">
            Write a comment...
          </div>
          <button className="text-xs font-semibold text-[#E91E8C]">Send</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function SignupScreen({ goto }: { goto: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="flex flex-col min-h-full bg-[#F0EDE8] relative overflow-hidden">
      <CircuitBg opacity={0.12} />
      <div className="relative flex flex-col flex-1 px-6 pt-16 pb-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 rounded-3xl bg-[#E91E8C] flex items-center justify-center shadow-xl mb-4">
            <span className="text-5xl">✋</span>
          </div>
          <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 42, color: "#1a1a2e", lineHeight: 1 }}>
            PickMe
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-light tracking-wide">Discover. Connect. Get Picked.</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
            <input
              className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Password</label>
            <input
              className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button
            onClick={() => goto("profile-setup")}
            className="w-full bg-[#E91E8C] text-white font-semibold rounded-xl py-3.5 text-sm shadow-lg shadow-pink-200 active:scale-95 transition-all mt-2"
          >
            Create Account
          </button>
          <div className="relative flex items-center">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-3 text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button
            onClick={() => goto("feed")}
            className="w-full bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl py-3.5 text-sm active:scale-95 transition-all"
          >
            Sign In
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          By signing up you agree to our{" "}
          <span className="text-[#E91E8C] font-medium">Terms</span> &amp;{" "}
          <span className="text-[#E91E8C] font-medium">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

function ProfileSetupScreen({ goto }: { goto: (s: Screen) => void }) {
  const [username, setUsername] = useState("");
  return (
    <div className="flex flex-col min-h-full bg-[#F0EDE8] relative overflow-hidden">
      <CircuitBg opacity={0.12} />
      <div className="relative flex flex-col flex-1 px-6 pt-12 pb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">User profile setup</h2>
        <p className="text-sm text-gray-400 mb-8">3 cards</p>

        {/* Avatar picker */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl overflow-hidden bg-gray-300 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-[#E91E8C] rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-base">📷</span>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Profile Pic</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Unique User Name
            </label>
            <input
              className="w-full bg-[#E8E4DE] border border-[#4DA6D6]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA6D6]/30"
              placeholder="@yourhandle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Profession
            </label>
            <button
              onClick={() => goto("profession-select")}
              className="w-full bg-[#E8E4DE] border border-[#4DA6D6]/30 rounded-xl px-4 py-3 text-sm text-gray-400 text-left flex items-center justify-between"
            >
              <span>Pick your profession(s)</span>
              <span>›</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Page / Bio
            </label>
            <textarea
              className="w-full bg-[#E8E4DE] border border-[#4DA6D6]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA6D6]/30 resize-none h-20"
              placeholder="Tell the world what you do..."
            />
          </div>
        </div>

        <button
          onClick={() => goto("feed")}
          className="w-full bg-[#E91E8C] text-white font-semibold rounded-xl py-3.5 text-sm shadow-lg shadow-pink-200 active:scale-95 transition-all mt-6"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

function ProfessionSelectScreen({ goto }: { goto: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="flex flex-col min-h-full bg-[#F0EDE8] relative overflow-hidden">
      <CircuitBg opacity={0.1} />
      <div className="relative flex flex-col flex-1 px-6 pt-12 pb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Profession List</h2>
        <p className="text-sm text-gray-400 mb-3">10 cards</p>
        <p className="text-sm text-gray-600 bg-white/60 rounded-xl p-3 mb-6 leading-snug">
          You are allowed to pick more than one but the fewer you select, the more your chances of being seen.
        </p>

        <div className="flex flex-col gap-2 flex-1">
          {PROFESSIONS.map((p) => {
            const active = selected.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all border ${
                  active
                    ? "border-transparent text-white shadow-md"
                    : "border-[#4DA6D6]/20 bg-white/40 text-gray-700"
                }`}
                style={active ? { background: p.color } : {}}
              >
                <span className="text-lg">{p.icon}</span>
                {p.label}
                {active && <span className="ml-auto text-white">✓</span>}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => goto("feed")}
          className="w-full bg-[#E91E8C] text-white font-semibold rounded-xl py-3.5 text-sm shadow-lg shadow-pink-200 active:scale-95 transition-all mt-6"
        >
          {selected.length > 0 ? `Done (${selected.length} selected)` : "Skip"}
        </button>
      </div>
    </div>
  );
}

const FEED_POSTS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&auto=format",
    name: "Aria Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format",
    profession: "Actor",
    profColor: "#E91E8C",
    comments: 127,
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=400&h=500&fit=crop&auto=format",
    name: "Marcus Reyes",
    avatar: "https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=80&h=80&fit=crop&auto=format",
    profession: "Musician",
    profColor: "#C8A455",
    comments: 50,
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=500&fit=crop&auto=format",
    name: "Dev Sharma",
    avatar: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=80&h=80&fit=crop&auto=format",
    profession: "Software engineer",
    profColor: "#C2185B",
    comments: 18,
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1606143412458-acc5f86de897?w=400&h=500&fit=crop&auto=format",
    name: "Lena Volta",
    avatar: "https://images.unsplash.com/photo-1606143412458-acc5f86de897?w=80&h=80&fit=crop&auto=format",
    profession: "Cinematographer",
    profColor: "#A0813C",
    comments: 84,
  },
];

function FeedScreen({ goto }: { goto: (s: Screen) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const tabs = ["Actor", "Musician", "Software Engineer", "Cinematographer"];

  const toggleLike = (id: number) =>
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const filteredPosts = FEED_POSTS.filter((p) =>
    search === "" ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.profession.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#F0EDE8]">
      {/* Header */}
      <div className="relative bg-[#F0EDE8] pt-10 pb-3 px-4 shadow-sm">
        <CircuitBg opacity={0.08} />
        <div className="relative">
          <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 28, color: "#1a1a2e" }}>
            Unique Username
          </h1>
          {/* Profession tab strip */}
          <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
            {PROFESSIONS.slice(0, 4).map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(i)}
                className="flex flex-col items-center gap-1 flex-shrink-0 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all"
                  style={{
                    background: p.color,
                    boxShadow: activeTab === i ? `0 0 0 2px white, 0 0 0 4px ${p.color}` : undefined,
                  }}
                >
                  <span className="text-2xl">{p.icon}</span>
                </div>
                <span className="text-[10px] text-gray-600 font-medium">{p.label}</span>
                <span className="text-[9px] text-gray-400">0 cards</span>
              </button>
            ))}
            {/* Search button */}
            <button className="w-8 h-14 flex items-end justify-center pb-1 flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-white/70 border border-gray-200 flex items-center justify-center">
                <span className="text-xs">🔍</span>
              </div>
            </button>
          </div>

          {/* Feed label */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">General Feed</span>
          </div>

          {/* Search */}
          <div className="mt-2 relative">
            <input
              className="w-full bg-white/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4DA6D6]/30"
              placeholder="Search users and career types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            liked={likedPosts.includes(post.id)}
            onLike={() => toggleLike(post.id)}
            onProfile={() => goto("user-profile")}
          />
        ))}
        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm">No results for "{search}"</p>
          </div>
        )}
      </div>

      <BottomNav screen="feed" goto={goto} />
    </div>
  );
}

function UserProfileScreen({ goto }: { goto: (s: Screen) => void }) {
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  return (
    <div className="flex flex-col h-full bg-[#F0EDE8]">
      {/* Header */}
      <div className="relative bg-[#EBE7E2] pt-10 pb-4 px-4">
        <CircuitBg opacity={0.12} />
        <div className="relative">
          <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 26, color: "#1a1a2e" }}>
            Unique Username
          </h1>
          {/* Avatar + stats */}
          <div className="flex items-center gap-3 mt-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#E91E8C] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1606143412458-acc5f86de897?w=200&h=200&fit=crop&auto=format"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">3</span>
                <span className="text-xs text-gray-500">picked</span>
                <div className="ml-auto flex gap-2 items-center">
                  <button className="w-7 h-7 bg-[#C8A455] rounded-full flex items-center justify-center shadow">
                    <span className="text-white font-bold text-lg leading-none">+</span>
                  </button>
                  <button
                    onClick={() => setFollowing((f) => !f)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                      following
                        ? "bg-gray-200 text-gray-600 border-gray-300"
                        : "bg-[#E91E8C] text-white border-[#E91E8C]"
                    }`}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500">About · Actor · New York, NY</p>
              <p className="text-xs text-gray-600 leading-snug">
                Passionate storyteller, SAG-AFTRA member. Available for auditions & Picks. 🎭
              </p>
            </div>
          </div>

          {/* Profession tabs */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
            {PROFESSIONS.slice(0, 4).map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(i)}
                className="flex flex-col items-center gap-1 flex-shrink-0"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow"
                  style={{
                    background: p.color,
                    boxShadow: activeTab === i ? `0 0 0 2px white, 0 0 0 4px ${p.color}` : undefined,
                  }}
                >
                  <span className="text-xl">{p.icon}</span>
                </div>
                <span className="text-[10px] text-gray-600 font-medium">{p.label}</span>
                <span className="text-[9px] text-gray-400">13 cards</span>
              </button>
            ))}
            <button className="w-8 h-14 flex items-end justify-center pb-1 flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-white/70 border border-gray-200 flex items-center justify-center">
                <span className="text-xs">🔍</span>
              </div>
            </button>
          </div>

          <div className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Feed</div>
          <div className="mt-2 relative">
            <input
              className="w-full bg-white/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-600 focus:outline-none"
              placeholder="Search posts..."
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>

          {/* Pick button */}
          <button
            onClick={() => goto("picked")}
            className="mt-3 w-full bg-[#E91E8C] text-white font-semibold rounded-xl py-2.5 text-sm shadow-lg shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>📹</span> Pick Session — $10
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {FEED_POSTS.slice(0, 2).map((post) => (
          <PostCard
            key={post.id}
            {...post}
            liked={likedPosts.includes(post.id)}
            onLike={() =>
              setLikedPosts((prev) =>
                prev.includes(post.id) ? prev.filter((x) => x !== post.id) : [...prev, post.id]
              )
            }
            onProfile={() => {}}
          />
        ))}
      </div>

      <BottomNav screen="user-profile" goto={goto} />
    </div>
  );
}

function PickedScreen({ goto }: { goto: (s: Screen) => void }) {
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "JackB", text: "This is amazing! 🔥" },
    { id: 2, user: "Sara_M", text: "When is your next session?" },
  ]);
  const [minimized, setMinimized] = useState(false);

  const mins = Math.floor(countdown / 60).toString().padStart(2, "0");
  const secs = (countdown % 60).toString().padStart(2, "0");

  const sendComment = () => {
    if (!comment.trim()) return;
    setComments((prev) => [...prev, { id: Date.now(), user: "You", text: comment }]);
    setComment("");
  };

  const participants = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=60&h=60&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1606143412458-acc5f86de897?w=60&h=60&fit=crop&auto=format",
  ];

  return (
    <div className="flex flex-col h-full relative bg-[#1a0a3d]">
      {/* Main video */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1674932668403-33398b81c92f?w=400&h=700&fit=crop&auto=format"
          alt="Video call"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a0a3d]/30" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 pt-10 px-4">
          <div className="flex items-center justify-between">
            <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 22, color: "white" }}>
              Picked
            </h2>
            {/* Participants strip */}
            <div className="flex items-center gap-1">
              {[4, 8, 10].map((n, i) => (
                <div key={i} className="flex flex-col items-center">
                  <img
                    src={participants[i]}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
                  />
                  <span className="text-[9px] text-white/70 mt-0.5">{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center justify-center mt-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-1.5 border border-white/10">
              <span className="text-white font-mono font-bold text-lg">
                {mins}:{secs}
              </span>
              <span className="text-white/50 text-xs ml-2">remaining</span>
            </div>
          </div>

          {/* Search */}
          <div className="mt-3 relative">
            <input
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
              placeholder="Search past sessions..."
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">🔍</span>
          </div>
        </div>

        {/* Floating participant bubbles */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {participants.map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt=""
                className="w-12 h-16 rounded-xl object-cover border-2 border-white/30 shadow-lg"
              />
            </div>
          ))}
        </div>

        {/* Self view */}
        <div className="absolute bottom-28 left-3">
          <div className="w-20 h-28 rounded-xl overflow-hidden border-2 border-white/40 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=80&h=120&fit=crop&auto=format"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Comments overlay */}
        <div className="absolute bottom-28 left-24 right-16 max-h-32 overflow-y-auto flex flex-col gap-1">
          {comments.map((c) => (
            <div key={c.id} className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 text-xs">
              <span className="text-[#E91E8C] font-semibold">{c.user}</span>{" "}
              <span className="text-white/90">{c.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#150833] px-4 pt-3 pb-6">
        {/* Comment input */}
        <div className="flex items-center gap-2 mb-3">
          <input
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
            placeholder="Start typing..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendComment()}
          />
          <button onClick={sendComment} className="text-[#E91E8C] text-sm font-semibold">Send</button>
        </div>

        <div className="flex items-center justify-around">
          {/* Conference */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <span className="text-[10px] text-white/50">Conference</span>
          </button>

          {/* Camera */}
          <button
            onClick={() => setCameraOff((c) => !c)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">{cameraOff ? "📵" : "📷"}</span>
            </div>
            <span className="text-[10px] text-white/50">Camera</span>
          </button>

          {/* End call */}
          <button onClick={() => goto("feed")} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-900">
              <span className="text-2xl">📵</span>
            </div>
            <span className="text-[10px] text-white/50">End</span>
          </button>

          {/* Mic */}
          <button
            onClick={() => setMuted((m) => !m)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">{muted ? "🔇" : "🎙️"}</span>
            </div>
            <span className="text-[10px] text-white/50">Mic</span>
          </button>

          {/* Vault */}
          <button onClick={() => goto("vault")} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">🗄️</span>
            </div>
            <span className="text-[10px] text-white/50">Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const VAULT_FILES = [
  { id: 1, name: "Headshots_2024.zip", type: "zip", size: "12.4 MB", locked: false, date: "Aug 12, 2026" },
  { id: 2, name: "Demo_Reel_Final.mp4", type: "video", size: "248 MB", locked: true, date: "Jul 28, 2026" },
  { id: 3, name: "Resume_Actor.pdf", type: "pdf", size: "340 KB", locked: false, date: "Aug 1, 2026" },
  { id: 4, name: "Script_ReadThrough.docx", type: "doc", size: "1.2 MB", locked: true, date: "Aug 20, 2026" },
  { id: 5, name: "Mood_Board.pptx", type: "ppt", size: "8.8 MB", locked: false, date: "Aug 25, 2026" },
];

const FILE_ICONS: Record<string, string> = {
  zip: "📦", video: "🎥", pdf: "📄", doc: "📝", ppt: "📊",
};

function VaultScreen({ goto }: { goto: (s: Screen) => void }) {
  const [search, setSearch] = useState("");
  const [workspaceMsg, setWorkspaceMsg] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: "Aria Chen", text: "Here's the script I mentioned 📝", time: "2:14 PM" },
    { id: 2, user: "You", text: "Got it, reviewing now!", time: "2:15 PM" },
  ]);

  const filtered = VAULT_FILES.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendMsg = () => {
    if (!workspaceMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You", text: workspaceMsg, time: "Now" },
    ]);
    setWorkspaceMsg("");
  };

  return (
    <div className="flex flex-col h-full bg-[#F0EDE8]">
      {/* Header */}
      <div className="relative bg-[#EBE7E2] pt-10 pb-4 px-4 shadow-sm">
        <CircuitBg opacity={0.08} />
        <div className="relative">
          <h2 className="text-xl font-bold text-gray-800">🗄️ Vault</h2>
          <p className="text-xs text-gray-400 mt-0.5">Shared files cannot be downloaded without uploader approval</p>
          <div className="mt-3 relative">
            <input
              className="w-full bg-white/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4DA6D6]/30"
              placeholder="Search docs, files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {/* File list */}
        <div className="px-4 pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Files</h3>
          <div className="flex flex-col gap-2">
            {filtered.map((f) => (
              <div
                key={f.id}
                className="bg-white/70 rounded-xl px-4 py-3 flex items-center gap-3 border border-gray-100 shadow-sm"
              >
                <span className="text-2xl">{FILE_ICONS[f.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                  <p className="text-xs text-gray-400">{f.size} · {f.date}</p>
                </div>
                {f.locked ? (
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                    <span>🔒</span> Locked
                  </div>
                ) : (
                  <button className="text-[10px] text-[#E91E8C] font-semibold bg-pink-50 border border-pink-200 rounded-full px-2 py-0.5">
                    Download
                  </button>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No files found</p>
            )}
          </div>
        </div>

        {/* Workspace */}
        <div className="px-4 mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Work Space</h3>
          <div className="bg-[#2D1B69] rounded-2xl overflow-hidden shadow-xl">
            {/* Messages */}
            <div className="px-4 pt-4 pb-2 flex flex-col gap-2 min-h-32">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.user === "You" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-xl px-3 py-2 text-xs max-w-[80%] ${
                      m.user === "You"
                        ? "bg-[#E91E8C] text-white"
                        : "bg-white/10 text-white/90"
                    }`}
                  >
                    {m.user !== "You" && (
                      <span className="block text-[10px] text-white/50 mb-0.5">{m.user}</span>
                    )}
                    {m.text}
                  </div>
                  <span className="text-[9px] text-white/30 mt-0.5">{m.time}</span>
                </div>
              ))}
            </div>
            {/* Input */}
            <div className="px-3 pb-3 flex items-center gap-2">
              <input
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none"
                placeholder="Start typing..."
                value={workspaceMsg}
                onChange={(e) => setWorkspaceMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              />
              <button
                onClick={sendMsg}
                className="w-8 h-8 rounded-full bg-[#E91E8C] flex items-center justify-center text-white text-sm shadow-md"
              >
                ↑
              </button>
            </div>
          </div>
        </div>

        {/* Upload button */}
        <div className="px-4 mt-4">
          <button className="w-full border-2 border-dashed border-[#4DA6D6]/40 rounded-2xl py-4 flex flex-col items-center gap-1 text-gray-400 text-sm active:bg-[#4DA6D6]/5 transition-all">
            <span className="text-2xl">📤</span>
            <span className="text-xs font-medium">Upload a file</span>
          </button>
        </div>
      </div>

      <BottomNav screen="vault" goto={goto} />
    </div>
  );
}

function SettingsScreen({ goto }: { goto: (s: Screen) => void }) {
  const [isPro, setIsPro] = useState(false);
  const [notifs, setNotifs] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const balance = 124.50;
  const transactions = [
    { id: 1, desc: "Pick Session — Aria Chen", amount: +8.00, date: "Aug 27" },
    { id: 2, desc: "Pick Session — Marcus R.", amount: +8.00, date: "Aug 25" },
    { id: 3, desc: "Pick-Plus Subscription", amount: -50.00, date: "Aug 1" },
    { id: 4, desc: "Pick Session — Dev S.", amount: +4.00, date: "Jul 30" },
    { id: 5, desc: "Withdrawal to Bank", amount: -60.00, date: "Jul 15" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F0EDE8]">
      {/* Header */}
      <div className="relative bg-[#EBE7E2] pt-10 pb-4 px-4 shadow-sm">
        <CircuitBg opacity={0.08} />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C8A455] rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
            <p className="text-xs text-gray-400">5 cards</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 px-4 pt-4 flex flex-col gap-4">
        {/* Profile Settings */}
        <section className="bg-white/70 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile Settings</h3>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {["Username", "Profile Photo", "Bio", "Professions", "Privacy"].map((item) => (
              <button
                key={item}
                className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 active:bg-gray-50 transition-all"
              >
                <span>{item}</span>
                <span className="text-gray-300">›</span>
              </button>
            ))}
          </div>
        </section>

        {/* Pick Settings */}
        <section className="bg-white/70 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pick Settings</h3>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-gray-700">Notifications</p>
                <p className="text-xs text-gray-400">Pick requests & messages</p>
              </div>
              <button
                onClick={() => setNotifs((n) => !n)}
                className={`w-11 h-6 rounded-full transition-all relative ${notifs ? "bg-[#E91E8C]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notifs ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-gray-700">Auto-accept Picks</p>
                <p className="text-xs text-gray-400">Countdown from 10</p>
              </div>
              <button
                onClick={() => setAutoAccept((a) => !a)}
                className={`w-11 h-6 rounded-full transition-all relative ${autoAccept ? "bg-[#E91E8C]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${autoAccept ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Pick-Plus */}
        <section className="rounded-2xl overflow-hidden shadow-lg">
          <div
            className="px-4 py-4"
            style={{ background: "linear-gradient(135deg, #2D1B69 0%, #E91E8C 100%)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-white font-bold text-base">Pick-Plus</h3>
                <p className="text-white/70 text-xs">$50/month subscription</p>
              </div>
              <div className="w-12 h-12 bg-[#E91E8C] rounded-2xl flex items-center justify-center shadow">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
            <ul className="text-white/80 text-xs space-y-1 mb-4">
              <li>✓ Get Picked for just $10 (80% retained)</li>
              <li>✓ Access Vault & file sharing</li>
              <li>✓ Priority Post & Direct Messages</li>
              <li>✓ Higher pay per session</li>
              <li>✓ Nothing deducted from earnings</li>
            </ul>
            <button
              onClick={() => setIsPro((p) => !p)}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                isPro
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white text-[#2D1B69]"
              }`}
            >
              {isPro ? "✓ Subscribed — Cancel Plan" : "Subscribe to Pick-Plus"}
            </button>
          </div>
        </section>

        {/* Bank */}
        <section className="bg-white/70 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="px-4 py-4 bg-gradient-to-r from-[#C8A455]/20 to-[#C8A455]/5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Balance</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">${balance.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-[#C8A455] rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-[#E91E8C] text-white rounded-xl py-2 text-xs font-semibold">Withdraw</button>
              <button className="flex-1 bg-white border border-gray-200 text-gray-700 rounded-xl py-2 text-xs font-semibold">Add Funds</button>
            </div>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-gray-700">{t.desc}</p>
                  <p className="text-[10px] text-gray-400">{t.date}</p>
                </div>
                <span
                  className={`text-sm font-bold ${t.amount > 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <button className="w-full bg-white/60 border border-gray-200 text-red-500 font-semibold rounded-xl py-3 text-sm active:scale-95 transition-all">
          Sign Out
        </button>
      </div>

      <BottomNav screen="settings" goto={goto} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState<Screen>("signup");

  const goto = (s: Screen) => setScreen(s);

  return (
    <div
      className="flex items-center justify-center min-h-full"
      style={{ background: "#1a1a2e", fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Mobile frame */}
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          border: "8px solid #2a2a4a",
          boxShadow: "0 0 0 2px #4a4a7a, 0 32px 80px rgba(0,0,0,0.7)",
          background: "#F0EDE8",
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-6 py-2 flex-shrink-0 z-10"
          style={{ background: "transparent", position: "absolute", top: 0, left: 0, right: 0 }}
        >
          <span className="text-[11px] font-bold text-gray-700">9:41</span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-700">●●●</span>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {screen === "signup" && <SignupScreen goto={goto} />}
          {screen === "profile-setup" && <ProfileSetupScreen goto={goto} />}
          {screen === "profession-select" && <ProfessionSelectScreen goto={goto} />}
          {screen === "feed" && <FeedScreen goto={goto} />}
          {screen === "user-profile" && <UserProfileScreen goto={goto} />}
          {screen === "picked" && <PickedScreen goto={goto} />}
          {screen === "vault" && <VaultScreen goto={goto} />}
          {screen === "settings" && <SettingsScreen goto={goto} />}
        </div>
      </div>
    </div>
  );
}
