import { css } from "@emotion/css";
import { Box } from "@mantine/core";
import { getLayerBgColor } from "../color";
import { DocBrowser } from "./doc-browser";
import { Editor } from "./editor";
import { ConvoView } from "./convo-view";

const styles = css`
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  height: 100%;
  margin: -1rem auto 0 auto;
  overflow: hidden;
  width: 100%;
`;

export function DevelopViewFull() {
  return (
    <Box
      className={styles}
      sx={(theme) => ({
        background: getLayerBgColor(theme),
      })}
    >
      <DocBrowser />
      <Editor />
      <ConvoView />
    </Box>
  );
}
