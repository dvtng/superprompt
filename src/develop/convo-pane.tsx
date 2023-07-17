import { css } from "@emotion/css";
import { UnstyledButton } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { IconArrowDown } from "@tabler/icons-react";
import { CSSProperties, ReactNode, useCallback, useLayoutEffect } from "react";
import { usePromptState } from "../context";
import { useSnapshot } from "valtio";

const convoStyles = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  position: relative;
`;

/**
 * Generic scrollable area that can autoscroll to the bottom
 */
export function ConvoPane({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  const { scrollIntoView, targetRef, scrollableRef } =
    useScrollIntoView<HTMLDivElement>({ duration: 350 });
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);

  const onScroll = useCallback(() => {
    if (scrollableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      // If we scroll to the bottom, then stick to the bottom
      promptState.isStuckToBottom = isAtBottom;
    }
  }, [promptState, scrollableRef]);

  if (_promptState.isStuckToBottom) {
    setTimeout(() => {
      scrollIntoView();
    });
  }

  useLayoutEffect(() => {
    onScroll();
  }, [onScroll]);

  return (
    <div className={convoStyles} style={style}>
      <div
        ref={scrollableRef}
        className={convoStyles}
        style={{ background: "inherit" }}
        onScroll={onScroll}
      >
        {children}
        <div ref={targetRef}></div>
      </div>
      {_promptState.isStuckToBottom ? null : (
        <UnstyledButton
          sx={(theme) => ({
            alignItems: "center",
            background: theme.colorScheme === "dark" ? "#444" : "#ddd",
            bottom: "1rem",
            borderRadius: "50%",
            display: "flex",
            left: "50%",
            lineHeight: 1,
            height: 42,
            justifyContent: "center",
            position: "absolute",
            transform: "translateX(-50%)",
            width: 42,
          })}
          onClick={() => scrollIntoView()}
        >
          <IconArrowDown size={28} />
        </UnstyledButton>
      )}
    </div>
  );
}
