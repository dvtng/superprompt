import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { usePromptState } from "../context";
import { saveDoc } from "../local-db";

export function DocSaver({ idFromUrl }: { idFromUrl: string }) {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const navigate = useNavigate();

  useEffect(() => {
    const shouldSave =
      _promptState.isDirty || (!_promptState.isSaved && _promptState.isRunning);

    if (!shouldSave) {
      return;
    }

    saveDoc({
      id: _promptState.id,
      content: _promptState.content,
      title: _promptState.title,
    });

    if (idFromUrl !== _promptState.id) {
      navigate(`/prompt/${_promptState.id}`, { replace: true });
    }

    promptState.isDirty = false;
    promptState.isSaved = true;
  }, [navigate, _promptState, promptState, idFromUrl]);

  return null;
}
