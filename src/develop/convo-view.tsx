import { useSnapshot } from "valtio";
import { ConvoPane } from "./convo-pane";
import { InputForm } from "./input-form";
import { Messages } from "./messages";
import { usePromptState } from "../context";
import { CSSProperties } from "react";

export function ConvoView({ style }: { style?: CSSProperties }) {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);

  return (
    <ConvoPane style={style}>
      {_promptState.content.length > 0 ? <InputForm /> : null}
      <Messages />
    </ConvoPane>
  );
}
