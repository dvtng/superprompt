import { DocPreview } from "./doc-preview";
import EXAMPLE_GRADE from "../example/lib/grade";
import EXAMPLE_EXPERTS from "../example/lib/experts";
import EXAMPLE_ASSIMILATE_TONE from "../example/lib/assimilate-tone";
import EXAMPLE_CHARACTER from "../example/lib/character";
import EXAMPLE_AGENT from "../example/lib/agent";

export const EXAMPLES = [
  EXAMPLE_GRADE,
  EXAMPLE_EXPERTS,
  EXAMPLE_ASSIMILATE_TONE,
  EXAMPLE_CHARACTER,
  EXAMPLE_AGENT,
];

export function ExampleDocList() {
  return (
    <>
      {EXAMPLES.map((promptDoc) => (
        <DocPreview key={promptDoc.id} promptDoc={promptDoc} />
      ))}
    </>
  );
}
