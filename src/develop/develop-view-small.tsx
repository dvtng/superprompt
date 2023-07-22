import { Box, Button, useMantineTheme } from "@mantine/core";
import { getLayerBgColor, getOverlayColor } from "../color";
import { DocBrowser } from "./doc-browser";
import { DevelopViewMode } from "./develop-view-mode";
import { ConvoView } from "./convo-view";
import { Editor } from "./editor";
import { useDerivedState } from "../use-derived-state";
import { IconArrowUp } from "@tabler/icons-react";
import { usePromptStateContext } from "../context";
import { useSnapshot } from "valtio";

export function DevelopViewSmall({ mode }: { mode: DevelopViewMode }) {
  const promptState = usePromptStateContext();
  const _promptState = useSnapshot(promptState);
  const [isConvoOpen, setIsConvoOpen] = useDerivedState(
    () => false,
    [promptState.id, mode]
  );
  const theme = useMantineTheme();
  const background = getLayerBgColor(theme);

  return (
    <Box
      sx={{
        background,
        borderRadius: 8,
        height: "100%",
        margin: "-1rem auto 0 auto",
        overflow: "hidden",
      }}
    >
      {mode === "me" ? (
        <DocBrowser />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "1fr auto",
            height: "100%",
            position: "relative",
          }}
        >
          <Editor />
          {_promptState.content ? (
            <Box sx={{ background, padding: "1rem", bottom: 0 }}>
              <Button
                color="gray"
                fullWidth
                variant="outline"
                onClick={() => {
                  setIsConvoOpen(true);
                }}
              >
                <IconArrowUp />
              </Button>
            </Box>
          ) : null}
          <Box
            sx={{
              alignItems: "end",
              background: getOverlayColor(theme),
              display: "flex",
              height: "100%",
              opacity: isConvoOpen ? 1 : 0,
              pointerEvents: isConvoOpen ? "auto" : "none",
              position: "absolute",
              top: 0,
              transition: "200ms opacity ease-out",
              width: "100%",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsConvoOpen(false);
              }
            }}
          >
            <Box
              sx={{
                background,
                borderRadius: 8,
                height: "calc(100% - 4.5rem)",
                overflow: "hidden",
                position: "absolute",
                transition: "200ms transform ease-out",
                transform: `translateY(${isConvoOpen ? 0 : "100%"})`,
                width: "100%",
              }}
            >
              <ConvoView />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
