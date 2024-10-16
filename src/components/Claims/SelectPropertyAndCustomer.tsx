import React, { useState, useEffect } from "react";
import { Grid, IconButton, Button } from "@mui/material";
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
        {(!isCustomerSelected || !isPropertySelected) && (
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
          {showAddNewPropertyButton && (
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              {!showAddressClaimForm && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#c2410c",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#9a3412",
                      color: "#fff",
                    },
                  }}
                  onClick={toggleAddressClaimForm}
                  startIcon={<AddHomeWorkIcon />}
                >
                  Add New Property
                </Button>
              )}
            </Grid>
          )}
        </>
      )}
      {isCustomerSelected && isPropertySelected && (
        <Grid item xs={12} sm={6} md={5}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#16a34a",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#15803d",
                color: "#fff",
              },
            }}
            fullWidth
            onClick={() => setOpenSecondCustomerModal(true)}
            startIcon={<PersonAddIcon />}
          >
            Add Another Customer Signature
          </Button>
        </Grid>
      )}
      {showAddressClaimForm && (
        <Grid item xs={12}>
          <AddressClaimForm
            customers={customers}
            onSubmitSuccess={handleAddressClaimSubmitSuccess}
            onClose={() => setShowAddressClaimForm(false)}
            associatedCustomerIds={associatedCustomerIds}
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
    </Grid>
  );
}
