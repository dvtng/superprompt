import { useSnapshot } from "valtio";
import {
  getColorForInput,
  updateRawPrompt,
  usePromptState,
} from "./prompt-state";
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
import { parsePrompt } from "./prompt-parser";
import { useMantineTheme } from "@mantine/core";
import {
  FunctionCallNode,
  IdentifierNode,
  PlaceholderNode,
  visit,
} from "./ast";
import { isPlainObject } from "lodash";

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
    for: "placeholder" | "functionCall";
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
  height: 100%;
  outline: none;
  margin-top: -0.4em;
  padding: 2rem;
  resize: none;
  width: 100%;

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
      <Editable
        className={styles}
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
            if (leaf.identifier.for === "placeholder") {
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
            const parsed = parsePrompt(node.text);
            parsed.forEach((parseNode) => {
              if (
                parseNode.type === "placeholder" ||
                parseNode.type === "invalid-placeholder"
              ) {
                ranges.push({
                  anchor: { path, offset: parseNode.offset },
                  focus: { path, offset: parseNode.offset + parseNode.length },
                  isPlaceholder: true,
                  isInvalid: parseNode.type === "invalid-placeholder",
                });
              }
              if (parseNode.type === "placeholder") {
                visit(parseNode, (node, parent) => {
                  if (node.type === "identifier" && isPlainObject(parent)) {
                    const _node = node as IdentifierNode;
                    if (_node.offset < 0) {
                      return;
                    }
                    const start = parseNode.offset + 1 + _node.offset;
                    ranges.push({
                      anchor: { path, offset: start },
                      focus: { path, offset: start + _node.name.length },
                      identifier: {
                        name: _node.name,
                        for: (parent as PlaceholderNode | FunctionCallNode)
                          .type,
                      },
                    });
                  }
                });
              }
            });
          }
          return ranges;
        }}
      />
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
