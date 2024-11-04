"use client";

import React, { Suspense } from "react";
import { useCustomers } from "../../../src/hooks/useCustomers";
import CustomersList from "../../../src/components/Customers/CustomersList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../src/config/permissions";
import { useListPermissions } from "../../../src/hooks/useListPermissions";
import TypographyHeading from "../../../app/components/TypographyHeading";

const CustomersPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;
  const { customers, deleteCustomer, restoreCustomer } = useCustomers(token);
  const { canModifyList } = useListPermissions();

  const listConfig = {
    permission: PERMISSIONS.MANAGE_CUSTOMERS,
    restrictedRoles: ["Salesperson"],
  };

  return (
    <Suspense>
      <Box>
        <Box sx={{ textAlign: "center" }}>
          <TypographyHeading>Customers</TypographyHeading>
        </Box>

        {canModifyList(listConfig) && (
          <Link href="/dashboard/customers/create" passHref>
            <ButtonCreate>Create Customer</ButtonCreate>
          </Link>
        )}

        <CustomersList
          customers={customers}
          onDelete={deleteCustomer}
          onRestore={restoreCustomer}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CUSTOMERS],
};

export default withRoleProtection(CustomersPage, protectionConfig);
