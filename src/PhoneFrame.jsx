const SCREEN_W = 390;
const SCREEN_H = 620;

export default function PhoneFrame({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 0%, #1c2333, #05070c)",
        padding: 32,
        boxSizing: "border-box",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "26px 14px 22px",
          background: "linear-gradient(160deg,#2b2f38,#0c0d10)",
          borderRadius: 52,
          boxShadow: "0 30px 60px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ position: "absolute", left: -3, top: 118, width: 3, height: 30, background: "#0c0d10", borderRadius: 2 }} />
        <div style={{ position: "absolute", left: -3, top: 162, width: 3, height: 58, background: "#0c0d10", borderRadius: 2 }} />
        <div style={{ position: "absolute", left: -3, top: 232, width: 3, height: 58, background: "#0c0d10", borderRadius: 2 }} />
        <div style={{ position: "absolute", right: -3, top: 178, width: 3, height: 78, background: "#0c0d10", borderRadius: 2 }} />

        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 118,
            height: 26,
            background: "#0c0d10",
            borderRadius: 16,
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1c1d22", border: "1px solid #2a2b30" }} />
          <div style={{ width: 34, height: 5, borderRadius: 3, background: "#1c1d22" }} />
        </div>

        <div
          style={{
            width: SCREEN_W,
            height: SCREEN_H,
            maxWidth: "calc(100vw - 76px)",
            borderRadius: 20,
            overflow: "hidden",
            background: "#0B1220",
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {children}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 4,
            borderRadius: 3,
            background: "rgba(255,255,255,0.35)",
          }}
        />
      </div>
    </div>
  );
}
