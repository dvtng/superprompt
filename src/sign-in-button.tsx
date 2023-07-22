import { Button, Modal } from "@mantine/core";
import { useProxyState } from "./use-proxy-state";
import { supabase } from "./supabase";
import { IconBrandGoogle } from "@tabler/icons-react";

export function SignInButton() {
  const state = useProxyState({ isOpen: false });

  return (
    <>
      <Button
        variant="default"
        onClick={() => {
          state.isOpen = true;
        }}
      >
        Sign in
      </Button>
      <Modal
        opened={state.isOpen}
        onClose={() => (state.isOpen = false)}
        title="Sign in to superprompt"
      >
        <Button
          variant="outline"
          size="md"
          leftIcon={<IconBrandGoogle size="1em" />}
          fullWidth
          onClick={async () => {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                queryParams: {
                  access_type: "offline",
                  prompt: "consent",
                },
                redirectTo: location.href,
              },
            });
            console.log({ data, error });
          }}
        >
          Sign in with Google
        </Button>
      </Modal>
    </>
  );
}
