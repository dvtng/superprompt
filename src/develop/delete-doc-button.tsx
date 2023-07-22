import { ActionIcon, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { usePromptState } from "../context";
import { deleteDoc } from "../db";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";

export function DeleteDocButton() {
  const promptState = usePromptState();
  const navigate = useNavigate();

  if (!promptState.isSaved) {
    return null;
  }

  return (
    <ActionIcon
      onClick={() => {
        modals.openConfirmModal({
          title: "Permanently delete this prompt?",
          labels: { confirm: "Delete", cancel: "Cancel" },
          children: <Text size="sm">This action cannot be undone.</Text>,
          confirmProps: { color: "red" },
          onConfirm: () => {
            navigate("/");
            deleteDoc(promptState.id);
          },
        });
      }}
    >
      <IconTrash size="1em" />
    </ActionIcon>
  );
}
