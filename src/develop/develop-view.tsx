import { useSnapshot } from "valtio";
import { PromptStateProvider } from "../context";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { useDerivedState } from "../use-derived-state";
import { loadPromptState, promptStates } from "../prompt-states";
import { EXAMPLES } from "../example";
import { useMediaQuery } from "@mantine/hooks";
import { DocSaver } from "./doc-saver";
import { DevelopViewSmall } from "./develop-view-small";
import { DevelopViewFull } from "./develop-view-full";
import { DevelopViewMode } from "./develop-view-mode";

export function DevelopView({ mode }: { mode: DevelopViewMode }) {
  const params = useParams<"id">();
  const idFromUrl = params.id ?? "blank";
  const isExamplePrompt = idFromUrl in EXAMPLES;
  const [id] = useDerivedState(
    () => (isExamplePrompt ? nanoid() : idFromUrl),
    [idFromUrl]
  );
  loadPromptState(id, EXAMPLES[idFromUrl]);
  const promptState = useSnapshot(promptStates)[id];
  const isSmallScreen = useMediaQuery("(max-width: 800px)");

  if (!promptState) {
    return null;
  }

  return (
    <PromptStateProvider value={promptStates[id]}>
      <DocSaver idFromUrl={idFromUrl} />
      {isSmallScreen ? <DevelopViewSmall mode={mode} /> : <DevelopViewFull />}
    </PromptStateProvider>
  );
}
