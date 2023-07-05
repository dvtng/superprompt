import { css } from "@emotion/css";
import { PromptDoc } from "./prompt-doc";
import { Anchor } from "@mantine/core";
import { Link } from "react-router-dom";

const styles = css`
  color: inherit;
  margin: 0 -1rem;
  padding: 0.5rem 1rem;

  :hover {
    text-decoration: none;
  }

  h3 {
    margin-bottom: 0;
  }

  p {
    margin-top: 0.1rem;
  }
`;

export function PromptDocPreview({ promptDoc }: { promptDoc: PromptDoc }) {
  return (
    <Anchor component={Link} to={`/prompt/${promptDoc.id}`} className={styles}>
      {promptDoc.title ? <h3>{promptDoc.title}</h3> : null}
      <p>{promptDoc.content}</p>
    </Anchor>
  );
}
