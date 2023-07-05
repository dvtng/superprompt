import { Button, Checkbox, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { setAPIKey } from "./app-state";

export function ApiKeyModal({
  names,
  opened,
  onClose,
}: {
  names: string[];
  opened: boolean;
  onClose: () => void;
}) {
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
      title="Please provide the following API keys"
    >
      <form
        onSubmit={form.onSubmit((values) => {
          if (form.validate().hasErrors) {
            return;
          }
          Object.entries(values).forEach(([name, value]) => {
            setAPIKey(name, value, shouldSave);
          });
          onClose();
        })}
      >
        <Stack spacing="xl">
          <Stack>
            {names.map((name) => (
              <TextInput
                key={name}
                label={name}
                withAsterisk
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
