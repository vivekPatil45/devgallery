"use client";
import Navbar from "@/components/Navbar";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" data-theme="forest">
      <head>
        <title>DevGallery</title>
        <meta
          name="description"
          content="DevGallery is a dynamic platform to explore and showcase stunning web projects. Discover creative developer portfolios, interact with unique designs, and get inspired by modern frontend and full-stack applications. Whether you're looking to share your work or find web inspiration, DevGallery connects developers and ideas in one creative space."
        />

      </head>
      <body className={`antialiased`}>
        <Toaster />
        <Navbar/>
        {children}
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <UserProvider>
        <Component>{children}</Component>
      </UserProvider>
  
  );
}
