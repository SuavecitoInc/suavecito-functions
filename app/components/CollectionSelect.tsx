import { useState, useCallback, useMemo } from "react";
import { Tag, Listbox, Combobox, Icon, InlineStack } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";

type Props = {
  collections: { node: { id: string; title: string } }[];
  setSelectedOptions: (selectedOptions: string[]) => void;
  selectedOptions: string[];
};

export default function CollectionSelect({
  collections,
  selectedOptions,
  setSelectedOptions,
}: Props) {
  const deselectedOptions = useMemo(
    () =>
      collections.map(({ node }) => ({
        label: node.title,
        value: node.id,
      })),
    [collections],
  );

  // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  const escapeSpecialRegExCharacters = useCallback(
    (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    [],
  );

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions, escapeSpecialRegExCharacters],
  );

  const updateSelection = useCallback(
    (selected: string) => {
      if (selectedOptions.includes(selected)) {
        setSelectedOptions(
          selectedOptions.filter((option) => option !== selected),
        );
      } else {
        setSelectedOptions([...selectedOptions, selected]);
      }

      updateText("");
    },
    [selectedOptions, setSelectedOptions, updateText],
  );

  const removeTag = useCallback(
    (tag: string) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions, setSelectedOptions],
  );

  const tagsMarkup = selectedOptions.map((option) => (
    <Tag key={`option-${option}`} onRemove={removeTag(option)}>
      {option}
    </Tag>
  ));

  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
          const { label, value } = option;

          return (
            <Listbox.Option
              key={`${value}`}
              value={value}
              selected={selectedOptions.includes(value)}
              accessibilityLabel={label}
            >
              {label}
            </Listbox.Option>
          );
        })
      : null;

  return (
    <div style={{ height: "100px", marginTop: "10px" }}>
      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchIcon} />}
            onChange={updateText}
            label="Search collections"
            labelHidden
            value={inputValue}
            placeholder="Search collections"
            autoComplete="off"
          />
        }
      >
        {optionsMarkup ? (
          <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
        ) : null}
      </Combobox>

      <InlineStack gap="100" wrap={false} blockAlign="center">
        {tagsMarkup}
      </InlineStack>
    </div>
  );
}
