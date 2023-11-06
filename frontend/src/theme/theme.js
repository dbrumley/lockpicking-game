import { extendTheme } from "@chakra-ui/react";
import { globalStyles } from "./styles";

export default extendTheme(
  {}, // Breakpoints
  globalStyles, // Global styles
);