import { NumericFormat } from "react-number-format";
import { Control, Controller } from "react-hook-form";
import { TextField } from "@mui/material";

interface CurrencyInputProps {
  control: Control<any>;
  name: string;
  label?: string;
}

const CurrencyInput = ({
  control,
  name,
  label = "Amount",
}: CurrencyInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <NumericFormat
          customInput={TextField}
          value={value}
          thousandSeparator={true}
          prefix="$"
          decimalScale={2}
          allowNegative={false}
          fixedDecimalScale
          onValueChange={(values) => {
            onChange(values.floatValue);
          }}
          label={label}
          fullWidth
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default CurrencyInput;
