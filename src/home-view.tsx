import { Flex } from "@mantine/core";
import { Divider } from "./divider";
import { css } from "@emotion/css";
import { ExampleDocList } from "./example-doc-list";
import { MyDocList } from "./my-doc-list";

const styles = css`
  padding-bottom: 1rem;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 2rem;
  }

  > * {
    width: 100%;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: normal;
    margin: 0 0 0.5rem;
    opacity: 0.5;
  }
`;

export function HomeView() {
  return (
    <>
      <Flex className={styles} gap="3rem">
        <div>
          <h2>My prompts</h2>
          <Divider h />
          <div style={{ padding: "1.5rem 0" }}>
            <MyDocList />
          </div>
        </div>
        <div>
          <h2>Examples</h2>
          <Divider h />
          <div style={{ padding: "1.5rem 0" }}>
            <ExampleDocList />
          </div>
        </div>
      </Flex>
    </>
  );
}
