import { Button } from "@mantine/core";
import { IconGitFork } from "@tabler/icons-react";
import { isReadOnly } from "./core/prompt-state";
import { usePromptState } from "./context";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useProxyState } from "./use-proxy-state";
import { loadPromptState } from "./prompt-state-cache";

export function ForkPromptButton() {
  const promptState = usePromptState();
  const readOnly = isReadOnly(promptState);
  const navigate = useNavigate();
  const state = useProxyState({
    isForking: false,
  });

  if (!readOnly) {
    return null;
  }

  return (
    <Button
      leftIcon={<IconGitFork size="1em" />}
      variant="default"
      compact
      loading={state.isForking}
      loaderProps={{ size: "1em" }}
      onClick={async () => {
        try {
          state.isForking = true;
          const id = nanoid();
          const forkedPromptState = await loadPromptState(id, promptState.doc);
          forkedPromptState.isDirty = true;
          navigate(`/prompt/${id}`, { replace: true });
        } finally {
          state.isForking = false;
        }
      }}
    >
      Fork
    </Button>
  );
}
