// app/layout.tsx
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { StyledRoot } from "./ui/StyledRoot";
import { Providers } from "./components/Providers";
import "./ui/globals.css";
import AuthGuard from "../src/components/AuthGuard";
import { CustomerProvider } from "../app/contexts/CustomerContext";
import { PropertyProvider } from "../app/contexts/PropertyContext";
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
      <head>
        <meta name="theme-color" content="#000" />
      </head>
      <body>
        <Providers>
          <AppRouterCacheProvider>
            <StyledRoot>
              {" "}
              <AuthGuard>
                <PropertyProvider>
                  <CustomerProvider>{children}</CustomerProvider>
                </PropertyProvider>
              </AuthGuard>
            </StyledRoot>
          </AppRouterCacheProvider>
        </Providers>
      </body>
    </html>
  );
}
