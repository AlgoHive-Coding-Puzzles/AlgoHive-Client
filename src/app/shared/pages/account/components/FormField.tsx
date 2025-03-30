import { Input } from "@shared/components/ui/input";

interface FormFieldProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}: FormFieldProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start">
      <div className="sm:flex-[0.45] text-lg text-surface-0 font-medium">
        {label}
      </div>
      <div className="sm:flex-[0.55] w-full">
        <Input
          className="w-full px-5 py-3"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FormField;
