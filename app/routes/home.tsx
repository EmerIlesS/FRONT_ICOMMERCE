import type { Route } from "./+types/home";
import { Box } from "@chakra-ui/react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TuMercadoOnline " },
    { name: "description", content: "Welcome to TuMercadoOnline, a web application to manage your products!, colom" },
  ];
}

export default function Home() {
  return <Box bgColor={"blue.500"} textAlign="center"color="blackAlpha.950">Benvendio al icommerce TuMercadoOnline </Box>;
}
