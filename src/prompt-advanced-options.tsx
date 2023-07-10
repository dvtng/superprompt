import { Button, Flex, Modal, Slider, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePromptState } from "./context";
import { useSnapshot } from "valtio";
import { defaultOptions } from "./core/prompt-state";

export function OpenPromptAdvancedOptionsModalButton() {
  const [opened, { open, close }] = useDisclosure();
  const modal = <PromptAdvancedOptionsModal opened={opened} onClose={close} />;

  return (
    <>
      <Button
        variant="subtle"
        onClick={() => {
          open();
        }}
      >
        + Advanced options
      </Button>
      {modal}
    </>
  );
}

function PromptAdvancedOptionsModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text size="lg">Advanced options</Text>}
    >
      <Stack spacing="lg">
        <OptionSlider
          label="Temperature"
          optionKey="temperature"
          min={0}
          max={2}
        />
        <OptionSlider
          label="Presence penalty"
          optionKey="presencePenalty"
          min={-2}
          max={2}
        />
        <OptionSlider
          label="Frequency penalty"
          optionKey="frequencyPenalty"
          min={-2}
          max={2}
        />
      </Stack>
    </Modal>
  );
}

function OptionSlider({
  label,
  optionKey,
  min,
  max,
}: {
  label: string;
  optionKey: "temperature" | "presencePenalty" | "frequencyPenalty";
  min: number;
  max: number;
}) {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const optionValue =
    _promptState.options[optionKey] ?? defaultOptions[optionKey];
  const step = 0.1;

  return (
    <Stack spacing="xs">
      <Flex align="center" justify="space-between">
        <Text>{label}</Text>
        <Button
          variant="light"
          compact
          style={{
            visibility:
              optionValue !== defaultOptions[optionKey] ? "visible" : "hidden",
          }}
          onClick={() => {
            promptState.options[optionKey] = defaultOptions[optionKey];
          }}
        >
          Reset to default
        </Button>
      </Flex>
      <Flex gap="md" align="center">
        <Slider
          style={{ width: "100%" }}
          value={optionValue / step}
          label={null}
          min={min / step}
          max={max / step}
          scale={(x) => x * step}
          onChange={(value) => {
            promptState.options[optionKey] = value * step;
          }}
        />
        <Text
          style={{
            fontVariantNumeric: "tabular-nums",
            textAlign: "right",
            width: "3em",
          }}
        >
          {optionValue.toFixed(1)}
        </Text>
      </Flex>
    </Stack>
  );
}
