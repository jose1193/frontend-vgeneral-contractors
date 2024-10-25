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
      <Box sx={{ width: "100%", ml: -6, overflow: "hidden" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "left",
            mb: 3,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
            fontWeight: "bold",
            ml: 4,
          }}
        >
          Customers
        </Typography>

        {canModifyList(listConfig) && (
          <Link href="/dashboard/customers/create" passHref>
            <ButtonCreate sx={{ ml: 4 }}>Create Customer</ButtonCreate>
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
