import React, { useState, useEffect } from "react";
import { Grid, IconButton, Box, Snackbar, Alert } from "@mui/material";
import { Control, useFormContext } from "react-hook-form";
import { ClaimsData } from "../../../app/types/claims";
import { useCustomerContext } from "../../../app/contexts/CustomerContext";
import SelectProperty from "../SelectProperty";
import EnhancedCustomerSelectionWizard from "../EnhancedCustomerSelectionWizard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import CustomerForm from "../Claims/CustomerForm";
import { PropertyData } from "../../../app/types/property";
import { CustomerData } from "../../../app/types/customer";
import AddSecondCustomerModal from "../../../src/components/Claims/AddSecondCustomerModal";
import AddressClaimForm from "./AddressClaimForm";
import ButtonGreen from "../../../app/components/ButtonGreen";
import CustomButton from "../../../app/components/CustomButton";

interface PropertyAndCustomerSelectionProps {
  control: Control<ClaimsData>;
  initialData?: ClaimsData;
}

export default function SelectPropertyAndCustomer({
  control,
  initialData,
}: PropertyAndCustomerSelectionProps) {
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [openSecondCustomerModal, setOpenSecondCustomerModal] = useState(false);
  const [showAddressClaimForm, setShowAddressClaimForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(
    null
  );
  const [associatedCustomerIds, setAssociatedCustomerIds] = useState<number[]>(
    []
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { customers } = useCustomerContext();
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ClaimsData>();

  const selectedCustomerId = watch("customer_id");
  const selectedPropertyId = watch("property_id");

  const isCustomerSelected = selectedCustomerId !== undefined;
  const isPropertySelected = selectedPropertyId !== undefined;
  const [customerHasProperties, setCustomerHasProperties] = useState(false);

  const handleCustomerSelection = (selected: CustomerData | null) => {
    if (selected) {
      setValue("customer_id", selected.id);
      setCustomerHasProperties(
        !!selected.property && selected.property.length > 0
      );
    } else {
      setValue("customer_id", undefined);
      setValue("property_id", undefined);
      setCustomerHasProperties(false);
    }
    setShowAddressClaimForm(false);
  };

  const handlePropertyChange = (
    value: PropertyData | null,
    newAssociatedCustomerIds: number[]
  ) => {
    if (value) {
      setValue("property_id", value.id);
      setSelectedProperty(value);
      setAssociatedCustomerIds(newAssociatedCustomerIds);
    } else {
      setValue("property_id", undefined);
      setSelectedProperty(null);
      setAssociatedCustomerIds([]);
    }
    setShowAddressClaimForm(false);
  };

  const handleAddressClaimSubmitSuccess = () => {
    console.log("Address claim submitted successfully");
    setShowAddressClaimForm(false);
    setCustomerHasProperties(true);
    setSnackbar({
      open: true,
      message: "Property created successfully",
      severity: "success",
    });
    // You might want to refresh the property list here
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleAddressClaimForm = () => {
    setShowAddressClaimForm(!showAddressClaimForm);
  };

  useEffect(() => {
    if (initialData) {
      setValue("customer_id", initialData.customer_id);
      setValue("property_id", initialData.property_id);
    }
  }, [initialData, setValue]);

  const showAddNewPropertyButton =
    isCustomerSelected && (!customerHasProperties || isPropertySelected);

  return (
    <Grid container spacing={2} sx={{ my: 5 }}>
      <Grid item xs={11}>
        <EnhancedCustomerSelectionWizard
          control={control}
          customers={customers}
          errors={errors}
          onCustomerSelect={handleCustomerSelection}
        />
      </Grid>
      <Grid item xs={1}>
        {!isCustomerSelected && (
          <IconButton
            color="primary"
            onClick={() => setOpenCustomerModal(true)}
          >
            <PersonAddIcon />
          </IconButton>
        )}
      </Grid>
      {isCustomerSelected && (
        <>
          <Grid item xs={12}>
            <SelectProperty
              control={control}
              onChange={handlePropertyChange}
              value={selectedPropertyId}
              selectedCustomerId={selectedCustomerId}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "stretch", md: "center" }}
              mt={5}
              gap={2}
            >
              {isPropertySelected && (
                <ButtonGreen
                  onClick={() => setOpenSecondCustomerModal(true)}
                  startIcon={<PersonAddIcon />}
                  mb={0}
                >
                  Add Another Customer Signature
                </ButtonGreen>
              )}
              {showAddNewPropertyButton && (
                <CustomButton
                  onClick={toggleAddressClaimForm}
                  startIcon={<AddHomeWorkIcon />}
                  mb={0}
                >
                  Add New Property
                </CustomButton>
              )}
            </Box>
          </Grid>
        </>
      )}
      {showAddressClaimForm && (
        <Grid item xs={12}>
          <AddressClaimForm
            customers={customers}
            onSubmitSuccess={handleAddressClaimSubmitSuccess}
            onClose={() => setShowAddressClaimForm(false)}
            associatedCustomerIds={[]}
          />
        </Grid>
      )}
      <CustomerForm
        open={openCustomerModal}
        onClose={() => setOpenCustomerModal(false)}
      />
      <AddSecondCustomerModal
        open={openSecondCustomerModal}
        selectedProperty={selectedProperty}
        onClose={() => setOpenSecondCustomerModal(false)}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
