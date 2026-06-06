export const metadata = {
  title: "My Watchlist",
  description: "A personal movie watchlist",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
