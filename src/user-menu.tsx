import { useSnapshot } from "valtio";
import { appState } from "./app-state";
import { Avatar, Menu, UnstyledButton } from "@mantine/core";
import { IconLogout, IconRefresh } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { sync } from "./sync";

export function UserMenu() {
  const { user } = useSnapshot(appState);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Avatar alt={user.email} radius="xl" color="violet">
            {user.email?.slice(0, 2).toUpperCase()}
          </Avatar>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{user.email}</Menu.Label>
        <Menu.Item
          icon={<IconRefresh size="1rem" />}
          onClick={() => {
            sync();
          }}
        >
          Sync
        </Menu.Item>
        <Menu.Item
          icon={<IconLogout size="1rem" />}
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/");
          }}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
