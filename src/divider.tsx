import { css } from "@emotion/css";

const dividerStyles = css`
  background: rgba(255, 255, 255, 0.05);
`;

export function Divider({ h = false }: { h?: boolean }) {
  return (
    <div
      className={dividerStyles}
      style={h ? { width: "100%", height: 1 } : { height: "100%", width: 1 }}
    />
  );
}
