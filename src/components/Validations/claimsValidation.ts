import * as yup from "yup";
const propertySchema = yup.object().shape({
  // Define los campos esperados de PropertyData aquí
  // Ejemplo:
  id: yup.number().nullable(),
  property_address: yup.string().nullable(),
  // Agrega más campos según la definición de PropertyData
});

export const claimsSchema = yup.object().shape({
  id: yup.number().nullable().optional(),
  uuid: yup.string().nullable().optional(),
  property_id: yup.number().required(),
  type_damage_id: yup.number().required(),
  type_damage: yup.string().optional(),
  damage_description: yup.string().nullable(),
  user_ref_by: yup.string().optional(),
  policy_number: yup.string().required(),
  user_id_ref_by: yup.number().optional(),
  claim_number: yup.string().optional(),
  claim_internal_id: yup.string().optional(),
  claim_status: yup.string().nullable(),
  date_of_loss: yup.string().nullable(),
  description_of_loss: yup.string().nullable(),
  number_of_floors: yup.number().nullable(),
  insurance_company_id: yup.number().optional(),
  insurance_company_assignment: yup.string().nullable(),
  public_company_id: yup.number().nullable(),
  public_adjuster_id: yup.number().nullable(),
  public_adjuster_assignment: yup.string().nullable(),
  public_company_assignment: yup.string().nullable(),
  technical_user_id: yup.array().of(yup.number()).nullable(),
  technical_assignments: yup.array().of(
    yup.object().shape({
      id: yup.number().required(),
      technical_user_name: yup.string().required(),
    })
  ),
  work_date: yup.string().nullable(),
  service_request_id: yup.array().of(yup.number()).nullable(),
  scope_of_work: yup.string().nullable(),
  alliance_company_id: yup.array().of(yup.number()).nullable(),
  alliance_companies: yup.array().of(yup.object()),
  requested_services: yup.array().of(yup.object()).required(),

  affidavit: yup.object().shape({
    mortgage_company_name: yup.string().nullable(),
    mortgage_company_phone: yup.string().nullable(),
    mortgage_loan_number: yup.string().nullable(),
    amount_paid: yup.number().nullable(),
    description: yup.string().nullable(),
    never_had_prior_loss: yup.boolean().nullable(),
    has_never_had_prior_loss: yup.boolean().nullable(),
  }),

  signature_path_id: yup.number().optional(),
  customers: yup.array().of(yup.object()).nullable(),
  property: yup.object().required(),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
});
