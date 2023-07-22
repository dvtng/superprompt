import { useSnapshot } from "valtio";
import { ConvoPane } from "./convo-pane";
import { InputForm } from "./input-form";
import { Messages } from "./messages";
import { usePromptStateContext } from "../context";
import { MessageBox } from "./message-box";
import { Box } from "@mantine/core";

export function ConvoView() {
  const promptState = usePromptStateContext();
  const _promptState = useSnapshot(promptState);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "1fr auto",
        height: "100%",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <ConvoPane>
        {_promptState.content.length > 0 ? <InputForm /> : null}
        <Messages />
      </ConvoPane>
      {_promptState.messages.length > 0 ? <MessageBox /> : null}
    </Box>
  );
}
