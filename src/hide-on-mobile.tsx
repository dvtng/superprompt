import { Box } from "@mantine/core";
import { ReactNode } from "react";

export function HideOnMobile({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        "@media (max-width: 600px)": {
          display: "none",
        },
      }}
    >
      {children}
    </Box>
  );
}
