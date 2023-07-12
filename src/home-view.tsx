import { Grid } from "@mantine/core";
import { Divider } from "./divider";
import { css } from "@emotion/css";
import { TopPromptView } from "./top-prompt-view";
import { MyDocList } from "./my-doc-list";

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
    <Grid className={styles} gutter="3rem">
      <Grid.Col span={6}>
        <h2>Top prompts</h2>
        <Divider h />
        <div style={{ padding: "1.5rem 0" }}>
          <TopPromptView />
        </div>
      </Grid.Col>
      <Grid.Col span={6}>
        <h2>Your prompts</h2>
        <Divider h />
        <div style={{ padding: "1.5rem 0" }}>
          <MyDocList />
        </div>
      </Grid.Col>
    </Grid>
  );
}
