import { Grid } from "@mantine/core";
import { Divider } from "./divider";
import { css } from "@emotion/css";
import { TopPromptView } from "./top-prompt-view";
import { MyDocList } from "./my-doc-list";

const styles = css`
  h2 {
    font-size: 1.2rem;
    font-weight: normal;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
    opacity: 0.5;
  }
`;

export function HomeView() {
  return (
    <Grid className={styles} gutter="3rem">
      <Grid.Col sm={6}>
        <h2>My prompts</h2>
        <Divider h />
        <div style={{ padding: "1.5rem 0" }}>
          <MyDocList />
        </div>
      </Grid.Col>
      <Grid.Col sm={6}>
        <h2>Examples</h2>
        <Divider h />
        <div style={{ padding: "1.5rem 0" }}>
          <TopPromptView />
        </div>
      </Grid.Col>
    </Grid>
  );
}
