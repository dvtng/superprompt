import { Anchor, Grid, Text } from "@mantine/core";
import { Divider } from "./divider";
import { css } from "@emotion/css";
import { TopPromptView } from "./top-prompt-view";
import { Link } from "react-router-dom";

const styles = css`
  h2 {
    font-size: 1.3rem;
    font-weight: normal;
    letter-spacing: 1px;
    opacity: 0.5;
  }
`;

export function HomeView() {
  return (
    <Grid className={styles} gutter="2rem">
      <Grid.Col span={6}>
        <h2>Top prompts</h2>
        <Divider h />
        <TopPromptView />
      </Grid.Col>
      <Grid.Col span={6}>
        <h2>Your prompts</h2>
        <Divider h />
        <Text c="dimmed" style={{ padding: "1.5rem 0" }}>
          Start by editing someone else's prompt, or{" "}
          <Anchor component={Link} to="new">
            create a new one
          </Anchor>{" "}
          from scratch.
        </Text>
      </Grid.Col>
    </Grid>
  );
}
