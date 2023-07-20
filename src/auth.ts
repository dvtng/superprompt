import { Session } from "@supabase/supabase-js";
import { appState } from "./app-state";
import { supabase } from "./supabase";

export async function initUser() {
  setAuthSessionFromUrl();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUserFromSession(session);
  });

  return () => subscription.unsubscribe();
}

// Session tokens are put in the URL hash by Supabase's OAuth flow.
async function setAuthSessionFromUrl() {
  const params = new URLSearchParams(location.hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (accessToken && refreshToken) {
    history.replaceState(null, "", window.location.href.split("#")[0]);
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }
}

function setUserFromSession(session: Session | null) {
  appState.user = session
    ? {
        id: session.user.id,
        email: session.user.email ?? undefined,
      }
    : null;
}
