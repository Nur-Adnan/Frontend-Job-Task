import type { Metadata } from "next";

import "./styles/style.scss";
import "./styles/polygon.scss";
import "./styles/loading.scss";

import MapProvider from "./redux/MapProvide";

export const metadata: Metadata = {
  title: "Frontend Job Task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MapProvider>{children}</MapProvider>
      </body>
    </html>
  );
}
