import { Stack, Flex, Title, Button, Divider, Box } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { DocPreview } from "./doc-preview";
import { useDocList, usePromptStateContext } from "../context";
import { useSnapshot } from "valtio";
import { getLayerBgColor } from "../color";

export function DocBrowser() {
  const docs = useDocList();
  const promptState = usePromptStateContext();
  const _promptState = useSnapshot(promptState);

  return (
    <Stack sx={{ height: "100%", overflow: "auto", padding: "0 1rem 1rem" }}>
      <Flex
        align="center"
        justify="space-between"
        sx={(theme) => ({
          background: getLayerBgColor(theme),
          margin: "-1rem -1rem 0",
          padding: "1.25rem 1rem 0.5rem",
          position: "sticky",
          top: 0,
          zIndex: 1,
        })}
      >
        <Title order={5} sx={{ fontWeight: "normal" }}>
          My prompts
        </Title>
        <Button
          component={Link}
          to="/new"
          leftIcon={<IconPlus size="1.1rem" />}
          variant="subtle"
        >
          New
        </Button>
      </Flex>
      <Divider />
      {docs ? (
        <Box>
          {docs.map((doc) => (
            <DocPreview
              key={doc.id}
              promptDoc={doc}
              isActive={_promptState.id === doc.id}
            />
          ))}
        </Box>
      ) : null}
    </Stack>
  );
}
