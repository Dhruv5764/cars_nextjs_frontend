
'use client'; // Ensures this component is client-side

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import client from '../../lib/apolloClient';




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProvider client={client}>
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
    </ApolloProvider>
  );
}
