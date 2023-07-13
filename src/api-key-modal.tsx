import { Button, Checkbox, Modal, Stack, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRef, useState } from "react";
import { getMissingApiKeys, setApiKey } from "./core/api-key-state";
import { useSnapshot } from "valtio";
import { useDisclosure } from "@mantine/hooks";
import { useApiKeyState } from "./context";

export function useRequestRequiredApiKeysModal(requiredApiKeys: string[]) {
  const appState = useApiKeyState();
  const _appState = useSnapshot(appState);
  const [opened, { open, close }] = useDisclosure(false);
  const missingAPIKeys = getMissingApiKeys(_appState, requiredApiKeys);
  const promiseResolveRef = useRef<((value: boolean) => void) | null>(null);
  const modal = (
    <ApiKeyModal
      names={missingAPIKeys}
      opened={opened}
      onClose={() => {
        close();
        promiseResolveRef.current?.(
          getMissingApiKeys(appState, requiredApiKeys).length === 0
        );
      }}
    />
  );
  const request = () => {
    if (getMissingApiKeys(appState, requiredApiKeys).length === 0) {
      return Promise.resolve(true);
    }
    return new Promise<boolean>((resolve) => {
      promiseResolveRef.current = resolve;
      open();
    });
  };
  return [modal, request] as const;
}

export function ApiKeyModal({
  names,
  opened,
  onClose,
}: {
  names: string[];
  opened: boolean;
  onClose: () => void;
}) {
  const appState = useApiKeyState();
  const form = useForm({
    initialValues: Object.fromEntries(names.map((name) => [name, ""])),
    validate: Object.fromEntries(
      names.map((name) => [name, (value: string) => value.length === 0])
    ),
  });
  const [shouldSave, setShouldSave] = useState(true);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text size="lg">Enter your OpenAI API key</Text>}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          if (form.validate().hasErrors) {
            return;
          }
          Object.entries(values).forEach(([name, value]) => {
            setApiKey(appState, name, value, shouldSave);
          });
          onClose();
        })}
      >
        <Stack spacing="xl">
          <Stack>
            <Text>
              You can get your API key{" "}
              <a href="https://platform.openai.com/account/api-keys">here</a>.
            </Text>
            <Text>
              Your key will only be used directly in your browser to communicate
              with OpenAI. It is never sent to us, or any other website.
            </Text>
            {names.map((name) => (
              <TextInput
                key={name}
                placeholder={`${name} API key`}
                size="md"
                {...form.getInputProps(name)}
              />
            ))}
          </Stack>
          <Checkbox
            label="Save keys on this computer"
            checked={shouldSave}
            onChange={() => {
              setShouldSave((prev) => !prev);
            }}
          />
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </Modal>
  );
}
