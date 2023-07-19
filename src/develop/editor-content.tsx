import { CSSProperties, ReactNode, useEffect } from "react";
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
import { parse } from "../core/parse";
import { useMantineTheme } from "@mantine/core";
import { NodeType, visitNodes } from "../core/ast";
import { usePromptState } from "../context";
import { useSnapshot } from "valtio";
import { getColorForInput } from "../core/prompt-state";
import { useDerivedState } from "../use-derived-state";
import { ContentP } from "./content-p";

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
  height: 100%;
  position: relative;
  width: 100%;

  > * {
    outline: none;
  }
`;

export function EditorContent({
  id,
  initialValue,
  onChange,
  readOnly = false,
  style,
  placeholder,
  disabled,
  autoFocus,
  onSubmit,
}: {
  id: string;
  initialValue: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  style?: CSSProperties;
  placeholder?: ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  onSubmit?: () => void;
}) {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const [editor] = useDerivedState(
    () => withReact(withHistory(createEditor())),
    [id]
  );
  const theme = useMantineTheme();

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        ReactEditor.focus(editor);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Slate
      key={id}
      editor={editor}
      initialValue={deserialize(initialValue)}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          onChange?.(serialize(value));
        }
      }}
    >
      <div className={styles}>
        {initialValue === "" ? (
          <div style={{ position: "absolute", padding: "1rem 0", ...style }}>
            {placeholder}
          </div>
        ) : null}
        <Editable
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              onSubmit?.();
            }
          }}
          disabled={disabled}
          style={{ padding: "1rem 0", ...style }}
          readOnly={readOnly}
          renderElement={({ attributes, children }) => {
            return <ContentP {...attributes}>{children}</ContentP>;
          }}
          renderLeaf={({ attributes, children, leaf }) => {
            const style: CSSProperties = {};

            if (leaf.isPlaceholder) {
              style.fontFamily = theme.fontFamilyMonospace;
              style.fontWeight = "bold";
            }
            if (leaf.identifier) {
              if (
                leaf.identifier.for === "variable" ||
                leaf.identifier.for === "generator"
              ) {
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
