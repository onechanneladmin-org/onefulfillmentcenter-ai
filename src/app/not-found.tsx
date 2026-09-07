import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

const NotFound = () => {
  return (
    <main
      style={{
        alignItems: "center",
        background: "#070b12",
        color: "#f3f6fb",
        display: "grid",
        fontFamily: "Manrope, sans-serif",
        gap: 16,
        justifyItems: "center",
        minHeight: "100vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <p
        style={{
          color: "#2fd3c8",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.12em",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        OneFulfillCenter
      </p>
      <h1
        style={{
          fontFamily: "Sora, sans-serif",
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          letterSpacing: "-0.04em",
          margin: 0,
        }}
      >
        Page not found
      </h1>
      <p style={{ color: "#9aa6b8", margin: 0, maxWidth: 420 }}>
        This site is starting fresh with the One Fulfillment Center home page.
      </p>
      <Link
        href="/"
        style={{
          background: "#2fd3c8",
          borderRadius: 999,
          color: "#04201e",
          fontWeight: 700,
          padding: "14px 24px",
          textDecoration: "none",
        }}
      >
        Back to home
      </Link>
    </main>
  );
};

export default NotFound;
