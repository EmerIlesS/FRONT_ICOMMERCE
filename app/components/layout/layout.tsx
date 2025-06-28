import { Box } from "@chakra-ui/react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex="1">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
