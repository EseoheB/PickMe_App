import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Search, Wallet, FolderLock, User, Settings, X, Mic, MicOff,
  Video, VideoOff, PhoneOff, Minimize2, Maximize2, Lock,
  ChevronRight, Plus, LogOut, FileText, Music2, Film, Download,
  ArrowUpRight, ArrowDownLeft, Sparkles, Bell,
  Cpu, PersonStanding, Users, Clapperboard, Camera, Disc3, Laugh, PenTool,
  Heart, MessageCircle, Send, MessageSquare, ArrowLeft,
  Link2, Bookmark, KeyRound, Check,
  Aperture, Lightbulb, Drama,
} from "lucide-react";

const THEME = {
  bg: "#DCDBE2",
  surface: "#FFFFFF",
  surfaceRaised: "#F1F0F5",
  border: "#CFCED6",
  borderSoft: "#E2E1E7",
  textPrimary: "#17151D",
  textSecondary: "#5B5966",
  textMuted: "#8B8994",
  gold: "#C08A3E",
  goldDark: "#8A6A2E",
  pink: "#D9527A",
  blue: "#4C86C6",
  green: "#4E9A6C",
  red: "#DD3B3B",
};

const ICONS = import.meta.env.BASE_URL + "icons/";

const MONO = "'SFMono-Regular','Consolas','Liberation Mono',monospace";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

const PROFESSIONS = [
  "Software Engineer", "Musician", "Dancer", "Choreographer", "Content Creator",
  "Actor", "Photographer", "Music Producer", "Comedian", "Illustrator",
  "Cinematographer", "Director of Photography", "Gaffer", "Camera Man", "Movie Director",
];

const PROFESSION_ICONS = {
  "Software Engineer": Cpu,
  "Musician": Music2,
  "Dancer": PersonStanding,
  "Choreographer": Users,
  "Content Creator": Video,
  "Actor": Drama,
  "Photographer": Camera,
  "Music Producer": Disc3,
  "Comedian": Laugh,
  "Illustrator": PenTool,
  "Cinematographer": Film,
  "Director of Photography": Aperture,
  "Gaffer": Lightbulb,
  "Camera Man": Video,
  "Movie Director": Clapperboard,
};

const PROFESSION_TILE_COLORS = ["#D9527A", "#C08A3E"];

const AVATAR_COLORS = ["#C08A3E", "#4C86C6", "#4E9A6C", "#9B5FA0", "#D9527A", "#3E9E9E"];

function avatarColor(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function money(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toFixed(2);
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
}

const MOCK_CREATORS = [
  { id: "c1", name: "Reva Okonkwo", professions: ["Musician", "Music Producer"], bio: "Making low end feel good since 2016.", pickFee: 60, subscribed: true, picked: 214, posts: [
    { id: "p1", caption: "New low end arrangement I have been sitting on for weeks. Finally happy with it.", likes: 128 },
    { id: "p2", caption: "Studio session running long tonight, worth it though.", likes: 64 },
  ]},
  { id: "c2", name: "Theo Marsh", professions: ["Software Engineer"], bio: "Backend systems, occasional rants about queues.", pickFee: 5, subscribed: false, picked: 42, posts: [
    { id: "p3", caption: "Refactored our onboarding flow this week. Cut signup drop-off noticeably.", likes: 37 },
  ]},
  { id: "c3", name: "Ines Duarte", professions: ["Dancer", "Choreographer"], bio: "Contemporary and street, open to collabs.", pickFee: 35, subscribed: true, picked: 158, posts: [
    { id: "p4", caption: "Rehearsal footage from this week, still cleaning up the transitions.", likes: 91 },
    { id: "p5", caption: "Booked a piece for a short film. More soon.", likes: 73 },
  ]},
  { id: "c4", name: "Marcus Bell", professions: ["Actor", "Content Creator"], bio: "Theater trained, camera curious.", pickFee: 5, subscribed: false, picked: 67, posts: [
    { id: "p6", caption: "Callback went well. Waiting is the hardest part of this job.", likes: 52 },
  ]},
  { id: "c5", name: "Priya Nandan", professions: ["Photographer"], bio: "Portraits and street work, based downtown.", pickFee: 45, subscribed: true, picked: 190, posts: [
    { id: "p7", caption: "Golden hour shoot from yesterday, client loved the contact sheet.", likes: 140 },
    { id: "p8", caption: "Behind the scenes from today's shoot, natural light only.", likes: 58 },
  ]},
  { id: "c6", name: "Jonah Wexler", professions: ["Comedian", "Content Creator"], bio: "Ten minutes of new material a month, no exceptions.", pickFee: 5, subscribed: false, picked: 31, posts: [
    { id: "p9", caption: "Tried five new jokes at the open mic last night. Two survived.", likes: 29 },
  ]},
  { id: "c7", name: "Sana Rhee", professions: ["Illustrator", "Content Creator"], bio: "Character design and visual development.", pickFee: 50, subscribed: true, picked: 122, posts: [
    { id: "p10", caption: "Character sheet for a personal project, three more to go.", likes: 84 },
  ]},
  { id: "c8", name: "Diego Salas", professions: ["Software Engineer", "Musician"], bio: "Writing code by day, synths by night.", pickFee: 5, subscribed: false, picked: 19, posts: [
    { id: "p11", caption: "Small tool I built to sync my drum patterns to a metronome track.", likes: 22 },
  ]},
];

const MOCK_COMMENTS = [
  { author: "Jordan K.", text: "This is incredible, following now." },
  { author: "Sam R.", text: "The talent here is unreal." },
  { author: "Alex P.", text: "Been waiting for something like this from you." },
];

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

function CircuitBackground({ style }) {
  return (
    <img
      src={ICONS + "circuit.png"}
      alt=""
      className="absolute pointer-events-none select-none"
      style={{ top: 0, left: 0, width: 150, zIndex: 0, ...style }}
    />
  );
}

function Chip({ active, children, onClick, small }) {
  return (
    <button
      onClick={onClick}
      className={"rounded-full whitespace-nowrap " + (small ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm")}
      style={{
        background: active ? THEME.gold : "transparent",
        color: active ? "#fff" : THEME.textSecondary,
        border: "1px solid " + (active ? THEME.gold : THEME.border),
        fontFamily: SANS,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function Avatar({ name, size = 44 }) {
  const c = avatarColor(name);
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: size, height: size, background: c + "26", color: c, border: "1px solid " + c + "55", fontFamily: SANS, fontWeight: 700, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </div>
  );
}

function ProfessionTabRow({ professions, active, onSelect, showAll, counts }) {
  return (
    <div className="flex gap-3.5 px-4 py-3 overflow-x-auto flex-shrink-0">
      {showAll && (
        <button onClick={() => onSelect("All")} className="flex flex-col items-center gap-1 flex-shrink-0" style={{ width: 60 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: active === "All" ? THEME.textPrimary : THEME.surface,
              boxShadow: "0 1px 3px rgba(23,21,29,0.12)",
            }}
          >
            <Sparkles size={20} color={active === "All" ? "#fff" : THEME.textSecondary} />
          </div>
          <span style={{ fontFamily: SANS, fontSize: 10.5, color: active === "All" ? THEME.textPrimary : THEME.textMuted, fontWeight: active === "All" ? 700 : 500 }}>All</span>
        </button>
      )}
      {professions.map((p, i) => {
        const Icon = PROFESSION_ICONS[p] || Sparkles;
        const color = PROFESSION_TILE_COLORS[i % 2];
        const isActive = active === p;
        return (
          <button key={p} onClick={() => onSelect && onSelect(p)} className="flex flex-col items-center gap-1 flex-shrink-0" style={{ width: 60 }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 48, height: 48, borderRadius: 14,
                background: color,
                boxShadow: isActive ? "0 0 0 2px " + THEME.textPrimary + ", 0 2px 6px rgba(23,21,29,0.18)" : "0 1px 3px rgba(23,21,29,0.15)",
              }}
            >
              <Icon size={21} color="#fff" strokeWidth={2} />
            </div>
            <span
              className="truncate w-full text-center"
              style={{ fontFamily: SANS, fontSize: 10, color: isActive ? THEME.textPrimary : THEME.textMuted, fontWeight: isActive ? 700 : 500 }}
            >
              {p}
            </span>
            {counts && (
              <span style={{ fontFamily: SANS, fontSize: 9, color: THEME.textMuted }}>{counts[p] || 0} posts</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className="fixed left-0 right-0 flex flex-col items-center gap-2 z-50 px-4" style={{ top: 14 }}>
      {toasts.map((t) => (
        <div key={t.id} className="px-4 py-2 rounded-lg text-sm" style={{ background: THEME.textPrimary, color: "#fff", fontFamily: SANS, maxWidth: 340, boxShadow: "0 6px 20px rgba(23,21,29,0.35)" }}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

function TopBar({ title, balance, onBank, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid " + THEME.borderSoft, background: THEME.surface }}>
      <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: THEME.textPrimary }}>
        {title || "PickMe"}
      </div>
      <div className="flex items-center gap-2">
        {right}
        {balance !== undefined && (
          <button onClick={onBank} className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: THEME.surfaceRaised, border: "1px solid " + THEME.border }}>
            <Wallet size={14} color={THEME.gold} />
            <span style={{ fontFamily: MONO, fontSize: 13, color: THEME.textPrimary, fontVariantNumeric: "tabular-nums" }}>{money(balance)}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen, subscribed }) {
  const items = [
    { id: "feed", icon: Home, label: "Feed" },
    { id: "search", icon: Search, label: "Search" },
    { id: "vault", icon: FolderLock, label: "Vault" },
    { id: "bank", icon: Wallet, label: "Bank" },
    { id: "profile", icon: User, label: "You" },
  ];
  return (
    <div className="flex items-center justify-around flex-shrink-0" style={{ borderTop: "1px solid " + THEME.borderSoft, background: THEME.surface, paddingTop: 8, paddingBottom: 8 }}>
      {items.map((it) => {
        const active = screen === it.id;
        const Icon = it.icon;
        return (
          <button key={it.id} onClick={() => setScreen(it.id)} className="flex flex-col items-center gap-1 px-2">
            <Icon size={21} color={active ? THEME.pink : THEME.textMuted} strokeWidth={active ? 2.3 : 1.8} />
            <span style={{ fontFamily: SANS, fontSize: 10, color: active ? THEME.pink : THEME.textMuted, fontWeight: active ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function tagOf(creator) {
  return "#" + creator.professions[0].replace(/ /g, "");
}

function FeedPost({ post, creator, onOpenProfile, onPick, liked, onToggleLike, onOpenComments, commentCount, saved, onToggleSave, onShare }) {
  const c = avatarColor(creator.name);
  const likeCount = post.likes + (liked ? 1 : 0);
  return (
    <div className="flex-shrink-0" style={{ borderBottom: "1px solid " + THEME.borderSoft, background: THEME.surface }}>
      <div className="flex items-center gap-2.5 px-3.5 pt-3.5 pb-3">
        <button onClick={() => onOpenProfile(creator)}><Avatar name={creator.name} size={36} /></button>
        <div className="flex-1 min-w-0 text-left" onClick={() => onOpenProfile(creator)}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 14, color: THEME.textPrimary }}>{creator.name}</div>
          <div style={{ fontFamily: SANS, fontSize: 11.5, color: THEME.textMuted }}>{creator.professions[0]}</div>
        </div>
        <button
          onClick={() => onPick(creator)}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 flex-shrink-0"
          style={{ background: THEME.gold, color: "#fff" }}
        >
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 12.5 }}>Pick</span>
          <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700 }}>{money(creator.pickFee)}</span>
        </button>
      </div>
      <div
        className="w-full flex items-center justify-center"
        style={{ aspectRatio: "4 / 5", background: "linear-gradient(135deg," + c + "33," + c + "08)" }}
      >
        <span style={{ fontFamily: SANS, fontSize: 12, color: c, fontWeight: 700, letterSpacing: "0.05em" }}>{tagOf(creator)}</span>
      </div>
      <div className="flex items-center gap-3 px-3.5 pt-2.5">
        <button onClick={() => onToggleLike(post.id)} aria-label="Like" className="flex items-center justify-center" style={{ width: 30, height: 30 }}>
          <img src={ICONS + "like.png"} alt="Like" style={{ width: 30, height: 30, filter: liked ? "none" : "grayscale(1) opacity(0.45)" }} />
        </button>
        <button onClick={() => onOpenComments(post, creator)} aria-label="Comments" className="relative flex items-center justify-center" style={{ width: 30, height: 30 }}>
          <img src={ICONS + "comment.png"} alt="Comments" style={{ width: 30, height: 30 }} />
          {commentCount > 0 && (
            <span className="absolute flex items-center justify-center rounded-full" style={{ top: -4, right: -6, minWidth: 16, height: 16, padding: "0 3px", background: THEME.red, color: "#fff", fontSize: 9, fontWeight: 700 }}>
              {commentCount}
            </span>
          )}
        </button>
        <button onClick={() => onShare(post, creator)} aria-label="Share" className="flex items-center justify-center" style={{ width: 26, height: 26 }}>
          <img src={ICONS + "share.png"} alt="Share" style={{ width: 26, height: 26 }} />
        </button>
        <div className="flex-1" />
        <button onClick={() => onToggleSave(post.id)} aria-label="Save">
          <Bookmark size={18} color={saved ? THEME.gold : THEME.textSecondary} fill={saved ? THEME.gold : "none"} />
        </button>
      </div>
      <div className="px-3.5 pt-1.5" style={{ fontFamily: SANS, fontSize: 12.5, color: THEME.textPrimary, fontWeight: 700 }}>
        {likeCount} likes
      </div>
      <div className="px-3.5 pt-1 pb-1.5" style={{ fontFamily: SANS, fontSize: 13, color: THEME.textSecondary, lineHeight: 1.5 }}>
        <span style={{ color: THEME.textPrimary, fontWeight: 700, marginRight: 6 }}>{creator.name}</span>
        {post.caption} <span style={{ color: THEME.blue }}>{tagOf(creator)}</span>
      </div>
      <button onClick={() => onOpenComments(post, creator)} className="block px-3.5 pb-3.5" style={{ fontFamily: SANS, fontSize: 12, color: THEME.textMuted }}>
        View all {commentCount} comments
      </button>
    </div>
  );
}

export default function PickMeApp() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [bank, setBank] = useState({ balance: 100, transactions: [] });
  const [vault, setVault] = useState({ sessions: [] });
  const [follows, setFollows] = useState([]);
  const [pickedIds, setPickedIds] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [pickRequests, setPickRequests] = useState([]);
  const [comments, setComments] = useState({});
  const [commentsFor, setCommentsFor] = useState(null); // {post, creator}
  const [activeChat, setActiveChat] = useState(null);
  const [screen, setScreen] = useState("feed");
  const [activeTab, setActiveTab] = useState("All");
  const [viewingCreator, setViewingCreator] = useState(null);
  const [pickTarget, setPickTarget] = useState(null);
  const [call, setCall] = useState(null); // {creator, phase, seconds, minimized, muted, cameraOff, password, participants}
  const [callPanel, setCallPanel] = useState(null); // null | "people" | "comments"
  const [callComments, setCallComments] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [authMode, setAuthMode] = useState("signup");
  const [formName, setFormName] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formProfessions, setFormProfessions] = useState([]);
  const timerRef = useRef(null);

  const pushToast = useCallback((text) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  useEffect(() => {
    (async () => {
      const p = await safeGet("profile");
      const b = await safeGet("bank");
      const v = await safeGet("vault");
      const f = await safeGet("follows");
      const pk = await safeGet("pickedIds");
      const sv = await safeGet("savedPosts");
      const pr = await safeGet("pickRequests");
      if (p) setProfile(p);
      if (b) setBank(b);
      if (v) setVault(v);
      if (f) setFollows(f);
      if (pk) setPickedIds(pk);
      if (sv) setSavedPosts(sv);
      if (pr) setPickRequests(pr);
      setReady(true);
    })();
  }, []);

  useEffect(() => { if (profile) safeSet("profile", profile); }, [profile]);
  useEffect(() => { if (ready) safeSet("bank", bank); }, [bank, ready]);
  useEffect(() => { if (ready) safeSet("vault", vault); }, [vault, ready]);
  useEffect(() => { if (ready) safeSet("follows", follows); }, [follows, ready]);
  useEffect(() => { if (ready) safeSet("pickedIds", pickedIds); }, [pickedIds, ready]);
  useEffect(() => { if (ready) safeSet("savedPosts", savedPosts); }, [savedPosts, ready]);
  useEffect(() => { if (ready) safeSet("pickRequests", pickRequests); }, [pickRequests, ready]);

  useEffect(() => {
    const t = setInterval(() => {
      setPickRequests((reqs) =>
        reqs.map((r) => (r.status === "pending" && Date.now() > r.respondBy ? { ...r, status: "expired" } : r))
      );
    }, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (call && call.phase === "live") {
      timerRef.current = setInterval(() => {
        setCall((c) => (c ? { ...c, seconds: c.seconds + 1 } : c));
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [call && call.phase]);

  function completeSignup() {
    if (!formName.trim() || formProfessions.length === 0) {
      pushToast("Add a name and at least one profession to continue.");
      return;
    }
    setProfile({
      name: formName.trim(),
      bio: formBio.trim() || "New on PickMe.",
      professions: formProfessions,
      subscribed: false,
      pickFee: 5,
      autoAccept: false,
      joinedAt: Date.now(),
    });
    setBank({ balance: 100, transactions: [{ id: "t0", type: "credit", amount: 100, note: "Welcome credit", ts: Date.now() }] });
    pushToast("Welcome to PickMe. $100 added so you can try a Pick.");
  }

  function toggleFollow(creatorId) {
    setFollows((f) => (f.includes(creatorId) ? f.filter((x) => x !== creatorId) : [...f, creatorId]));
  }

  function openPick(creator) {
    if (bank.balance < creator.pickFee) {
      pushToast("Not enough balance. Top up in Bank first.");
      return;
    }
    setPickTarget(creator);
  }

  function confirmPick(creator, password) {
    setPickTarget(null);
    setBank((b) => ({
      balance: +(b.balance - creator.pickFee).toFixed(2),
      transactions: [{ id: Math.random().toString(36).slice(2), type: "debit", amount: creator.pickFee, note: "Pick with " + creator.name, ts: Date.now() }, ...b.transactions],
    }));
    setPickedIds((ids) => (ids.includes(creator.id) ? ids : [creator.id, ...ids]));
    pushToast("You now have instant access to " + creator.name + "'s PickMe page.");
    setCall({ creator, phase: "connecting", seconds: 0, minimized: false, muted: false, cameraOff: false, password: password || null, participants: [] });
    setTimeout(() => setCall((c) => (c ? { ...c, phase: "live" } : c)), 1400);
  }

  function addCallParticipant(creator) {
    setCall((c) => (c && !c.participants.some((p) => p.id === creator.id) ? { ...c, participants: [...c.participants, creator] } : c));
  }

  function toggleLike(postId) {
    setLikedPosts((ids) => (ids.includes(postId) ? ids.filter((x) => x !== postId) : [...ids, postId]));
  }

  function toggleSave(postId) {
    setSavedPosts((ids) => {
      const has = ids.includes(postId);
      pushToast(has ? "Removed from saved." : "Saved. You can view this anytime but can't download it.");
      return has ? ids.filter((x) => x !== postId) : [postId, ...ids];
    });
  }

  function sharePost(post, creator) {
    pushToast("Link to " + creator.name + "'s post copied. Share it anywhere.");
  }

  function openComments(post, creator) {
    setComments((all) =>
      all[post.id] ? all : { ...all, [post.id]: MOCK_COMMENTS.slice(0, 2).map((c, i) => ({ id: "seed" + i, ...c })) }
    );
    setCommentsFor({ post, creator });
  }

  function addComment(postId, text) {
    if (!text.trim()) return;
    setComments((all) => ({
      ...all,
      [postId]: [...(all[postId] || []), { id: Math.random().toString(36).slice(2), author: profile.name, text: text.trim() }],
    }));
  }

  function endCall() {
    if (!call) return;
    const c = call.creator;
    setVault((v) => {
      const existing = v.sessions.find((s) => s.withId === c.id);
      const newFiles = [
        { id: Math.random().toString(36).slice(2), type: "video", name: "Session recording", approved: false },
        { id: Math.random().toString(36).slice(2), type: "doc", name: "Notes from call", approved: true },
      ];
      if (existing) {
        return { sessions: v.sessions.map((s) => (s.withId === c.id ? { ...s, files: [...newFiles, ...s.files] } : s)) };
      }
      return { sessions: [{ withId: c.id, withName: c.name, files: newFiles }, ...v.sessions] };
    });
    pushToast("Session ended. Files saved to Vault.");
    setCall(null);
  }

  function simulateIncomingPick() {
    if (!profile) return;
    const fee = profile.pickFee;
    const share = profile.subscribed ? +(fee * 0.8).toFixed(2) : 3;
    const id = Math.random().toString(36).slice(2);
    const req = { id, fee, share, createdAt: Date.now(), respondBy: Date.now() + 48 * 3600 * 1000, status: "pending" };
    setPickRequests((r) => [req, ...r]);
    if (profile.autoAccept) {
      pushToast("New Pick request, auto-accepting in a few seconds.");
      setTimeout(() => acceptPickRequest(id), 4000);
    } else {
      pushToast("New Pick request waiting for your response. 48hrs to respond.");
    }
  }

  function acceptPickRequest(id) {
    setPickRequests((reqs) => {
      const req = reqs.find((r) => r.id === id);
      if (!req || req.status !== "pending") return reqs;
      setBank((b) => ({
        balance: +(b.balance + req.share).toFixed(2),
        transactions: [{ id: Math.random().toString(36).slice(2), type: "credit", amount: req.share, note: "Picked by a fan, accepted", ts: Date.now() }, ...b.transactions],
      }));
      pushToast("Accepted. " + money(req.share) + " added to your Bank.");
      return reqs.map((r) => (r.id === id ? { ...r, status: "accepted" } : r));
    });
  }

  function declinePickRequest(id) {
    setPickRequests((reqs) => reqs.map((r) => (r.id === id ? { ...r, status: "declined" } : r)));
    pushToast("Pick request declined.");
  }

  function toggleAutoAccept() {
    setProfile((p) => ({ ...p, autoAccept: !p.autoAccept }));
  }

  function topUp(amount) {
    setBank((b) => ({
      balance: +(b.balance + amount).toFixed(2),
      transactions: [{ id: Math.random().toString(36).slice(2), type: "credit", amount, note: "Balance top up", ts: Date.now() }, ...b.transactions],
    }));
    pushToast(money(amount) + " added to your Bank.");
  }

  function toggleSubscription() {
    if (!profile.subscribed) {
      if (bank.balance < 50) {
        pushToast("Pick-Plus is $50 per month. Top up your Bank first.");
        return;
      }
      setBank((b) => ({
        balance: +(b.balance - 50).toFixed(2),
        transactions: [{ id: Math.random().toString(36).slice(2), type: "debit", amount: 50, note: "Pick-Plus subscription", ts: Date.now() }, ...b.transactions],
      }));
      setProfile((p) => ({ ...p, subscribed: true, pickFee: 10 }));
      pushToast("Pick-Plus active. You now earn $8 every time you're Picked.");
    } else {
      setProfile((p) => ({ ...p, subscribed: false, pickFee: 5 }));
      pushToast("Pick-Plus cancelled. You get Picked for $5 and keep $3.");
    }
  }

  if (!ready) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: 520, background: THEME.bg }}>
        <span style={{ fontFamily: SANS, color: THEME.textMuted, fontSize: 13 }}>Loading PickMe...</span>
      </div>
    );
  }

  // ---------- AUTH / ONBOARDING ----------
  if (!profile) {
    return (
      <div className="w-full flex flex-col" style={{ height: 620, background: THEME.surface, borderRadius: 20, overflow: "hidden", fontFamily: SANS }}>
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700, fontSize: 30, color: THEME.textPrimary }}>PickMe</div>
          <div style={{ color: THEME.textSecondary, fontSize: 13.5, marginTop: 6, marginBottom: 28 }}>
            Set up your page. Any profession welcome.
          </div>

          <label style={{ color: THEME.textMuted, fontSize: 12, fontWeight: 600 }}>Display name</label>
          <input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. Alex Rivers"
            className="w-full rounded-lg px-3 py-2.5 mt-1.5 mb-5"
            style={{ background: THEME.surface, border: "1px solid " + THEME.border, color: THEME.textPrimary, fontSize: 14, outline: "none" }}
          />

          <label style={{ color: THEME.textMuted, fontSize: 12, fontWeight: 600 }}>Bio</label>
          <textarea
            value={formBio}
            onChange={(e) => setFormBio(e.target.value)}
            placeholder="One line about what you do"
            rows={2}
            className="w-full rounded-lg px-3 py-2.5 mt-1.5 mb-5 resize-none"
            style={{ background: THEME.surface, border: "1px solid " + THEME.border, color: THEME.textPrimary, fontSize: 14, outline: "none" }}
          />

          <label style={{ color: THEME.textMuted, fontSize: 12, fontWeight: 600 }}>Professions</label>
          <div style={{ color: THEME.textMuted, fontSize: 11.5, marginTop: 3, marginBottom: 10 }}>
            Choose fewer for better visibility.
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {PROFESSIONS.map((p) => (
              <Chip
                key={p}
                active={formProfessions.includes(p)}
                onClick={() =>
                  setFormProfessions((fp) => (fp.includes(p) ? fp.filter((x) => x !== p) : [...fp, p]))
                }
              >
                {p}
              </Chip>
            ))}
          </div>

          <button
            onClick={completeSignup}
            className="w-full rounded-full py-3"
            style={{ background: THEME.gold, color: "#fff", fontWeight: 800, fontSize: 14.5 }}
          >
            Create my page
          </button>
        </div>
      </div>
    );
  }

  // ---------- CALL SCREEN ----------
  if (call && !call.minimized) {
    const mm = String(Math.floor(call.seconds / 60)).padStart(2, "0");
    const ss = String(call.seconds % 60).padStart(2, "0");
    return (
      <div className="w-full flex flex-col justify-between relative" style={{ height: 620, background: "#070B14", borderRadius: 20, overflow: "hidden", fontFamily: SANS }}>
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full" style={{ background: "#00000055" }}>
            <div style={{ width: 6, height: 6, borderRadius: 999, background: call.phase === "live" ? THEME.red : THEME.textMuted }} />
            <span style={{ fontFamily: MONO, fontSize: 12, color: "#fff" }}>{call.phase === "live" ? mm + ":" + ss : "connecting"}</span>
            {call.password && (
              <span className="flex items-center gap-0.5" style={{ marginLeft: 2 }}>
                <KeyRound size={11} color={THEME.gold} />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCallPanel(callPanel === "people" ? null : "people")} className="p-2 rounded-full" style={{ background: callPanel === "people" ? THEME.gold : "#00000055" }}>
              <Link2 size={15} color="#fff" />
            </button>
            <button onClick={() => setCallPanel(callPanel === "comments" ? null : "comments")} className="p-2 rounded-full" style={{ background: callPanel === "comments" ? THEME.gold : "#00000055" }}>
              <MessageCircle size={15} color="#fff" />
            </button>
            <button onClick={() => setCall((c) => ({ ...c, minimized: true }))} className="p-2 rounded-full" style={{ background: "#00000055" }}>
              <Minimize2 size={16} color="#fff" />
            </button>
          </div>
        </div>

        {call.participants.length > 0 && (
          <div className="flex items-center gap-1.5 px-4 pt-3">
            {call.participants.map((p) => (
              <div key={p.id} className="rounded-full flex items-center justify-center" style={{ width: 26, height: 26, background: avatarColor(p.name) + "55", border: "1px solid " + avatarColor(p.name) }}>
                <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>{initials(p.name)}</span>
              </div>
            ))}
            <span style={{ color: "#8A93A3", fontSize: 10.5, marginLeft: 2 }}>in conference</span>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center flex-col gap-3">
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 96, height: 96, background: avatarColor(call.creator.name) + "33", border: "2px solid " + avatarColor(call.creator.name) + "66" }}
          >
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: avatarColor(call.creator.name) }}>{initials(call.creator.name)}</span>
          </div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{call.creator.name}</div>
          <div style={{ color: "#8A93A3", fontSize: 12.5 }}>{call.phase === "connecting" ? "Connecting..." : "Pick session live"}</div>
        </div>

        <div
          className="absolute rounded-xl flex items-center justify-center"
          style={{ width: 84, height: 112, top: 66, right: 18, background: "#1A2740", border: "1px solid #2A3B57" }}
        >
          <span style={{ color: "#5E6C82", fontSize: 10.5 }}>you</span>
        </div>

        {callPanel === "people" && (
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl px-4 pt-4 pb-5" style={{ background: "#12161F", maxHeight: 260, overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13.5 }}>Add to conference</span>
              <button onClick={() => setCallPanel(null)}><X size={16} color="#8A93A3" /></button>
            </div>
            {MOCK_CREATORS.filter((c) => follows.includes(c.id) && c.id !== call.creator.id).length === 0 && (
              <div style={{ color: "#8A93A3", fontSize: 12 }}>Follow people to add them here.</div>
            )}
            <div className="flex flex-col gap-1">
              {MOCK_CREATORS.filter((c) => follows.includes(c.id) && c.id !== call.creator.id).map((c) => {
                const added = call.participants.some((p) => p.id === c.id);
                return (
                  <button key={c.id} onClick={() => addCallParticipant(c)} disabled={added} className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
                    <Avatar name={c.name} size={30} />
                    <span style={{ color: "#fff", fontSize: 13, flex: 1, textAlign: "left" }}>{c.name}</span>
                    {added ? <Check size={15} color={THEME.green} /> : <Plus size={15} color="#8A93A3" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {callPanel === "comments" && (
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl px-4 pt-4 pb-3 flex flex-col" style={{ background: "#12161F", maxHeight: 260 }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13.5 }}>Session comments</span>
              <button onClick={() => setCallPanel(null)}><X size={16} color="#8A93A3" /></button>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-2">
              {callComments.length === 0 && <div style={{ color: "#8A93A3", fontSize: 12 }}>No comments yet.</div>}
              {callComments.map((c) => (
                <div key={c.id} style={{ color: "#fff", fontSize: 12.5 }}>{c.text}</div>
              ))}
            </div>
            <CallCommentInput onSend={(text) => setCallComments((cc) => [...cc, { id: Math.random().toString(36).slice(2), text }])} />
          </div>
        )}

        <div className="flex items-center justify-center gap-4 pb-8 pt-4">
          <button onClick={() => setCall((c) => ({ ...c, muted: !c.muted }))} className="p-3.5 rounded-full" style={{ background: call.muted ? THEME.red : "#1A2740" }}>
            {call.muted ? <MicOff size={19} color="#fff" /> : <Mic size={19} color="#fff" />}
          </button>
          <button onClick={() => setCall((c) => ({ ...c, cameraOff: !c.cameraOff }))} className="p-3.5 rounded-full" style={{ background: call.cameraOff ? THEME.red : "#1A2740" }}>
            {call.cameraOff ? <VideoOff size={19} color="#fff" /> : <Video size={19} color="#fff" />}
          </button>
          <button onClick={endCall} className="p-4 rounded-full" style={{ background: THEME.red }}>
            <PhoneOff size={20} color="#fff" />
          </button>
        </div>
      </div>
    );
  }

  const feedCreators = activeTab === "All" ? MOCK_CREATORS : MOCK_CREATORS.filter((c) => c.professions.includes(activeTab));
  const feedItems = [];
  feedCreators.forEach((c) => c.posts.forEach((p) => feedItems.push({ post: p, creator: c })));

  return (
    <div className="w-full flex flex-col relative" style={{ height: 620, background: THEME.bg, borderRadius: 20, overflow: "hidden", fontFamily: SANS }}>
      <Toast toasts={toasts} />

      {call && call.minimized && (
        <button
          onClick={() => setCall((c) => ({ ...c, minimized: false }))}
          className="absolute left-3 right-3 flex items-center justify-between px-3.5 py-2.5 rounded-xl z-40"
          style={{ top: 8, background: THEME.surfaceRaised, border: "1px solid " + THEME.gold }}
        >
          <div className="flex items-center gap-2">
            <div style={{ width: 6, height: 6, borderRadius: 999, background: THEME.red }} />
            <span style={{ fontSize: 12.5, color: THEME.textPrimary, fontWeight: 600 }}>Pick with {call.creator.name} minimized</span>
          </div>
          <Maximize2 size={15} color={THEME.gold} />
        </button>
      )}

      {viewingCreator && (
        <ProfileOverlay
          creator={viewingCreator}
          onClose={() => setViewingCreator(null)}
          onPick={openPick}
          following={follows.includes(viewingCreator.id)}
          onToggleFollow={() => toggleFollow(viewingCreator.id)}
        />
      )}

      {pickTarget && (
        <PickSheet creator={pickTarget} onCancel={() => setPickTarget(null)} onConfirm={(password) => confirmPick(pickTarget, password)} />
      )}

      {commentsFor && (
        <CommentsOverlay
          post={commentsFor.post}
          creator={commentsFor.creator}
          comments={comments[commentsFor.post.id] || []}
          onClose={() => setCommentsFor(null)}
          onSubmit={(text) => addComment(commentsFor.post.id, text)}
        />
      )}

      {activeChat && (
        <ChatThread creator={activeChat} onClose={() => setActiveChat(null)} />
      )}

      {screen === "feed" && (
        <>
          <TopBar
            balance={bank.balance}
            onBank={() => setScreen("bank")}
            right={
              <>
                <button onClick={() => setScreen("search")} className="flex items-center justify-center" style={{ width: 28, height: 28 }}>
                  <img src={ICONS + "search.png"} alt="Search" style={{ width: 28, height: 28 }} />
                </button>
                <button onClick={() => setScreen("chats")} className="p-2 rounded-full" style={{ background: THEME.surfaceRaised }}>
                  <MessageSquare size={15} color={THEME.textSecondary} />
                </button>
              </>
            }
          />
          <ProfessionTabRow professions={PROFESSIONS} active={activeTab} onSelect={setActiveTab} showAll />
          <div className="flex-1 overflow-y-auto pb-2 flex flex-col">
            {feedItems.map((item, i) => (
              <FeedPost
                key={item.post.id + i}
                post={item.post}
                creator={item.creator}
                onOpenProfile={setViewingCreator}
                onPick={openPick}
                liked={likedPosts.includes(item.post.id)}
                onToggleLike={toggleLike}
                onOpenComments={openComments}
                commentCount={(comments[item.post.id] || MOCK_COMMENTS.slice(0, 2)).length}
                saved={savedPosts.includes(item.post.id)}
                onToggleSave={toggleSave}
                onShare={sharePost}
              />
            ))}
            {feedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 mt-16 text-center px-6">
                <Sparkles size={22} color={THEME.textMuted} />
                <div style={{ color: THEME.textMuted, fontSize: 12.5 }}>No posts in this career tab yet.</div>
              </div>
            )}
          </div>
        </>
      )}

      {screen === "search" && (
        <SearchScreen
          savedPosts={savedPosts}
          onOpenProfile={setViewingCreator}
          onOpenComments={openComments}
          onSelectProfession={(p) => { setActiveTab(p); setScreen("feed"); }}
        />
      )}

      {screen === "vault" && (
        <VaultScreen vault={vault} subscribed={profile.subscribed} setVault={setVault} onUpgrade={() => setScreen("settings")} />
      )}

      {screen === "bank" && (
        <BankScreen
          bank={bank}
          profile={profile}
          onTopUp={topUp}
          onSubscribeToggle={toggleSubscription}
          onSimulatePick={simulateIncomingPick}
          pickRequests={pickRequests}
          onAcceptRequest={acceptPickRequest}
          onDeclineRequest={declinePickRequest}
        />
      )}

      {screen === "profile" && (
        <MyProfileScreen
          profile={profile}
          bank={bank}
          pickedCount={pickedIds.length}
          onSettings={() => setScreen("settings")}
          onOpenPicked={() => setScreen("pickedBoard")}
        />
      )}

      {screen === "pickedBoard" && (
        <PickedBoardScreen
          creators={MOCK_CREATORS.filter((c) => pickedIds.includes(c.id))}
          onBack={() => setScreen("profile")}
          onOpenProfile={setViewingCreator}
        />
      )}

      {screen === "chats" && (
        <ChatsScreen creators={MOCK_CREATORS.filter((c) => follows.includes(c.id)).slice(0, 5)} onOpenChat={setActiveChat} onBack={() => setScreen("feed")} />
      )}

      {screen === "settings" && (
        <SettingsScreen
          profile={profile}
          onSubscribeToggle={toggleSubscription}
          onToggleAutoAccept={toggleAutoAccept}
          onSimulatePick={simulateIncomingPick}
          onBack={() => setScreen("profile")}
          onLogout={() => { setProfile(null); safeSet("profile", null); }}
        />
      )}

      {screen !== "settings" && screen !== "pickedBoard" && screen !== "chats" && (
        <BottomNav screen={screen} setScreen={setScreen} subscribed={profile.subscribed} />
      )}
    </div>
  );
}

function ProfileOverlay({ creator, onClose, onPick, following, onToggleFollow }) {
  const c = avatarColor(creator.name);
  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ background: THEME.bg }}>
      <div className="flex items-center px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid " + THEME.borderSoft }}>
        <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: THEME.surface }}>
          <X size={16} color={THEME.textSecondary} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 relative">
        <CircuitBackground style={{ top: 30, opacity: 0.85 }} />
        <div className="relative z-10 flex items-start justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="rounded-full flex items-center justify-center" style={{ width: 52, height: 52, background: c + "26", border: "1px solid " + c + "55" }}>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, color: c }}>{initials(creator.name)}</span>
            </div>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700, fontSize: 21, color: THEME.textPrimary }}>{creator.name}</div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1">
              <Sparkles size={12} color={THEME.gold} />
              <span style={{ color: THEME.textSecondary, fontSize: 11.5 }}>{creator.picked} picked</span>
            </div>
            <button onClick={onToggleFollow} className="rounded-full px-3.5 py-1.5" style={{ background: following ? THEME.surface : THEME.blue, border: "1px solid " + (following ? THEME.border : THEME.blue), color: following ? THEME.textPrimary : "#fff", fontWeight: 700, fontSize: 12.5 }}>
              {following ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        <div className="relative z-10">
          <ProfessionTabRow professions={creator.professions} active={null} />
        </div>

        <div className="relative z-10" style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", margin: "4px 0 8px" }}>ABOUT</div>
        <div className="relative z-10" style={{ color: THEME.textSecondary, fontSize: 13.5, lineHeight: 1.5, marginBottom: 18 }}>{creator.bio}</div>

        <button onClick={() => onPick(creator)} className="relative z-10 w-full rounded-full py-2.5 flex items-center justify-center gap-1.5 mb-6" style={{ background: THEME.gold, color: "#fff", fontWeight: 800, fontSize: 13.5 }}>
          Pick <span style={{ fontFamily: MONO }}>{money(creator.pickFee)}</span>
        </button>

        <div className="relative z-10" style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>POSTS</div>
        <div className="relative z-10 grid grid-cols-2 gap-2.5">
          {creator.posts.map((p) => (
            <div key={p.id} className="rounded-xl p-3 flex flex-col justify-end" style={{ height: 100, background: "linear-gradient(135deg," + c + "22," + c + "05)", border: "1px solid " + c + "30" }}>
              <span style={{ color: THEME.textSecondary, fontSize: 11, lineHeight: 1.4 }}>{p.caption.slice(0, 60)}...</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PickSheet({ creator, onCancel, onConfirm }) {
  const [wantsPassword, setWantsPassword] = useState(false);
  const [password, setPassword] = useState("");
  return (
    <div className="absolute inset-0 z-40 flex items-end" style={{ background: "#00000088" }}>
      <div className="w-full rounded-t-3xl px-5 pt-5 pb-6" style={{ background: THEME.surfaceRaised, border: "1px solid " + THEME.border }}>
        <div className="flex items-center justify-between mb-4">
          <span style={{ color: THEME.textPrimary, fontWeight: 800, fontSize: 16 }}>Confirm Pick</span>
          <button onClick={onCancel}><X size={18} color={THEME.textMuted} /></button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={creator.name} size={44} />
          <div>
            <div style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 14.5 }}>{creator.name}</div>
            <div style={{ color: THEME.textMuted, fontSize: 12 }}>{creator.professions.join(", ")}</div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-2" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
          <span style={{ color: THEME.textSecondary, fontSize: 13 }}>Pick fee</span>
          <span style={{ fontFamily: MONO, color: THEME.gold, fontWeight: 700, fontSize: 15 }}>{money(creator.pickFee)}</span>
        </div>

        <button onClick={() => setWantsPassword((w) => !w)} className="flex items-center gap-2 px-1 py-2.5 w-full" >
          <div className="flex items-center justify-center rounded" style={{ width: 18, height: 18, background: wantsPassword ? THEME.gold : THEME.surface, border: "1px solid " + (wantsPassword ? THEME.gold : THEME.border) }}>
            {wantsPassword && <Check size={12} color="#fff" />}
          </div>
          <KeyRound size={14} color={THEME.textSecondary} />
          <span style={{ color: THEME.textSecondary, fontSize: 12.5 }}>Password protect this room</span>
        </button>
        {wantsPassword && (
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set a room password"
            className="w-full rounded-lg px-3 py-2 mb-2"
            style={{ background: THEME.surface, border: "1px solid " + THEME.border, color: THEME.textPrimary, fontSize: 13, outline: "none" }}
          />
        )}

        <div style={{ color: THEME.textMuted, fontSize: 11.5, marginBottom: 18, marginTop: 6 }}>
          Opens a video call by default. You can minimize into your workspace once connected.
        </div>
        <button onClick={() => onConfirm(wantsPassword ? password : null)} className="w-full rounded-full py-3" style={{ background: THEME.gold, color: "#fff", fontWeight: 800, fontSize: 14.5 }}>
          Confirm and connect
        </button>
      </div>
    </div>
  );
}

function CallCommentInput({ onSend }) {
  const [text, setText] = useState("");
  function submit() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        placeholder="Write a comment..."
        className="flex-1 rounded-full px-3.5 py-2"
        style={{ background: "#1A2740", border: "1px solid #2A3B57", color: "#fff", fontSize: 12.5, outline: "none" }}
      />
      <button onClick={submit} className="p-2 rounded-full flex-shrink-0" style={{ background: THEME.gold }}>
        <Send size={14} color="#fff" />
      </button>
    </div>
  );
}

function CommentsOverlay({ post, creator, comments, onClose, onSubmit }) {
  const [text, setText] = useState("");
  return (
    <div className="absolute inset-0 z-40 flex flex-col" style={{ background: THEME.bg }}>
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid " + THEME.borderSoft }}>
        <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: THEME.surface }}>
          <X size={16} color={THEME.textSecondary} />
        </button>
        <span style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 14.5 }}>Comments</span>
        <div style={{ width: 30 }} />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {comments.length === 0 && (
          <div style={{ color: THEME.textMuted, fontSize: 12.5, textAlign: "center", marginTop: 24 }}>No comments yet. Be the first.</div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-2.5">
            <Avatar name={c.author} size={30} />
            <div>
              <span style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 12.5, marginRight: 6 }}>{c.author}</span>
              <span style={{ color: THEME.textSecondary, fontSize: 12.5 }}>{c.text}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2.5 px-3.5 py-3 flex-shrink-0" style={{ borderTop: "1px solid " + THEME.borderSoft }}>
        <Avatar name={creator.name} size={28} />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              onSubmit(text);
              setText("");
            }
          }}
          placeholder="Write a comment..."
          className="flex-1 rounded-full px-3.5 py-2"
          style={{ background: THEME.surface, border: "1px solid " + THEME.border, color: THEME.textPrimary, fontSize: 13, outline: "none" }}
        />
        <button
          onClick={() => { if (text.trim()) { onSubmit(text); setText(""); } }}
          className="p-2 rounded-full flex-shrink-0"
          style={{ background: THEME.gold }}
        >
          <Send size={15} color="#fff" />
        </button>
      </div>
    </div>
  );
}

function ChatsScreen({ creators, onOpenChat, onBack }) {
  return (
    <>
      <TopBar title="Chats" right={
        <button onClick={onBack} className="p-2 rounded-full" style={{ background: THEME.surfaceRaised }}>
          <ArrowLeft size={15} color={THEME.textSecondary} />
        </button>
      } />
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {creators.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 mt-16 text-center px-6">
            <MessageSquare size={24} color={THEME.textMuted} />
            <div style={{ color: THEME.textMuted, fontSize: 12.5 }}>Follow creators to start chatting with them.</div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          {creators.map((c) => (
            <button key={c.id} onClick={() => onOpenChat(c)} className="flex items-center gap-3 px-2 py-2.5 rounded-xl">
              <Avatar name={c.name} size={42} />
              <div className="flex-1 min-w-0 text-left">
                <div style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 13.5 }}>{c.name}</div>
                <div style={{ color: THEME.textMuted, fontSize: 12, marginTop: 1 }}>Say hi to start the conversation</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function ChatThread({ creator, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: Math.random().toString(36).slice(2), from: "me", text: text.trim() }]);
    setText("");
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col" style={{ background: THEME.bg }}>
      <div className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid " + THEME.borderSoft }}>
        <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: THEME.surface }}>
          <ArrowLeft size={16} color={THEME.textSecondary} />
        </button>
        <Avatar name={creator.name} size={30} />
        <span style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 14 }}>{creator.name}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.length === 0 && (
          <div style={{ color: THEME.textMuted, fontSize: 12.5, textAlign: "center", marginTop: 24 }}>Say hi to {creator.name}.</div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="self-end rounded-2xl px-3.5 py-2" style={{ background: THEME.gold, color: "#fff", maxWidth: "75%" }}>
            <span style={{ fontSize: 13 }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2.5 px-3.5 py-3 flex-shrink-0" style={{ borderTop: "1px solid " + THEME.borderSoft }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Message..."
          className="flex-1 rounded-full px-3.5 py-2"
          style={{ background: THEME.surface, border: "1px solid " + THEME.border, color: THEME.textPrimary, fontSize: 13, outline: "none" }}
        />
        <button onClick={send} className="p-2 rounded-full flex-shrink-0" style={{ background: THEME.gold }}>
          <Send size={15} color="#fff" />
        </button>
      </div>
    </div>
  );
}

function PickedBoardScreen({ creators, onBack, onOpenProfile }) {
  return (
    <>
      <TopBar title="Picked" right={
        <button onClick={onBack} className="p-2 rounded-full" style={{ background: THEME.surfaceRaised }}>
          <ArrowLeft size={15} color={THEME.textSecondary} />
        </button>
      } />
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>
          1 BOARD, {creators.length} CARDS
        </div>
        {creators.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 mt-16 text-center px-6">
            <Sparkles size={24} color={THEME.textMuted} />
            <div style={{ color: THEME.textMuted, fontSize: 12.5 }}>Creators you Pick will be saved here.</div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          {creators.map((c) => {
            const col = avatarColor(c.name);
            return (
              <button
                key={c.id}
                onClick={() => onOpenProfile(c)}
                className="rounded-xl p-3 flex flex-col items-center gap-2"
                style={{ background: "linear-gradient(135deg," + col + "22," + col + "05)", border: "1px solid " + col + "30" }}
              >
                <Avatar name={c.name} size={44} />
                <span style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 12.5 }}>{c.name}</span>
                <span style={{ color: THEME.textMuted, fontSize: 10.5 }}>{c.professions[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function SearchScreen({ savedPosts, onOpenProfile, onOpenComments, onSelectProfession }) {
  const [tab, setTab] = useState("explore");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase().replace(/^#/, "");

  const matchedCreators = q
    ? MOCK_CREATORS.filter((c) => c.name.toLowerCase().includes(q) || c.professions.some((p) => p.toLowerCase().includes(q)))
    : [];
  const matchedPosts = q
    ? MOCK_CREATORS.flatMap((c) => c.posts.map((p) => ({ post: p, creator: c }))).filter(
        ({ post, creator }) => post.caption.toLowerCase().includes(q) || tagOf(creator).toLowerCase().includes("#" + q)
      )
    : [];

  const savedItems = MOCK_CREATORS.flatMap((c) => c.posts.map((p) => ({ post: p, creator: c }))).filter(({ post }) =>
    savedPosts.includes(post.id)
  );

  return (
    <>
      <TopBar title="Search" />
      <div className="flex gap-2 px-4 pt-3 pb-1 flex-shrink-0">
        <Chip active={tab === "explore"} onClick={() => setTab("explore")} small>Explore</Chip>
        <Chip active={tab === "saved"} onClick={() => setTab("saved")} small>Saved ({savedPosts.length})</Chip>
      </div>

      {tab === "explore" && (
        <>
          <div className="px-4 pt-2 pb-2 flex-shrink-0">
            <div className="flex items-center gap-2 rounded-full px-3.5 py-2.5" style={{ background: THEME.surface, border: "1px solid " + THEME.border }}>
              <img src={ICONS + "search.png"} alt="" style={{ width: 18, height: 18 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users, careers, or #description"
                className="flex-1 bg-transparent outline-none"
                style={{ color: THEME.textPrimary, fontSize: 13.5 }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {q ? (
              <>
                {matchedCreators.length > 0 && (
                  <>
                    <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", margin: "6px 0 10px" }}>USERS &amp; CAREERS</div>
                    <div className="flex flex-col gap-2 mb-4">
                      {matchedCreators.map((c) => (
                        <button key={c.id} onClick={() => onOpenProfile(c)} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
                          <Avatar name={c.name} size={34} />
                          <div className="text-left">
                            <div style={{ color: THEME.textPrimary, fontSize: 13.5, fontWeight: 700 }}>{c.name}</div>
                            <div style={{ color: THEME.textMuted, fontSize: 11.5 }}>{c.professions.join(", ")}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {matchedPosts.length > 0 && (
                  <>
                    <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", margin: "6px 0 10px" }}>POSTS</div>
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      {matchedPosts.map(({ post, creator }) => {
                        const col = avatarColor(creator.name);
                        return (
                          <button key={post.id} onClick={() => onOpenComments(post, creator)} className="rounded-xl p-3 flex flex-col justify-end text-left" style={{ height: 100, background: "linear-gradient(135deg," + col + "22," + col + "05)", border: "1px solid " + col + "30" }}>
                            <span style={{ color: THEME.textSecondary, fontSize: 11, lineHeight: 1.4 }}>{post.caption.slice(0, 50)}...</span>
                            <span style={{ color: col, fontSize: 10, fontWeight: 700, marginTop: 4 }}>{tagOf(creator)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
                {matchedCreators.length === 0 && matchedPosts.length === 0 && (
                  <div style={{ color: THEME.textMuted, fontSize: 12.5, textAlign: "center", marginTop: 24 }}>No matches for "{query}".</div>
                )}
              </>
            ) : (
              <>
                <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>ALL PROFESSIONS</div>
                <div className="flex flex-col gap-2">
                  {PROFESSIONS.map((p) => {
                    const count = MOCK_CREATORS.filter((c) => c.professions.includes(p)).length;
                    return (
                      <button key={p} onClick={() => onSelectProfession(p)} className="flex items-center justify-between px-3.5 py-3 rounded-xl" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
                        <span style={{ color: THEME.textPrimary, fontSize: 14, fontWeight: 600 }}>{p}</span>
                        <div className="flex items-center gap-1.5">
                          <span style={{ color: THEME.textMuted, fontSize: 12 }}>{count}</span>
                          <ChevronRight size={15} color={THEME.textMuted} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {tab === "saved" && (
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div style={{ color: THEME.textMuted, fontSize: 11.5, lineHeight: 1.5, marginBottom: 14 }}>
            Saved for later reference. Saved items can't be downloaded, but links can still be shared.
          </div>
          {savedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 mt-16 text-center px-6">
              <Bookmark size={24} color={THEME.textMuted} />
              <div style={{ color: THEME.textMuted, fontSize: 12.5 }}>Bookmark a post to find it here later.</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {savedItems.map(({ post, creator }) => {
                const col = avatarColor(creator.name);
                return (
                  <button key={post.id} onClick={() => onOpenComments(post, creator)} className="rounded-xl p-3 flex flex-col justify-end text-left" style={{ height: 100, background: "linear-gradient(135deg," + col + "22," + col + "05)", border: "1px solid " + col + "30" }}>
                    <span style={{ color: THEME.textSecondary, fontSize: 11, lineHeight: 1.4 }}>{post.caption.slice(0, 50)}...</span>
                    <span style={{ color: col, fontSize: 10, fontWeight: 700, marginTop: 4 }}>{tagOf(creator)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function VaultScreen({ vault, subscribed, setVault, onUpgrade }) {
  const [query, setQuery] = useState("");

  if (!subscribed) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
        <Lock size={26} color={THEME.textMuted} />
        <div style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 15.5 }}>Vault is a Pick-Plus feature</div>
        <div style={{ color: THEME.textMuted, fontSize: 12.5, lineHeight: 1.5 }}>
          Subscribe to Pick-Plus to store files shared during your Pick sessions.
        </div>
        <button onClick={onUpgrade} className="rounded-full px-5 py-2.5 mt-2" style={{ background: THEME.gold, color: "#fff", fontWeight: 700, fontSize: 13 }}>
          Go to Settings
        </button>
      </div>
    );
  }

  function toggleApprove(sessionId, fileId) {
    setVault((v) => ({
      sessions: v.sessions.map((s) =>
        s.withId === sessionId ? { ...s, files: s.files.map((f) => (f.id === fileId ? { ...f, approved: !f.approved } : f)) } : s
      ),
    }));
  }

  const q = query.trim().toLowerCase();
  const sessions = q
    ? vault.sessions.filter((s) => s.withName.toLowerCase().includes(q) || s.files.some((f) => f.name.toLowerCase().includes(q)))
    : vault.sessions;

  return (
    <>
      <TopBar title="Vault" />
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <div className="flex items-center gap-2 rounded-full px-3.5 py-2.5" style={{ background: THEME.surfaceRaised, border: "1px solid " + THEME.border }}>
          <img src={ICONS + "search.png"} alt="" style={{ width: 18, height: 18 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search past conversations and files"
            className="flex-1 bg-transparent outline-none"
            style={{ color: THEME.textPrimary, fontSize: 13 }}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {vault.sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 mt-16 text-center px-6">
            <FolderLock size={24} color={THEME.textMuted} />
            <div style={{ color: THEME.textMuted, fontSize: 12.5 }}>Files shared during a Pick session will show up here.</div>
          </div>
        )}
        {vault.sessions.length > 0 && sessions.length === 0 && (
          <div style={{ color: THEME.textMuted, fontSize: 12.5, textAlign: "center", marginTop: 24 }}>No matches for "{query}".</div>
        )}
        {sessions.map((s) => (
          <div key={s.withId} className="mb-4 rounded-xl overflow-hidden" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
            <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ borderBottom: "1px solid " + THEME.borderSoft }}>
              <Avatar name={s.withName} size={30} />
              <span style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 13.5 }}>{s.withName}</span>
            </div>
            {s.files.map((f) => (
              <div key={f.id} className="flex items-center justify-between px-3.5 py-2.5" style={{ borderBottom: "1px solid " + THEME.borderSoft }}>
                <div className="flex items-center gap-2.5">
                  {f.type === "video" ? <Film size={16} color={THEME.blue} /> : f.type === "audio" ? <Music2 size={16} color={THEME.blue} /> : <FileText size={16} color={THEME.blue} />}
                  <span style={{ color: THEME.textSecondary, fontSize: 12.5 }}>{f.name}</span>
                </div>
                <button
                  onClick={() => toggleApprove(s.withId, f.id)}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1"
                  style={{ background: f.approved ? THEME.green + "22" : THEME.surfaceRaised, border: "1px solid " + (f.approved ? THEME.green : THEME.border) }}
                >
                  {f.approved ? <Download size={12} color={THEME.green} /> : <Lock size={12} color={THEME.textMuted} />}
                  <span style={{ fontSize: 10.5, color: f.approved ? THEME.green : THEME.textMuted, fontWeight: 600 }}>{f.approved ? "Approved" : "Locked"}</span>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function timeLeft(ms) {
  if (ms <= 0) return "expired";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h + "h " + m + "m left";
}

function BankScreen({ bank, profile, onTopUp, onSubscribeToggle, onSimulatePick, pickRequests, onAcceptRequest, onDeclineRequest }) {
  const pending = pickRequests.filter((r) => r.status === "pending");
  return (
    <>
      <TopBar title="Bank" />
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-2xl px-5 py-5 mb-4" style={{ background: "linear-gradient(135deg,#F1E4CE,#FFFFFF)", border: "1px solid " + THEME.border }}>
          <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 600 }}>Available balance</div>
          <div style={{ fontFamily: MONO, color: THEME.textPrimary, fontSize: 32, fontWeight: 700, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{money(bank.balance)}</div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => onTopUp(50)} className="rounded-full px-4 py-1.5" style={{ background: THEME.surface, border: "1px solid " + THEME.border, color: THEME.textPrimary, fontSize: 12.5, fontWeight: 600 }}>+ $50</button>
            <button onClick={() => onTopUp(100)} className="rounded-full px-4 py-1.5" style={{ background: THEME.surface, border: "1px solid " + THEME.border, color: THEME.textPrimary, fontSize: 12.5, fontWeight: 600 }}>+ $100</button>
          </div>
        </div>

        <div className="rounded-xl px-4 py-3.5 mb-4 flex items-center justify-between" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
          <div>
            <div style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 13.5 }}>Pick-Plus</div>
            <div style={{ color: THEME.textMuted, fontSize: 11.5, marginTop: 1 }}>
              {profile.subscribed ? "Active — you earn $8 every time you're Picked" : "$50/month — earn $8 per Pick instead of $3"}
            </div>
          </div>
          <button
            onClick={onSubscribeToggle}
            className="rounded-full px-4 py-2"
            style={{ background: profile.subscribed ? THEME.surfaceRaised : THEME.gold, border: "1px solid " + (profile.subscribed ? THEME.border : THEME.gold), color: profile.subscribed ? THEME.textPrimary : "#fff", fontWeight: 700, fontSize: 12 }}
          >
            {profile.subscribed ? "Cancel" : "Subscribe"}
          </button>
        </div>

        {pending.length > 0 && (
          <>
            <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>PICK REQUESTS</div>
            <div className="flex flex-col gap-2 mb-5">
              {pending.map((r) => (
                <div key={r.id} className="rounded-xl px-4 py-3" style={{ background: THEME.pink + "12", border: "1px solid " + THEME.pink + "40" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 13 }}>You were Picked</span>
                    <span style={{ fontFamily: MONO, color: THEME.gold, fontWeight: 700, fontSize: 13 }}>+{money(r.share)}</span>
                  </div>
                  <div style={{ color: THEME.textMuted, fontSize: 11, marginBottom: 10 }}>{timeLeft(r.respondBy - Date.now())} to respond, or it reverses to the Picker's Vault</div>
                  <div className="flex gap-2">
                    <button onClick={() => onDeclineRequest(r.id)} className="flex-1 rounded-full py-1.5" style={{ background: THEME.surface, border: "1px solid " + THEME.border, color: THEME.textSecondary, fontSize: 12, fontWeight: 700 }}>Decline</button>
                    <button onClick={() => onAcceptRequest(r.id)} className="flex-1 rounded-full py-1.5" style={{ background: THEME.gold, color: "#fff", fontSize: 12, fontWeight: 700 }}>Accept</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button onClick={onSimulatePick} className="w-full flex items-center justify-center gap-2 rounded-xl py-3 mb-5" style={{ background: THEME.surface, border: "1px dashed " + THEME.border }}>
          <Bell size={14} color={THEME.textMuted} />
          <span style={{ color: THEME.textMuted, fontSize: 12, fontWeight: 600 }}>Demo: simulate someone picking you</span>
        </button>

        <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>ACTIVITY</div>
        <div className="flex flex-col gap-2">
          {bank.transactions.length === 0 && <div style={{ color: THEME.textMuted, fontSize: 12.5 }}>No activity yet.</div>}
          {bank.transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
              <div className="flex items-center gap-2.5">
                <div className="rounded-full p-1.5" style={{ background: (t.type === "credit" ? THEME.green : THEME.red) + "1F" }}>
                  {t.type === "credit" ? <ArrowDownLeft size={13} color={THEME.green} /> : <ArrowUpRight size={13} color={THEME.red} />}
                </div>
                <div>
                  <div style={{ color: THEME.textPrimary, fontSize: 12.5, fontWeight: 600 }}>{t.note}</div>
                  <div style={{ color: THEME.textMuted, fontSize: 10.5 }}>{timeAgo(t.ts)}</div>
                </div>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: t.type === "credit" ? THEME.green : THEME.red }}>
                {t.type === "credit" ? "+" : "-"}{money(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MyProfileScreen({ profile, bank, pickedCount, onSettings, onOpenPicked }) {
  const c = avatarColor(profile.name);
  return (
    <>
      <TopBar title="Your page" right={
        <button onClick={onSettings} className="p-2 rounded-full" style={{ background: THEME.surfaceRaised }}>
          <Settings size={15} color={THEME.textSecondary} />
        </button>
      } />
      <div className="flex-1 overflow-y-auto px-5 py-5 relative">
        <CircuitBackground style={{ top: 30, opacity: 0.85 }} />
        <div className="relative z-10 flex items-start justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="rounded-full flex items-center justify-center" style={{ width: 52, height: 52, background: c + "26", border: "1px solid " + c + "55" }}>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, color: c }}>{initials(profile.name)}</span>
            </div>
            <div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700, fontSize: 21, color: THEME.textPrimary }}>{profile.name}</div>
              {profile.subscribed && (
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles size={12} color={THEME.gold} />
                  <span style={{ color: THEME.gold, fontSize: 11, fontWeight: 700 }}>Pick-Plus</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onOpenPicked} className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
            <Sparkles size={16} color={THEME.gold} />
            <span style={{ color: THEME.textPrimary, fontSize: 11, fontWeight: 700 }}>{pickedCount}</span>
            <span style={{ color: THEME.textMuted, fontSize: 9 }}>Picked</span>
          </button>
        </div>

        <div className="relative z-10">
          <ProfessionTabRow professions={profile.professions} active={null} />
        </div>

        <div className="relative z-10" style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", margin: "4px 0 8px" }}>ABOUT</div>
        <div className="relative z-10" style={{ color: THEME.textSecondary, fontSize: 13.5, lineHeight: 1.5, marginBottom: 20 }}>{profile.bio}</div>

        <div className="relative z-10 grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl px-4 py-3" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
            <div style={{ color: THEME.textMuted, fontSize: 11 }}>Your Pick fee</div>
            <div style={{ fontFamily: MONO, color: THEME.textPrimary, fontSize: 18, fontWeight: 700, marginTop: 2 }}>{money(profile.pickFee)}</div>
          </div>
          <div className="rounded-xl px-4 py-3" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
            <div style={{ color: THEME.textMuted, fontSize: 11 }}>Bank balance</div>
            <div style={{ fontFamily: MONO, color: THEME.textPrimary, fontSize: 18, fontWeight: 700, marginTop: 2 }}>{money(bank.balance)}</div>
          </div>
        </div>

        <div className="relative z-10" style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>YOUR POSTS</div>
        <button className="relative z-10 w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl" style={{ background: THEME.surface, border: "1px dashed " + THEME.border }}>
          <img src={ICONS + "plus.png"} alt="Add" style={{ width: 26, height: 26 }} />
          <span style={{ color: THEME.textMuted, fontSize: 12 }}>Share your first post</span>
        </button>
      </div>
    </>
  );
}

function SettingsScreen({ profile, onSubscribeToggle, onToggleAutoAccept, onSimulatePick, onBack, onLogout }) {
  return (
    <>
      <TopBar title="Settings" right={
        <button onClick={onBack} className="p-2 rounded-full" style={{ background: THEME.surfaceRaised }}>
          <X size={15} color={THEME.textSecondary} />
        </button>
      } />
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div style={{ color: THEME.textSecondary, fontSize: 12.5, lineHeight: 1.5, marginBottom: 18 }}>
          All settings can be accessed here. Our subscription tier gives access to advanced features and a Bank where you can store your money to carry out secure transactions with Picked Users.
        </div>

        <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>SUBSCRIPTION</div>
        <div className="rounded-xl px-4 py-3.5 mb-6 flex items-center justify-between" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
          <div>
            <div style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 13.5 }}>Pick-Plus</div>
            <div style={{ color: THEME.textMuted, fontSize: 11.5, marginTop: 1 }}>
              {profile.subscribed ? "Active — you earn $8 every time you're Picked" : "$50/month — earn $8 per Pick instead of $3"}
            </div>
          </div>
          <button onClick={onSubscribeToggle} className="rounded-full px-4 py-2" style={{ background: profile.subscribed ? THEME.surfaceRaised : THEME.gold, border: "1px solid " + (profile.subscribed ? THEME.border : THEME.gold), color: profile.subscribed ? THEME.textPrimary : "#fff", fontWeight: 700, fontSize: 12 }}>
            {profile.subscribed ? "Cancel" : "Subscribe"}
          </button>
        </div>

        <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>PICK REQUESTS</div>
        <div className="rounded-xl px-4 py-3.5 mb-6 flex items-center justify-between" style={{ background: THEME.surface, border: "1px solid " + THEME.borderSoft }}>
          <div>
            <div style={{ color: THEME.textPrimary, fontWeight: 700, fontSize: 13.5 }}>Auto-accept Picks</div>
            <div style={{ color: THEME.textMuted, fontSize: 11.5, marginTop: 1 }}>Auto-connect after a countdown, instead of manually accepting each request</div>
          </div>
          <button onClick={onToggleAutoAccept} className="flex items-center rounded-full flex-shrink-0" style={{ width: 42, height: 24, padding: 3, background: profile.autoAccept ? THEME.gold : THEME.border }}>
            <div className="rounded-full" style={{ width: 18, height: 18, background: "#fff", marginLeft: profile.autoAccept ? 18 : 0, transition: "margin 0.15s" }} />
          </button>
        </div>

        <div style={{ color: THEME.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>DEMO TOOLS</div>
        <button onClick={onSimulatePick} className="w-full flex items-center justify-center gap-2 rounded-xl py-3 mb-6" style={{ background: THEME.surface, border: "1px dashed " + THEME.border }}>
          <Bell size={14} color={THEME.textMuted} />
          <span style={{ color: THEME.textMuted, fontSize: 12, fontWeight: 600 }}>Simulate an incoming Pick</span>
        </button>

        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 rounded-xl py-3" style={{ background: THEME.red + "15", border: "1px solid " + THEME.red + "44" }}>
          <LogOut size={14} color={THEME.red} />
          <span style={{ color: THEME.red, fontSize: 13, fontWeight: 700 }}>Log out and reset</span>
        </button>
      </div>
    </>
  );
}
