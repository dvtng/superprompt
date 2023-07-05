import { css } from "@emotion/css";
import { PromptDoc } from "./prompt-doc";
import { Anchor, Title, Text } from "@mantine/core";
import { Link } from "react-router-dom";

const styles = css`
  color: inherit;
  margin: 0 -1rem;
  padding: 0 1rem;

  :hover {
    text-decoration: none;
  }
`;

export function PromptDocPreview({ promptDoc }: { promptDoc: PromptDoc }) {
  return (
    <Anchor component={Link} to={`/prompt/${promptDoc.id}`} className={styles}>
      {promptDoc.title ? (
        <Title order={3} style={{ marginBottom: "0.2rem" }}>
          {promptDoc.title}
        </Title>
      ) : null}
      <Text lineClamp={3}>{promptDoc.content}</Text>
    </Anchor>
  );
}
