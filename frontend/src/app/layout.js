import "./globals.css";

export const metadata = {
  title: "Multi-Agent AI Software Engineering Team Dashboard",
  description: "Interactive dashboard coordinating planning, development, QA, security, and deployment agents.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
