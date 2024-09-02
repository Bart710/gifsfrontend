import "./globals.css";

export const metadata = {
  title: "GIF Manager",
  description: "Manage your GIF collection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
