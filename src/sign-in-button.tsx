import { Button, Divider, Stack, Title } from "@mantine/core";
import { supabase } from "./supabase";
import { IconBrandGoogle } from "@tabler/icons-react";
import { appState } from "./app-state";
import { modals } from "@mantine/modals";

export function SignInButton() {
  return (
    <Button
      variant="default"
      onClick={() => {
        openSignInModalIfNotSignedIn();
      }}
    >
      Sign in
    </Button>
  );
}

// Opens sign in modal if not signed in.
// Returns true if modal was opened, false otherwise.
export function openSignInModalIfNotSignedIn() {
  if (appState.user) {
    return false;
  }

  modals.open({
    children: (
      <Stack align="center" sx={{ padding: "0 1rem 2rem" }}>
        <img src="/logo.svg" alt="superprompt" width="48" />
        <Title order={3}>Sign in to superprompt</Title>
        <Divider />
        <Button
          variant="outline"
          size="md"
          leftIcon={<IconBrandGoogle size="1em" />}
          fullWidth
          color="gray"
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                queryParams: {
                  access_type: "offline",
                  prompt: "consent",
                },
                redirectTo: location.href,
              },
            });
          }}
        >
          Sign in with Google
        </Button>
      </Stack>
    ),
  });
  return true;
}
