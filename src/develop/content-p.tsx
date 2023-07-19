import { css } from "@emotion/css";
import { HTMLProps, forwardRef } from "react";

const styles = css`
  margin-block-start: 0.55em;
  margin-block-end: 0.55em;

  &:first-child {
    margin-block-start: 0;
  }

  &:last-child {
    margin-block-end: 0;
  }
`;

export const ContentP = forwardRef<
  HTMLParagraphElement,
  HTMLProps<HTMLParagraphElement>
>((props, ref) => {
  return (
    <p ref={ref} {...props} className={styles}>
      {props.children}
    </p>
  );
});
