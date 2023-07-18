import {
  Alert,
  Button,
  Flex,
  Input,
  Modal,
  Stack,
  Title,
  Text,
  List,
  ThemeIcon,
} from "@mantine/core";
import { getErrorMessage } from "./core/get-error-message";
import { IconCloud, IconPlus, IconSparkles, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useProxy } from "./use-proxy";

const URL =
  "https://dvtng.us21.list-manage.com/subscribe/post?u=a4604d03f97e4065364b54bff&amp;id=4d2f34e5aa&amp;f_id=00695ce1f0";

export function BetaSignUpButton() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button variant="default" onClick={open}>
        Sign in
      </Button>
      <Modal opened={opened} onClose={close}>
        <BetaSignUpForm />
      </Modal>
    </>
  );
}

export function BetaSignUpForm() {
  const [_form, form] = useProxy(() => ({
    email: "",
    isSubmitting: false,
    error: "",
    isComplete: false,
  }));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        form.isSubmitting = true;
        form.error = "";
        try {
          const formData = new FormData(e.currentTarget);
          await fetch(URL, { method: "POST", body: formData, mode: "no-cors" });
          form.isComplete = true;
        } catch (e) {
          form.error = getErrorMessage(e);
        } finally {
          form.isSubmitting = false;
        }
      }}
    >
      <Stack sx={{ padding: "0 1rem 3rem" }} spacing="xl">
        <Title order={2} color="violet">
          We're launching soon!
        </Title>
        <Text size="lg">Awesome features are on the way.</Text>
        <List spacing="xs" size="lg" center sx={{ "> *": { lineHeight: 1.4 } }}>
          <List.Item
            icon={
              <ThemeIcon color="violet" size={32} radius="xl">
                <IconCloud size="1rem" />
              </ThemeIcon>
            }
          >
            Sync your prompts across devices
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="violet" size={32} radius="xl">
                <IconSparkles size="1rem" />
              </ThemeIcon>
            }
          >
            Publish prompts as AI-powered apps
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="teal" size={32} radius="xl">
                <IconPlus size="1rem" />
              </ThemeIcon>
            }
          >
            and more!
          </List.Item>
        </List>
        <Text size="lg">Sign up to be the first to know.</Text>
        {_form.error ? (
          <Alert icon={<IconX size="1.1rem" />} color="red" variant="outline">
            {_form.error}
          </Alert>
        ) : null}
        {_form.isComplete ? (
          <Alert color="green" variant="filled">
            <Text size="md" sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              Got it!
            </Text>
            <Text size="md">We'll let you know when it's ready.</Text>
          </Alert>
        ) : (
          <Flex gap="md">
            <Input
              type="email"
              name="EMAIL"
              value={_form.email}
              onChange={(e) => (form.email = e.currentTarget.value)}
              placeholder="Your email"
              size="md"
              required
              disabled={_form.isSubmitting}
            />
            <Button
              type="submit"
              loading={_form.isSubmitting}
              loaderProps={{ size: "1rem" }}
              size="md"
            >
              Notify me
            </Button>
          </Flex>
        )}
      </Stack>
    </form>
  );
}
