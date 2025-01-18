import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FontPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Playfair Display",
  "Merriweather",
];

export function FontPicker({ value, onChange }: FontPickerProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a font" />
      </SelectTrigger>
      <SelectContent>
        {fontOptions.map((font) => (
          <SelectItem key={font} value={font}>
            <span style={{ fontFamily: font }}>{font}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}