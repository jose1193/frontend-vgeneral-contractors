import React from "react";
import { Controller, Control } from "react-hook-form";
import { MobileDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

interface SelectWorkDateProps {
  control: Control<any>; // Replace 'any' with your form values type if available
}

const SelectWorkDate: React.FC<SelectWorkDateProps> = ({ control }) => {
  const today = dayjs().startOf("day");

  return (
    <Controller
      name="work_date"
      control={control}
      render={({ field: { onChange, value, ...restField } }) => (
        <MobileDatePicker
          {...restField}
          label="Work Date"
          format="YYYY-MM-DD"
          value={value ? dayjs(value) : null}
          onChange={(newValue: Dayjs | null) => {
            onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
          }}
          minDate={today}
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

export default SelectWorkDate;
