import { useState, useEffect, useCallback } from "react";

const FONT_BODY = "'Outfit', sans-serif";
const FONT_DISPLAY = "'Dancing Script', cursive";

// ─── Persistence ─────────────────────────────────────────────────────────────
async function safeGet(key) {
  try {
    const r = await window.storage.get(key, false);
    return r ? JSON.parse(r.value) : null;
  } catch (e) {
    return null;
  }
}
async function safeSet(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), false);
  } catch (e) {}
}

function money(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toFixed(2);
}
function today() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Circuit Board SVG Background ────────────────────────────────────────────
function CircuitBg({ opacity = 0.18 }) {
  return (
    <svg className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity }}>
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

// ─── Professions ──────────────────────────────────────────────────────────────
const PROFESSIONS = [
  { id: "actor", label: "Actor", color: "#E91E8C", icon: "🎭" },
  { id: "musician", label: "Musician", color: "#C8A455", icon: "🎵" },
  { id: "software-engineer", label: "Software engineer", color: "#C2185B", icon: "⌨️" },
  { id: "cinematographer", label: "Cinematographer", color: "#A0813C", icon: "🎬" },
  { id: "director", label: "Movie Director", color: "#7B1FA2", icon: "🎥" },
  { id: "gaffer", label: "Gaffer", color: "#455A64", icon: "💡" },
  { id: "camera-man", label: "Camera Man", color: "#1565C0", icon: "📷" },
  { id: "music-producer", label: "Music Producer", color: "#558B2F", icon: "🎧" },
  { id: "dop", label: "Director of Photography", color: "#4E342E", icon: "📽️" },
];
function profById(id) {
  return PROFESSIONS.find((p) => p.id === id) || PROFESSIONS[0];
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ screen, goto }) {
  const tabs = [
    { id: "feed", icon: "🏠", label: "Feed" },
    { id: "vault", icon: "🗃️", label: "Vault" },
    { id: "picked", icon: "📹", label: "Picked" },
    { id: "user-profile", icon: "👤", label: "Profile" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];
  return (
    <div className="flex border-t border-gray-200 bg-white/90 backdrop-blur-sm flex-shrink-0">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => goto(t.id)}
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
function PostCard({ post, liked, onLike, onProfile, onComment, onSave, saved, onSend, commentCount }) {
  const prof = profById(post.professionId);
  const [commentText, setCommentText] = useState("");

  function send() {
    if (!commentText.trim()) return;
    onSend(commentText.trim());
    setCommentText("");
  }

  return (
    <div className="relative bg-[#EBE7E2] rounded-2xl overflow-hidden shadow-sm mb-4">
      <div className="relative h-72 overflow-hidden bg-gray-300">
        <img src={post.img} alt={post.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0">
          <CircuitBg opacity={0.12} />
        </div>
      </div>

      <div className="relative px-3 py-2">
        <CircuitBg opacity={0.1} />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onLike} className="transition-transform active:scale-90">
              <span className="text-2xl">{liked ? "❤️" : "🤍"}</span>
            </button>
            <button className="transition-transform active:scale-90 opacity-70">
              <span className="text-xl">🔗</span>
            </button>
            <button onClick={onComment} className="relative transition-transform active:scale-90">
              <span className="text-xl">💬</span>
              <span className="absolute -top-1 -right-2 bg-gray-500 text-white text-[9px] font-bold rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center">
                {commentCount}
              </span>
            </button>
          </div>
          <button onClick={onSave} className="transition-transform active:scale-90">
            <span className="text-xl">{saved ? "📌" : "📍"}</span>
          </button>
        </div>

        <div className="relative flex items-center gap-2 mt-2">
          <button onClick={onProfile}>
            <img
              src={post.avatar}
              alt={post.name}
              className="w-8 h-8 rounded-full object-cover border-2"
              style={{ borderColor: prof.color }}
            />
          </button>
          <button onClick={onProfile} className="text-sm text-gray-800" style={{ fontFamily: FONT_DISPLAY, fontSize: 16 }}>
            {post.name}
          </button>
          <span className="ml-auto text-[10px] font-semibold text-white px-2 py-0.5 rounded-full" style={{ background: prof.color }}>
            {prof.label}
          </span>
        </div>

        <div className="relative flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format" alt="me" className="w-full h-full object-cover" />
          </div>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Write a comment..."
            className="flex-1 bg-white/60 rounded-full px-3 py-1 text-xs text-gray-700 border border-gray-200 outline-none"
          />
          <button onClick={send} className="text-xs font-semibold text-[#E91E8C] flex-shrink-0">Send</button>
        </div>
      </div>
    </div>
  );
}

// ─── Mock feed data ───────────────────────────────────────────────────────────
const FEED_POSTS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&auto=format",
    name: "Aria Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format",
    professionId: "actor",
    bio: "Passionate storyteller, SAG-AFTRA member. Available for auditions & Picks.",
    picked: 3,
    commentsBase: 127,
    caption: "On set today, feeling grateful for this journey.",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=400&h=500&fit=crop&auto=format",
    name: "Marcus Reyes",
    avatar: "https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=80&h=80&fit=crop&auto=format",
    professionId: "musician",
    bio: "Singer-songwriter. New EP dropping soon.",
    picked: 12,
    commentsBase: 50,
    caption: "Studio session ran late but the new track is worth it.",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=500&fit=crop&auto=format",
    name: "Dev Sharma",
    avatar: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=80&h=80&fit=crop&auto=format",
    professionId: "software-engineer",
    bio: "Backend engineer, open to consulting Picks.",
    picked: 5,
    commentsBase: 18,
    caption: "Shipped a gnarly refactor this week, onboarding is 3x faster now.",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1606143412458-acc5f86de897?w=400&h=500&fit=crop&auto=format",
    name: "Lena Volta",
    avatar: "https://images.unsplash.com/photo-1606143412458-acc5f86de897?w=80&h=80&fit=crop&auto=format",
    professionId: "cinematographer",
    bio: "Cinematographer, shot on 16mm whenever I can.",
    picked: 8,
    commentsBase: 84,
    caption: "Golden hour on location, the light cooperated for once.",
  },
];

const MOCK_COMMENT_SEED = [
  { id: "s1", user: "JackB", text: "This is amazing! 🔥" },
  { id: "s2", user: "Sara_M", text: "When is your next session?" },
];

// ─── Screens ──────────────────────────────────────────────────────────────────
function SignupScreen({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="flex flex-col flex-1 bg-[#F0EDE8] relative overflow-hidden">
      <CircuitBg opacity={0.12} />
      <div className="relative flex flex-col flex-1 px-6 pt-16 pb-8 overflow-y-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 rounded-3xl bg-[#E91E8C] flex items-center justify-center shadow-xl mb-4">
            <span className="text-5xl">◆</span>
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 42, color: "#1a1a2e", lineHeight: 1 }}>PickMe</h1>
          <p className="text-sm text-gray-500 mt-1 font-light tracking-wide">Discover. Connect. Get Picked.</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
            <input
              className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#E91E8C]/30"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Password</label>
            <input
              className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#E91E8C]/30"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button
            onClick={() => onSignIn(email)}
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
            onClick={() => onSignIn(email)}
            className="w-full bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl py-3.5 text-sm active:scale-95 transition-all"
          >
            Sign In
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          By signing up you agree to our <span className="text-[#E91E8C] font-medium">Terms</span> &amp;{" "}
          <span className="text-[#E91E8C] font-medium">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

function ProfileSetupScreen({ draft, setDraft, onOpenProfessions, onContinue }) {
  return (
    <div className="flex flex-col flex-1 bg-[#F0EDE8] relative overflow-hidden">
      <CircuitBg opacity={0.12} />
      <div className="relative flex flex-col flex-1 px-6 pt-12 pb-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User profile setup</h2>

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
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Unique User Name</label>
            <input
              className="w-full bg-[#E8E4DE] border border-[#4DA6D6]/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4DA6D6]/30"
              placeholder="@yourhandle"
              value={draft.username}
              onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Profession</label>
            <button
              onClick={onOpenProfessions}
              className="w-full bg-[#E8E4DE] border border-[#4DA6D6]/30 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between"
              style={{ color: draft.professions.length ? "#374151" : "#9ca3af" }}
            >
              <span>
                {draft.professions.length
                  ? draft.professions.map((id) => profById(id).label).join(", ")
                  : "Pick your profession(s)"}
              </span>
              <span>›</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Page / Bio</label>
            <textarea
              className="w-full bg-[#E8E4DE] border border-[#4DA6D6]/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4DA6D6]/30 resize-none h-20"
              placeholder="Tell the world what you do..."
              value={draft.bio}
              onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
            />
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-[#E91E8C] text-white font-semibold rounded-xl py-3.5 text-sm shadow-lg shadow-pink-200 active:scale-95 transition-all mt-6"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

function ProfessionSelectScreen({ draft, setDraft, onDone }) {
  const toggle = (id) =>
    setDraft((d) => ({
      ...d,
      professions: d.professions.includes(id) ? d.professions.filter((x) => x !== id) : [...d.professions, id],
    }));

  return (
    <div className="flex flex-col flex-1 bg-[#F0EDE8] relative overflow-hidden">
      <CircuitBg opacity={0.1} />
      <div className="relative flex flex-col flex-1 px-6 pt-12 pb-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Profession List</h2>
        <p className="text-sm text-gray-600 bg-white/60 rounded-xl p-3 mb-6 leading-snug">
          You are allowed to pick more than one but the fewer you select, the more your chances of being seen.
        </p>

        <div className="flex flex-col gap-2 flex-1">
          {PROFESSIONS.map((p) => {
            const active = draft.professions.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all border ${
                  active ? "border-transparent text-white shadow-md" : "border-[#4DA6D6]/20 bg-white/40 text-gray-700"
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
          onClick={onDone}
          className="w-full bg-[#E91E8C] text-white font-semibold rounded-xl py-3.5 text-sm shadow-lg shadow-pink-200 active:scale-95 transition-all mt-6"
        >
          {draft.professions.length > 0 ? `Done (${draft.professions.length} selected)` : "Skip"}
        </button>
      </div>
    </div>
  );
}

function FeedScreen({ posts, likedIds, toggleLike, savedIds, toggleSave, comments, addComment, onOpenComments, onOpenProfile }) {
  const [activeTab, setActiveTab] = useState(null);
  const [search, setSearch] = useState("");
  const tabProfessions = PROFESSIONS.slice(0, 4);

  const filtered = posts.filter((p) => {
    if (activeTab && p.professionId !== activeTab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || profById(p.professionId).label.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col flex-1 bg-[#F0EDE8] overflow-hidden">
      <div className="relative bg-[#F0EDE8] pt-4 pb-3 px-4 shadow-sm flex-shrink-0">
        <CircuitBg opacity={0.08} />
        <div className="relative">
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: "#1a1a2e" }}>Unique Username</h1>
          <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
            {tabProfessions.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab((t) => (t === p.id ? null : p.id))}
                className="flex flex-col items-center gap-1 flex-shrink-0 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all"
                  style={{ background: p.color, boxShadow: activeTab === p.id ? `0 0 0 2px white, 0 0 0 4px ${p.color}` : undefined }}
                >
                  <span className="text-2xl">{p.icon}</span>
                </div>
                <span className="text-[10px] text-gray-600 font-medium">{p.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">General Feed</div>

          <div className="mt-2 relative">
            <input
              className="w-full bg-white/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#4DA6D6]/30"
              placeholder="Search users and career types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            liked={likedIds.includes(post.id)}
            onLike={() => toggleLike(post.id)}
            saved={savedIds.includes(post.id)}
            onSave={() => toggleSave(post.id)}
            onProfile={() => onOpenProfile(post)}
            onComment={() => onOpenComments(post)}
            onSend={(text) => addComment(post.id, text)}
            commentCount={post.commentsBase + (comments[post.id] || []).length}
          />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm">No results for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserProfileScreen({
  creator,
  isSelf,
  following,
  onToggleFollow,
  onPick,
  onEditProfile,
  posts,
  likedIds,
  toggleLike,
  savedIds,
  toggleSave,
  comments,
  onOpenComments,
  addComment,
}) {
  const profileProfessions = isSelf ? creator.professions.map(profById) : [profById(creator.professionId)];
  const myPosts = posts.filter((p) => (isSelf ? false : p.id === creator.id));

  return (
    <div className="flex flex-col flex-1 bg-[#F0EDE8] overflow-hidden">
      <div className="relative bg-[#EBE7E2] pt-4 pb-4 px-4 flex-shrink-0">
        <CircuitBg opacity={0.12} />
        <div className="relative">
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: "#1a1a2e" }}>{creator.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 shadow-md" style={{ borderColor: profileProfessions[0]?.color || "#E91E8C" }}>
              <img src={creator.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">{creator.picked}</span>
                <span className="text-xs text-gray-500">picked</span>
                <div className="ml-auto flex gap-2 items-center">
                  <button className="w-7 h-7 bg-[#C8A455] rounded-full flex items-center justify-center shadow">
                    <span className="text-white font-bold text-lg leading-none">+</span>
                  </button>
                  {isSelf ? (
                    <button onClick={onEditProfile} className="px-3 py-1 rounded-full text-xs font-bold border bg-white text-gray-700 border-gray-300">
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={onToggleFollow}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                        following ? "bg-gray-200 text-gray-600 border-gray-300" : "bg-[#E91E8C] text-white border-[#E91E8C]"
                      }`}
                    >
                      {following ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                About · {profileProfessions.map((p) => p.label).join(", ")}
              </p>
              <p className="text-xs text-gray-600 leading-snug">{creator.bio}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
            {profileProfessions.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow" style={{ background: p.color }}>
                  <span className="text-xl">{p.icon}</span>
                </div>
                <span className="text-[10px] text-gray-600 font-medium">{p.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{isSelf ? "Your Feed" : "User Feed"}</div>
          <div className="mt-2 relative">
            <input
              className="w-full bg-white/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-600 outline-none"
              placeholder="Search posts..."
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>

          {!isSelf && (
            <button
              onClick={() => onPick(creator)}
              className="mt-3 w-full bg-[#E91E8C] text-white font-semibold rounded-xl py-2.5 text-sm shadow-lg shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>📹</span> Pick Session — $10
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {myPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            liked={likedIds.includes(post.id)}
            onLike={() => toggleLike(post.id)}
            saved={savedIds.includes(post.id)}
            onSave={() => toggleSave(post.id)}
            onProfile={() => {}}
            onComment={() => onOpenComments(post)}
            onSend={(text) => addComment(post.id, text)}
            commentCount={post.commentsBase + (comments[post.id] || []).length}
          />
        ))}
        {isSelf && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-xl border-2 border-dashed border-gray-300 text-gray-400">
            <span className="text-2xl">📤</span>
            <span className="text-xs font-medium">Share your first post</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PickedScreen({ activeCall, onEndCall, onOpenVault }) {
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENT_SEED);

  useEffect(() => {
    if (!activeCall) return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [activeCall]);

  if (!activeCall) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-3 px-8 text-center bg-[#1a0a3d]">
        <span className="text-4xl">📹</span>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: "white" }}>Picked</h2>
        <p className="text-sm text-white/60">No live Pick session. Visit a profile and tap Pick Session to start one.</p>
      </div>
    );
  }

  const mins = Math.floor(countdown / 60).toString().padStart(2, "0");
  const secs = (countdown % 60).toString().padStart(2, "0");

  const sendComment = () => {
    if (!comment.trim()) return;
    setComments((prev) => [...prev, { id: Date.now(), user: "You", text: comment }]);
    setComment("");
  };

  const participants = [4, 8, 10];

  return (
    <div className="flex flex-col flex-1 relative bg-[#1a0a3d] overflow-hidden">
      <div className="relative flex-1 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1674932668403-33398b81c92f?w=400&h=700&fit=crop&auto=format"
          alt="Video call"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a0a3d]/30" />

        <div className="absolute top-0 left-0 right-0 pt-4 px-4">
          <div className="flex items-center justify-between">
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: "white" }}>{activeCall.name}</h2>
            <div className="flex items-center gap-1">
              {participants.map((n, i) => (
                <div key={i} className="flex flex-col items-center">
                  <img src={activeCall.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white/40" />
                  <span className="text-[9px] text-white/70 mt-0.5">{n}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center mt-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-1.5 border border-white/10">
              <span className="text-white font-mono font-bold text-lg">{mins}:{secs}</span>
              <span className="text-white/50 text-xs ml-2">remaining</span>
            </div>
          </div>

          <div className="mt-3 relative">
            <input
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-white/40 outline-none"
              placeholder="Search past sessions..."
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">🔍</span>
          </div>
        </div>

        <div className="absolute bottom-28 left-3">
          <div className="w-20 h-28 rounded-xl overflow-hidden border-2 border-white/40 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=80&h=120&fit=crop&auto=format"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="absolute bottom-28 left-24 right-4 max-h-32 overflow-y-auto flex flex-col gap-1">
          {comments.map((c) => (
            <div key={c.id} className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 text-xs">
              <span className="text-[#E91E8C] font-semibold">{c.user}</span>{" "}
              <span className="text-white/90">{c.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#150833] px-4 pt-3 pb-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <input
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none"
            placeholder="Start typing..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendComment()}
          />
          <button onClick={sendComment} className="text-[#E91E8C] text-sm font-semibold">Send</button>
        </div>

        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <span className="text-[10px] text-white/50">Conference</span>
          </button>
          <button onClick={() => setCameraOff((c) => !c)} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">{cameraOff ? "🚫" : "📷"}</span>
            </div>
            <span className="text-[10px] text-white/50">Camera</span>
          </button>
          <button onClick={onEndCall} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-900">
              <span className="text-2xl">📞</span>
            </div>
            <span className="text-[10px] text-white/50">End</span>
          </button>
          <button onClick={() => setMuted((m) => !m)} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">{muted ? "🔇" : "🎙️"}</span>
            </div>
            <span className="text-[10px] text-white/50">Mic</span>
          </button>
          <button onClick={onOpenVault} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">🗃️</span>
            </div>
            <span className="text-[10px] text-white/50">Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const VAULT_FILES_DEFAULT = [
  { id: 1, name: "Headshots_2024.zip", type: "zip", size: "12.4 MB", locked: false, date: "Aug 12" },
  { id: 2, name: "Demo_Reel_Final.mp4", type: "video", size: "248 MB", locked: true, date: "Jul 28" },
  { id: 3, name: "Resume_Actor.pdf", type: "pdf", size: "340 KB", locked: false, date: "Aug 1" },
  { id: 4, name: "Script_ReadThrough.docx", type: "doc", size: "1.2 MB", locked: true, date: "Aug 20" },
  { id: 5, name: "Mood_Board.pptx", type: "ppt", size: "8.8 MB", locked: false, date: "Aug 25" },
];
const FILE_ICONS = { zip: "📦", video: "🎥", pdf: "📄", doc: "📝", ppt: "📊" };

function VaultScreen({ files, onUpload }) {
  const [search, setSearch] = useState("");
  const [workspaceMsg, setWorkspaceMsg] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: "Aria Chen", text: "Here's the script I mentioned 📄", time: "2:14 PM" },
    { id: 2, user: "You", text: "Got it, reviewing now!", time: "2:15 PM" },
  ]);

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const sendMsg = () => {
    if (!workspaceMsg.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), user: "You", text: workspaceMsg, time: "Now" }]);
    setWorkspaceMsg("");
  };

  return (
    <div className="flex flex-col flex-1 bg-[#F0EDE8] overflow-hidden">
      <div className="relative bg-[#EBE7E2] pt-4 pb-4 px-4 shadow-sm flex-shrink-0">
        <CircuitBg opacity={0.08} />
        <div className="relative">
          <h2 className="text-xl font-bold text-gray-800">🗃️ Vault</h2>
          <p className="text-xs text-gray-400 mt-0.5">Shared files cannot be downloaded without uploader approval</p>
          <div className="mt-3 relative">
            <input
              className="w-full bg-white/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#4DA6D6]/30"
              placeholder="Search docs, files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Files</h3>
          <div className="flex flex-col gap-2">
            {filtered.map((f) => (
              <div key={f.id} className="bg-white/70 rounded-xl px-4 py-3 flex items-center gap-3 border border-gray-100 shadow-sm">
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
                  <span className="text-[10px] text-[#E91E8C] font-semibold bg-pink-50 border border-pink-200 rounded-full px-2 py-0.5">
                    Download
                  </span>
                )}
              </div>
            ))}
            {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No files found</p>}
          </div>
        </div>

        <div className="px-4 mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Work Space</h3>
          <div className="bg-[#2D1B69] rounded-2xl overflow-hidden shadow-xl">
            <div className="px-4 pt-4 pb-2 flex flex-col gap-2 min-h-32">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.user === "You" ? "items-end" : "items-start"}`}>
                  <div className={`rounded-xl px-3 py-2 text-xs max-w-[80%] ${m.user === "You" ? "bg-[#E91E8C] text-white" : "bg-white/10 text-white/90"}`}>
                    {m.user !== "You" && <span className="block text-[10px] text-white/50 mb-0.5">{m.user}</span>}
                    {m.text}
                  </div>
                  <span className="text-[9px] text-white/30 mt-0.5">{m.time}</span>
                </div>
              ))}
            </div>
            <div className="px-3 pb-3 flex items-center gap-2">
              <input
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none"
                placeholder="Start typing..."
                value={workspaceMsg}
                onChange={(e) => setWorkspaceMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              />
              <button onClick={sendMsg} className="w-8 h-8 rounded-full bg-[#E91E8C] flex items-center justify-center text-white text-sm shadow-md">➤</button>
            </div>
          </div>
        </div>

        <div className="px-4 mt-4">
          <button
            onClick={onUpload}
            className="w-full border-2 border-dashed border-[#4DA6D6]/40 rounded-2xl py-4 flex flex-col items-center gap-1 text-gray-400 text-sm active:bg-[#4DA6D6]/5 transition-all"
          >
            <span className="text-2xl">📤</span>
            <span className="text-xs font-medium">Upload a file</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ profile, bank, onToggleSubscribe, onToggleAutoAccept, onWithdraw, onAddFunds, onLogout }) {
  return (
    <div className="flex flex-col flex-1 bg-[#F0EDE8] overflow-hidden">
      <div className="relative bg-[#EBE7E2] pt-4 pb-4 px-4 shadow-sm flex-shrink-0">
        <CircuitBg opacity={0.08} />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C8A455] rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-2xl">⚙️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 px-4 pt-4 flex flex-col gap-4">
        <section className="bg-white/70 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile Settings</h3>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {["Username", "Profile Photo", "Bio", "Professions", "Privacy"].map((item) => (
              <button key={item} className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 active:bg-gray-50 transition-all">
                <span>{item}</span>
                <span className="text-gray-300">›</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white/70 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pick Settings</h3>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-gray-700">Auto-accept Picks</p>
                <p className="text-xs text-gray-400">Countdown from 10</p>
              </div>
              <button
                onClick={onToggleAutoAccept}
                className={`w-11 h-6 rounded-full transition-all relative ${profile.autoAccept ? "bg-[#E91E8C]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${profile.autoAccept ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl overflow-hidden shadow-lg">
          <div className="px-4 py-4" style={{ background: "linear-gradient(135deg, #2D1B69 0%, #E91E8C 100%)" }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-white font-bold text-base">Pick-Plus</h3>
                <p className="text-white/70 text-xs">$50/month subscription</p>
              </div>
              <div className="w-12 h-12 bg-[#E91E8C] rounded-2xl flex items-center justify-center shadow">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <ul className="text-white/80 text-xs space-y-1 mb-4">
              <li>✓ Earn $8 every time you're Picked</li>
              <li>✓ Access Vault &amp; file sharing</li>
              <li>✓ Priority Post &amp; Direct Messages</li>
              <li>✓ Higher pay per session</li>
              <li>✓ Nothing deducted from earnings</li>
            </ul>
            <button
              onClick={onToggleSubscribe}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                profile.subscribed ? "bg-white/20 text-white border border-white/30" : "bg-white text-[#2D1B69]"
              }`}
            >
              {profile.subscribed ? "✓ Subscribed — Cancel Plan" : "Subscribe to Pick-Plus"}
            </button>
          </div>
        </section>

        <section className="bg-white/70 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="px-4 py-4 bg-gradient-to-r from-[#C8A455]/20 to-[#C8A455]/5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Balance</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">{money(bank.balance)}</p>
              </div>
              <div className="w-12 h-12 bg-[#C8A455] rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={onWithdraw} className="flex-1 bg-[#E91E8C] text-white rounded-xl py-2 text-xs font-semibold">Withdraw</button>
              <button onClick={onAddFunds} className="flex-1 bg-white border border-gray-200 text-gray-700 rounded-xl py-2 text-xs font-semibold">Add Funds</button>
            </div>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {bank.transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-gray-700">{t.desc}</p>
                  <p className="text-[10px] text-gray-400">{t.date}</p>
                </div>
                <span className={`text-sm font-bold ${t.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                  {t.amount > 0 ? "+" : ""}{money(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <button onClick={onLogout} className="w-full bg-white/60 border border-gray-200 text-red-500 font-semibold rounded-xl py-3 text-sm active:scale-95 transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
}

function CommentsSheet({ post, comments, onClose, onSend }) {
  const [text, setText] = useState("");
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-[#F0EDE8]">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-gray-200 bg-white/70">
        <button onClick={onClose} className="p-1.5 rounded-full bg-white"><span>✕</span></button>
        <span className="text-sm font-bold text-gray-800">Comments</span>
        <div style={{ width: 30 }} />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {comments.length === 0 && <div className="text-center text-gray-400 text-sm mt-8">No comments yet.</div>}
        {comments.map((c) => (
          <div key={c.id} className="text-sm">
            <span className="font-semibold text-gray-800 mr-1.5">{c.user}</span>
            <span className="text-gray-600">{c.text}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-200 bg-white/70 flex-shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              onSend(text.trim());
              setText("");
            }
          }}
          placeholder="Write a comment..."
          className="flex-1 rounded-full px-3.5 py-2 bg-white border border-gray-200 text-sm outline-none"
        />
        <button
          onClick={() => {
            if (text.trim()) {
              onSend(text.trim());
              setText("");
            }
          }}
          className="text-sm font-semibold text-[#E91E8C]"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [bank, setBank] = useState({ balance: 0, transactions: [] });
  const [vaultFiles, setVaultFiles] = useState(VAULT_FILES_DEFAULT);
  const [followedIds, setFollowedIds] = useState([]);
  const [pickedIds, setPickedIds] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [comments, setComments] = useState({});

  const [screen, setScreen] = useState("signup");
  const [draft, setDraft] = useState({ username: "", bio: "", professions: [] });
  const [viewingPost, setViewingPost] = useState(null); // null = self
  const [activeCall, setActiveCall] = useState(null);
  const [commentsFor, setCommentsFor] = useState(null);

  const goto = (s) => setScreen(s);

  useEffect(() => {
    (async () => {
      const p = await safeGet("profile");
      const b = await safeGet("bank");
      const v = await safeGet("vaultFiles");
      const f = await safeGet("followedIds");
      const pk = await safeGet("pickedIds");
      const lk = await safeGet("likedIds");
      const sv = await safeGet("savedIds");
      const cm = await safeGet("comments");
      if (p) setProfile(p);
      if (b) setBank(b);
      if (v) setVaultFiles(v);
      if (f) setFollowedIds(f);
      if (pk) setPickedIds(pk);
      if (lk) setLikedIds(lk);
      if (sv) setSavedIds(sv);
      if (cm) setComments(cm);
      if (p) setScreen("feed");
      setReady(true);
    })();
  }, []);

  useEffect(() => { if (profile) safeSet("profile", profile); }, [profile]);
  useEffect(() => { if (ready) safeSet("bank", bank); }, [bank, ready]);
  useEffect(() => { if (ready) safeSet("vaultFiles", vaultFiles); }, [vaultFiles, ready]);
  useEffect(() => { if (ready) safeSet("followedIds", followedIds); }, [followedIds, ready]);
  useEffect(() => { if (ready) safeSet("pickedIds", pickedIds); }, [pickedIds, ready]);
  useEffect(() => { if (ready) safeSet("likedIds", likedIds); }, [likedIds, ready]);
  useEffect(() => { if (ready) safeSet("savedIds", savedIds); }, [savedIds, ready]);
  useEffect(() => { if (ready) safeSet("comments", comments); }, [comments, ready]);

  function finishSignup(email) {
    setDraft((d) => ({ ...d, email }));
    goto("profile-setup");
  }

  function finishProfileSetup() {
    setProfile({
      name: draft.username.trim() || "Unique Username",
      email: draft.email || "",
      bio: draft.bio.trim() || "New on PickMe.",
      professions: draft.professions.length ? draft.professions : ["actor"],
      subscribed: false,
      autoAccept: false,
    });
    setBank({
      balance: 124.5,
      transactions: [
        { id: 1, desc: "Pick Session — Aria Chen", amount: 8.0, date: "Aug 27" },
        { id: 2, desc: "Pick Session — Marcus R.", amount: 8.0, date: "Aug 25" },
        { id: 3, desc: "Pick-Plus Subscription", amount: -50.0, date: "Aug 1" },
        { id: 4, desc: "Pick Session — Dev S.", amount: 3.0, date: "Jul 30" },
        { id: 5, desc: "Withdrawal to Bank", amount: -60.0, date: "Jul 15" },
      ],
    });
    goto("feed");
  }

  const toggleLike = useCallback((postId) => {
    setLikedIds((ids) => (ids.includes(postId) ? ids.filter((x) => x !== postId) : [...ids, postId]));
  }, []);
  const toggleSave = useCallback((postId) => {
    setSavedIds((ids) => (ids.includes(postId) ? ids.filter((x) => x !== postId) : [...ids, postId]));
  }, []);
  function addComment(postId, text) {
    setComments((all) => ({
      ...all,
      [postId]: [...(all[postId] || []), { id: Math.random().toString(36).slice(2), user: profile?.name || "You", text }],
    }));
  }
  function openComments(post) {
    setCommentsFor(post);
  }

  function openProfile(post) {
    setViewingPost(post);
    goto("user-profile");
  }
  function toggleFollow(postId) {
    setFollowedIds((ids) => (ids.includes(postId) ? ids.filter((x) => x !== postId) : [...ids, postId]));
  }

  function startPick(post) {
    setBank((b) => ({
      balance: +(b.balance - 10).toFixed(2),
      transactions: [{ id: Math.random().toString(36).slice(2), desc: "Pick Session — " + post.name, amount: -10, date: today() }, ...b.transactions],
    }));
    setPickedIds((ids) => (ids.includes(post.id) ? ids : [...ids, post.id]));
    setActiveCall(post);
    goto("picked");
  }
  function endCall() {
    setActiveCall(null);
    goto("feed");
  }

  function toggleSubscribe() {
    setProfile((p) => ({ ...p, subscribed: !p.subscribed }));
    if (!profile.subscribed) {
      setBank((b) => ({
        balance: +(b.balance - 50).toFixed(2),
        transactions: [{ id: Math.random().toString(36).slice(2), desc: "Pick-Plus Subscription", amount: -50, date: today() }, ...b.transactions],
      }));
    }
  }
  function toggleAutoAccept() {
    setProfile((p) => ({ ...p, autoAccept: !p.autoAccept }));
  }
  function withdraw() {
    setBank((b) => {
      const amount = Math.min(50, b.balance);
      if (amount <= 0) return b;
      return {
        balance: +(b.balance - amount).toFixed(2),
        transactions: [{ id: Math.random().toString(36).slice(2), desc: "Withdrawal to Bank", amount: -amount, date: today() }, ...b.transactions],
      };
    });
  }
  function addFunds() {
    setBank((b) => ({
      balance: +(b.balance + 50).toFixed(2),
      transactions: [{ id: Math.random().toString(36).slice(2), desc: "Added funds", amount: 50, date: today() }, ...b.transactions],
    }));
  }
  function uploadFile() {
    setVaultFiles((files) => [
      { id: Date.now(), name: "New_Upload_" + (files.length + 1) + ".pdf", type: "pdf", size: "1.0 MB", locked: false, date: today() },
      ...files,
    ]);
  }

  if (!ready) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: 844, background: "#F0EDE8", fontFamily: FONT_BODY }}>
        <span className="text-sm text-gray-400">Loading PickMe...</span>
      </div>
    );
  }

  const selfCreator = profile
    ? {
        id: "me",
        name: profile.name,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format",
        professions: profile.professions,
        bio: profile.bio,
        picked: pickedIds.length,
      }
    : null;

  const viewingSelf = viewingPost === null;
  const activeCreator = viewingSelf ? selfCreator : viewingPost;

  return (
    <div
      className="w-full flex flex-col relative"
      style={{ height: 844, background: "#F0EDE8", borderRadius: 20, overflow: "hidden", fontFamily: FONT_BODY }}
    >
      {screen === "signup" && <SignupScreen onSignIn={finishSignup} />}

      {screen === "profile-setup" && (
        <ProfileSetupScreen draft={draft} setDraft={setDraft} onOpenProfessions={() => goto("profession-select")} onContinue={finishProfileSetup} />
      )}

      {screen === "profession-select" && (
        <ProfessionSelectScreen draft={draft} setDraft={setDraft} onDone={() => goto("profile-setup")} />
      )}

      {screen === "feed" && (
        <FeedScreen
          posts={FEED_POSTS}
          likedIds={likedIds}
          toggleLike={toggleLike}
          savedIds={savedIds}
          toggleSave={toggleSave}
          comments={comments}
          addComment={addComment}
          onOpenComments={openComments}
          onOpenProfile={openProfile}
        />
      )}

      {screen === "user-profile" && activeCreator && (
        <UserProfileScreen
          creator={activeCreator}
          isSelf={viewingSelf}
          following={!viewingSelf && followedIds.includes(activeCreator.id)}
          onToggleFollow={() => toggleFollow(activeCreator.id)}
          onPick={startPick}
          onEditProfile={() => goto("settings")}
          posts={FEED_POSTS}
          likedIds={likedIds}
          toggleLike={toggleLike}
          savedIds={savedIds}
          toggleSave={toggleSave}
          comments={comments}
          onOpenComments={openComments}
          addComment={addComment}
        />
      )}

      {screen === "picked" && <PickedScreen activeCall={activeCall} onEndCall={endCall} onOpenVault={() => goto("vault")} />}

      {screen === "vault" && <VaultScreen files={vaultFiles} onUpload={uploadFile} />}

      {screen === "settings" && (
        <SettingsScreen
          profile={profile}
          bank={bank}
          onToggleSubscribe={toggleSubscribe}
          onToggleAutoAccept={toggleAutoAccept}
          onWithdraw={withdraw}
          onAddFunds={addFunds}
          onLogout={() => { setProfile(null); safeSet("profile", null); goto("signup"); }}
        />
      )}

      {commentsFor && (
        <CommentsSheet
          post={commentsFor}
          comments={comments[commentsFor.id] || []}
          onClose={() => setCommentsFor(null)}
          onSend={(text) => addComment(commentsFor.id, text)}
        />
      )}

      {profile && (screen === "feed" || screen === "user-profile" || screen === "vault" || screen === "settings") && (
        <BottomNav
          screen={screen}
          goto={(s) => {
            if (s === "user-profile") setViewingPost(null);
            goto(s);
          }}
        />
      )}
    </div>
  );
}
