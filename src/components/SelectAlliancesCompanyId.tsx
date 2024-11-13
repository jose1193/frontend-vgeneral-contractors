import React, { useEffect, useState } from "react";
import { Controller, Control, useFormContext } from "react-hook-form";
import {
  FormControl,
  Autocomplete,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { checkAllianceCompaniesAvailable } from "../../app/lib/actions/claimsActions";
import { AllianceCompanyData } from "../../app/types/alliance-company";
import { DocumentTemplateAllianceData } from "../../app/types/document-template-alliance";

interface SelectAllianceCompanyIDProps {
  control: Control<DocumentTemplateAllianceData>;
  initialCompanyId?: number;
}

const SelectAlliancesCompanyId: React.FC<SelectAllianceCompanyIDProps> = ({
  control,
  initialCompanyId,
}) => {
  const { data: session } = useSession();
  const [allianceCompanies, setAllianceCompanies] = useState<
    AllianceCompanyData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Usar useFormContext para acceder a los métodos del formulario
  const { setValue } = useFormContext<DocumentTemplateAllianceData>();

  useEffect(() => {
    const fetchAllianceCompanies = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await checkAllianceCompaniesAvailable(token);

        if (response.success && Array.isArray(response.data)) {
          setAllianceCompanies(response.data);
          setError(null);

          // Si hay un initialCompanyId y aún no se ha inicializado
          if (initialCompanyId && !initialized) {
            const initialCompany = response.data.find(
              (company: AllianceCompanyData) => company.id === initialCompanyId
            );
            if (initialCompany) {
              // Actualiza el valor del formulario con la compañía inicial
              setValue("alliance_company_id", initialCompanyId, {
                shouldValidate: true,
              });
              setInitialized(true);
            }
          }
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setAllianceCompanies([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching alliance companies:", err);
        setAllianceCompanies([]);
        setError("Failed to fetch Alliance Companies");
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchAllianceCompanies();
    }
  }, [session?.accessToken, initialCompanyId, setValue, initialized]);

  return (
    <Controller
      name="alliance_company_id"
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error: fieldError },
      }) => {
        // Encuentra la compañía seleccionada basándose en el ID
        const selectedCompany = value
          ? allianceCompanies.find((company) => company.id === value)
          : null;

        return (
          <FormControl fullWidth>
            <Autocomplete<AllianceCompanyData, false>
              options={allianceCompanies}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                return option.alliance_company_name || "";
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Alliance Company"
                  error={!!fieldError}
                  helperText={fieldError?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              loading={loading}
              onChange={(_, newValue) => {
                onChange(newValue ? newValue.id : undefined);
              }}
              value={selectedCompany}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return option.id === value.id;
              }}
            />
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
};

export default SelectAlliancesCompanyId;
