import { PromptStateProvider } from "../context";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { useDerivedState } from "../use-derived-state";
import { usePromptStateCacheValue } from "../prompt-state-cache";
import { EXAMPLES } from "../example";
import { useMediaQuery } from "@mantine/hooks";
import { DocSaver } from "./doc-saver";
import { DevelopViewSmall } from "./develop-view-small";
import { DevelopViewFull } from "./develop-view-full";
import { DevelopViewMode } from "./develop-view-mode";
import { ErrorMessage } from "../error-message";

export function DevelopView({ mode }: { mode: DevelopViewMode }) {
  const params = useParams<"id">();
  const idFromUrl = params.id ?? "blank";
  const isExamplePrompt = idFromUrl in EXAMPLES;
  const [id] = useDerivedState(
    () => (isExamplePrompt ? nanoid() : idFromUrl),
    [idFromUrl]
  );
  const { data, error, loading } = usePromptStateCacheValue(
    id,
    EXAMPLES[idFromUrl]
  );
  const isSmallScreen = useMediaQuery("(max-width: 800px)");

  if (data) {
    return (
      <PromptStateProvider value={data}>
        <DocSaver idFromUrl={idFromUrl} />
        {isSmallScreen ? <DevelopViewSmall mode={mode} /> : <DevelopViewFull />}
      </PromptStateProvider>
    );
  }

  if (loading) {
    return null;
  }

  return <ErrorMessage error={error} />;
}
