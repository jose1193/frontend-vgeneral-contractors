// app/layout.tsx
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { StyledRoot } from "./ui/StyledRoot";
import { Providers } from "./components/Providers";
import "./ui/globals.css";
import AuthGuard from "../src/components/AuthGuard";

export const metadata: Metadata = {
  title: process.env.NEXT_APP_NAME,
  description: process.env.NEXT_APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="theme-color" content="#000" />
      <body>
        <Providers>
          <AppRouterCacheProvider>
            <StyledRoot>
              {" "}
              <AuthGuard>{children}</AuthGuard>
            </StyledRoot>
          </AppRouterCacheProvider>
        </Providers>
      </body>
    </html>
  );
}
