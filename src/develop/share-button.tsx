import {
  ActionIcon,
  Button,
  CopyButton,
  Input,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconCheck,
  IconCopy,
  IconShare2,
  IconWorld,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { usePromptState } from "../context";
import { updateVisibility } from "../core/prompt-state";

export function ShareButton() {
  const promptState = usePromptState();

  if (!promptState.isSaved) {
    return null;
  }

  if (promptState.visibility === "public") {
    return (
      <Button
        compact
        leftIcon={<IconWorld size="1em" />}
        variant="default"
        onClick={() => {
          modals.openConfirmModal({
            title: "Shared",
            children: (
              <Stack>
                <Text>Anyone with this link will be able to see it.</Text>
                <Input
                  value={location.href}
                  readOnly
                  rightSection={
                    <CopyButton value={location.href}>
                      {({ copied, copy }) => (
                        <ActionIcon onClick={copy} variant="subtle">
                          {copied ? (
                            <IconCheck size="1em" />
                          ) : (
                            <IconCopy size="1em" />
                          )}
                        </ActionIcon>
                      )}
                    </CopyButton>
                  }
                />
              </Stack>
            ),
            labels: { confirm: "Close", cancel: "Make private" },
            onCancel: async () => {
              updateVisibility(promptState, "private");
            },
          });
        }}
      >
        Public
      </Button>
    );
  }

  return (
    <Button
      compact
      leftIcon={<IconShare2 size="1em" />}
      variant="default"
      onClick={() => {
        modals.openConfirmModal({
          title: "Share this prompt?",
          children: (
            <Stack>
              <Text>Anyone with this link will be able to see it.</Text>
              <Input value={location.href} readOnly />
            </Stack>
          ),
          labels: { confirm: "Copy link and share", cancel: "Cancel" },
          onConfirm: async () => {
            updateVisibility(promptState, "public");
            await navigator.clipboard.writeText(location.href);
          },
        });
      }}
    >
      Share
    </Button>
  );
}
