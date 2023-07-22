import { ActionIcon, Button, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { usePromptState } from "../context";
import { deleteDoc } from "../db";
import { useNavigate } from "react-router-dom";

export function DeleteDocButton() {
  const [opened, { open, close }] = useDisclosure();
  const promptState = usePromptState();
  const navigate = useNavigate();

  if (!promptState.isSaved) {
    return null;
  }

  return (
    <>
      <ActionIcon onClick={open}>
        <IconTrash size="1rem" />
      </ActionIcon>
      <Modal
        title={<Text size="lg">Permanently delete this prompt?</Text>}
        opened={opened}
        onClose={close}
      >
        <Flex gap="md">
          <Button
            style={{ minWidth: 100 }}
            onClick={() => {
              close();
              navigate("/");
              deleteDoc(promptState.id);
            }}
          >
            Yes
          </Button>
          <Button style={{ minWidth: 100 }} variant="default" onClick={close}>
            No
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
