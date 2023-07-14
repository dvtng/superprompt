import {
  Box,
  Divider,
  Flex,
  Modal,
  Title,
  Text,
  Code,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import guideMarkdown from "./prompt-template-guide.md?raw";
import ReactMarkdown from "react-markdown";
import { IconHelp } from "@tabler/icons-react";

export function OpenHelpModalButton() {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <HelpModal opened={opened} close={close} />
      <ActionIcon onClick={open}>
        <IconHelp size="1.4rem" />
      </ActionIcon>
    </>
  );
}

function HelpModal({ opened, close }: { opened: boolean; close: () => void }) {
  return (
    <Modal opened={opened} onClose={close} size="xl">
      <Box sx={{ paddingBottom: "1rem" }}>
        <Flex direction="column" gap="1rem">
          <Title order={2} sx={{ fontWeight: "normal" }}>
            Learn the basics
          </Title>
          <Text>
            Superprompt lets you iterate quickly on different prompts. A lot of
            its power comes from using placeholders in your prompts – turning
            them from basic prompts to prompt <em>templates</em>.
          </Text>
          <div>
            <Divider sx={{ marginTop: "1rem" }} />
            <ReactMarkdown
              children={guideMarkdown}
              components={{
                code({ inline, children, ...props }) {
                  return (
                    <Code {...props} block={!inline} sx={{ fontSize: "0.9em" }}>
                      {children}
                    </Code>
                  );
                },
                h3({ children, ...props }) {
                  return (
                    <Title {...props} order={3} sx={{ marginTop: "2rem" }}>
                      {children}
                    </Title>
                  );
                },
              }}
            />
          </div>
        </Flex>
      </Box>
    </Modal>
  );
}
