import { Controller, Control } from "react-hook-form";
import { MobileDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

interface SelectDateOfLossProps {
  control: Control<any>;
}

const SelectDateOfLoss: React.FC<SelectDateOfLossProps> = ({ control }) => {
  const today = dayjs().endOf("day");

  return (
    <Controller
      name="date_of_loss"
      control={control}
      render={({ field: { onChange, value, ...restField } }) => (
        <MobileDatePicker
          {...restField}
          label="Date of Loss"
          format="YYYY-MM-DD"
          value={value ? dayjs(value) : null}
          onChange={(newValue: Dayjs | null) => {
            onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
          }}
          maxDate={today}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      )}
    />
  );
};

export default SelectDateOfLoss;
