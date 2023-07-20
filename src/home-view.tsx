import { Text, Stack, Box, Divider, Flex, Button } from "@mantine/core";
import { IconBulb, IconPlus } from "@tabler/icons-react";
import { Link, Navigate } from "react-router-dom";
import { useDocList } from "./context";
import { appState } from "./app-state";

export function HomeView() {
  const docs = useDocList();

  if (!docs) {
    return null;
  }
  if (appState.user || docs.length) {
    return <Navigate to="/me" replace={true} />;
  }

  return (
    <Stack spacing="2rem" sx={{ padding: "1rem 0" }}>
      <Stack
        sx={{
          fontSize: "3.5rem",
          fontWeight: "bold",
          "> *": {
            lineHeight: 1.1,
          },

          "@media (max-width: 600px)": {
            fontSize: "2.5rem",
          },
        }}
      >
        <Flex align="center" gap="1rem">
          <IconBulb size="2rem" style={{ marginTop: -5 }} />
          <div
            style={{
              fontSize: "1.4rem",
              fontFamily: "Nunito",
              fontWeight: "normal",
            }}
          >
            I want to make a...
          </div>
        </Flex>
        <span>
          prompt{" "}
          <Box component="span" sx={{ color: "#5B87DB" }}>
            template
          </Box>
          .
        </span>
        <span>
          character{" "}
          <Box component="span" sx={{ color: "#E4AF47" }}>
            chat
          </Box>
          .
        </span>
        <span>
          autonomous{" "}
          <Box component="span" sx={{ color: "#AF60C3" }}>
            agent
          </Box>
          .
        </span>
      </Stack>
      <Divider />
      <Text size="1.5rem" sx={{ fontFamily: "Nunito" }}>
        Prototype powerful AI systems with only a simple prompt editor.
      </Text>
      <Box>
        <Button
          size="xl"
          radius="xl"
          leftIcon={<IconPlus />}
          component={Link}
          to="/new"
        >
          Create superprompt
        </Button>
      </Box>
      <Box
        sx={{
          overflow: "hidden",
          padding: "2rem 0",
          width: "100%",
          "> img": {
            border: "1px solid white",
            borderRadius: "0.5rem",
            minWidth: "500px",
            width: "100%",
          },
        }}
      >
        <img src="/screenshot.png" alt="Superprompt screenshot" />
      </Box>
    </Stack>
  );
}
