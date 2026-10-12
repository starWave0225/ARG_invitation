export const metadata = {
  title: "爱可以 · 找到完美的时间线",
};

export default function PerfectEndingPage() {
  return (
    <main style={{ background: "#090b0b", minHeight: "100dvh" }}>
      <iframe
        src="/ending/perfect/preview.html"
        title="爱可以：找到完美的时间线"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{ display: "block", width: "100%", height: "100dvh", border: 0 }}
      />
    </main>
  );
}
