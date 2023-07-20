import { Alert } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { getErrorMessage } from "./core/get-error-message";

export function ErrorMessage({ error }: { error: unknown }) {
  return (
    <Alert icon={<IconX size="1.1rem" />} color="red" variant="outline">
      {getErrorMessage(error)}
    </Alert>
  );
}
