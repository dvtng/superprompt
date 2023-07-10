import { useSnapshot } from "valtio";
import { getColorForInput, updateRawPrompt } from "./core/prompt-state";
import { CSSProperties, useEffect, useState } from "react";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import {
  BaseEditor,
  BaseRange,
  createEditor,
  Descendant,
  Node,
  Text,
  Range,
} from "slate";
import { css } from "@emotion/css";
import { withHistory } from "slate-history";
import { parse } from "./core/parse";
import { useMantineTheme } from "@mantine/core";
import { NodeType, visitNodes } from "./core/ast";
import { usePromptState } from "./context";

type Paragraph = {
  type: "paragraph";
  children: CustomText[];
};

type CustomElement = Paragraph;

type CustomText = { text: string } & ExtraLeafProps;

type CustomRange = BaseRange & ExtraLeafProps;

type ExtraLeafProps = {
  isPlaceholder?: boolean;
  isInvalid?: boolean;
  identifier?: {
    name: string;
    for: NodeType;
  };
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
    Range: CustomRange;
  }
}

const styles = css`
  background: none;
  border: none;
  display: block;
  font-family: inherit;
  font-size: inherit;
  margin-top: -0.4em;
  padding: 2rem;
  width: 100%;

  > * {
    outline: none;
  }

  p {
    margin-block-start: 0.75em;
    margin-block-end: 0.75em;
  }
`;

export function PromptEditor() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const [editor] = useState(() => withReact(withHistory(createEditor())));
  const theme = useMantineTheme();

  useEffect(() => {
    setTimeout(() => {
      ReactEditor.focus(editor);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Slate
      editor={editor}
      initialValue={deserialize(_promptState.raw)}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          updateRawPrompt(promptState, serialize(value));
        }
      }}
    >
      <div className={styles}>
        <Editable
          placeholder="Enter a prompt..."
          renderElement={({ attributes, children }) => {
            return <p {...attributes}>{children}</p>;
          }}
          renderLeaf={({ attributes, children, leaf }) => {
            const style: CSSProperties = {};

            if (leaf.isPlaceholder) {
              style.fontFamily = theme.fontFamilyMonospace;
              style.fontWeight = "bold";
            }
            if (leaf.isInvalid) {
              style.color = theme.colors.red[5];
            }
            if (leaf.identifier) {
              if (leaf.identifier.for === "variable") {
                style.color =
                  theme.colors[
                    getColorForInput(_promptState, leaf.identifier.name)
                  ][theme.colorScheme === "dark" ? 4 : 6];
              } else {
                style.fontStyle = "italic";
              }
            }

            return (
              <span
                {...attributes}
                style={style}
                spellCheck={!leaf.isPlaceholder}
              >
                {children}
              </span>
            );
          }}
          decorate={([node, path]) => {
            const ranges: Range[] = [];
            if (Text.isText(node)) {
              const parsed = parse(node.text);
              parsed.forEach((rootNode) => {
                if (rootNode.type !== "text") {
                  ranges.push({
                    anchor: { path, offset: rootNode.column },
                    focus: { path, offset: rootNode.column + rootNode.length },
                    isPlaceholder: true,
                    isInvalid: rootNode.type === "invalid",
                  });
                }

                visitNodes(rootNode, (node, parent) => {
                  if (node.type === "identifier" && parent !== null) {
                    if (node.offset < 0) {
                      return;
                    }
                    const start = rootNode.column + 1 + node.offset;
                    ranges.push({
                      anchor: { path, offset: start },
                      focus: { path, offset: start + node.name.length },
                      identifier: { name: node.name, for: parent.type },
                    });
                  }
                });
              });
            }
            return ranges;
          }}
        />
      </div>
    </Slate>
  );
}

function deserialize(raw: string): Paragraph[] {
  return raw.split("\n").map((line) => ({
    type: "paragraph",
    children: [{ text: line }],
  }));
}

function serialize(value: Descendant[]): string {
  return value.map((n) => Node.string(n)).join("\n");
}
