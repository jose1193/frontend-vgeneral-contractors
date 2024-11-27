import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import { toKebabCase, ensureDirectoryExists } from "../utils";

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

export async function generateAppRouter(config: GeneratorConfig) {
  const { name, baseDir } = config;
  const basePath = path.join(baseDir, "app/dashboard", toKebabCase(name) + "s");
  await ensureDirectoryExists(basePath);

  // loading.tsx for main list page
  const loadingContent = `import DataSkeletonList from "../../../src/components/skeletons/DataSkeletonList";
import { Box } from "@mui/material";

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        mb: 10,
        p: { xs: 3, sm: 3, md: 2, lg: 4 },
      }}
    >
      <DataSkeletonList />
    </Box>
  );
}`;

  // [uuid]/loading.tsx for detail page
  const detailLoadingContent = `import DetailsSkeleton from "../../../../../src/components/skeletons/GeneralFormSkeleton";

export default function Loading() {
  return <DetailsSkeleton />;
}`;

  // [uuid]/edit/loading.tsx and create/loading.tsx for form pages
  const formLoadingContent = `import GeneralFormSkeleton from "../../../../src/components/skeletons/GeneralFormSkeleton";

export default function Loading() {
  return <GeneralFormSkeleton />;
}`;

  // page.tsx (list page)
  const pageContent = `'use client';

import React, { useEffect, Suspense } from "react";
import { use${name}Sync } from '../../../src/hooks/${toKebabCase(
    name
  )}/use${name}Sync';
import { use${name}Store } from '@/stores/${toKebabCase(name)}Store';
import ${name}List from '@/components/${name}/${name}List';
import { Box, Container, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Loading from './loading';
import TypographyHeading from "../../components/TypographyHeading";
import ButtonCreate from "../../components/ButtonCreate";

export default function ${name}ListPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const {
    loading,
    error,
    handleDelete: originalHandleDelete,
    handleRestore: originalHandleRestore,
    refreshItems,
  } = use${name}Sync(token);

  const items = use${name}Store((state) => state.items);

  // Wrapper functions to handle void return type
  const handleDelete = async (uuid: string): Promise<void> => {
    await originalHandleDelete(uuid);
  };

  const handleRestore = async (uuid: string): Promise<void> => {
    await originalHandleRestore(uuid);
  };

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Suspense>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <TypographyHeading>${name} Management</TypographyHeading>
        <Link href={\`/dashboard/${toKebabCase(name)}s/create\`} passHref>
          <ButtonCreate sx={{ mt: 5 }}>Create New ${name}</ButtonCreate>
        </Link>

        <${name}List
          items={items}
          onDelete={handleDelete}
          onRestore={handleRestore}
          userRole={session?.user?.user_role}
        />
      </Box>
    </Suspense>
  );
}`;

  // [uuid]/page.tsx (detail page)
  const detailPageContent = `'use client';

import { use${name}Sync } from '@/hooks/${toKebabCase(name)}/use${name}Sync';
import { use${name}Store } from '@/stores/${toKebabCase(name)}Store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  Avatar,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Loading from './loading';
import TypographyHeading from '../../../components/TypographyHeading';

interface DetailRowProps {
  label: string;
  value: string | number | boolean | null | undefined;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <Box display="flex" alignItems="center" my={1}>
    <Typography variant="body1" component="span" mr={1}>
      {label}:
    </Typography>
    <Typography variant="body1" component="span" fontWeight="bold">
      {value === null || value === undefined
        ? "N/A"
        : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : value}
    </Typography>
  </Box>
);

interface ${name}DetailPageProps {
  params: {
    uuid: string;
  };
}

export default function ${name}DetailPage({ params }: ${name}DetailPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const { loading, error } = use${name}Sync(token);
  const currentItem = use${name}Store((state) =>
    state.items.find((item) => item.uuid === params.uuid)
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box sx={{ mt: 2, mb: 10, p: { xs: 3, sm: 3, md: 2, lg: 4 } }}>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!currentItem) {
    return (
      <Box sx={{ mt: 2, mb: 10, p: { xs: 3, sm: 3, md: 2, lg: 4 } }}>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
        <Typography align="center">${name} not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading>${name} Details</TypographyHeading>

      <Paper
        elevation={3}
        style={{
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size="large" edge="start" color="inherit">
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#EBF4FF",
                  color: "#7F9CF5",
                }}
              >
                {currentItem.name ? currentItem.name[0].toUpperCase() : "${
                  name[0]
                }"}
              </Avatar>
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>
              {currentItem.name}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="warning"
            startIcon={<EditIcon />}
            onClick={() => router.push(\`/dashboard/${toKebabCase(
              name
            )}s/\${params.uuid}/edit\`)}
            sx={{ height: 36 }}
          >
            Edit
          </Button>
        </Box>

        ${config.fields
          .map(
            (field) =>
              `<DetailRow label="${field.name}" value={currentItem.${field.name}} />`
          )
          .join("\n        ")}

        <Divider sx={{ my: 2 }} />

        <DetailRow
          label="Record Status"
          value={currentItem.deleted_at ? "Suspended" : "Available"}
        />
        <DetailRow
          label="Created At"
          value={
            currentItem.created_at
              ? new Date(currentItem.created_at).toLocaleString()
              : undefined
          }
        />
        <DetailRow
          label="Updated At"
          value={
            currentItem.updated_at
              ? new Date(currentItem.updated_at).toLocaleString()
              : undefined
          }
        />
      </Paper>
    </Box>
  );
}`;

  // [uuid]/edit/page.tsx (edit page)
  // [uuid]/edit/page.tsx (edit page)
  const editPageContent = `'use client';

import React, { Suspense } from "react";
import { use${name}Sync } from '../../../src/hooks/${toKebabCase(
    name
  )}/use${name}Sync';
import { use${name}Store } from '@/stores/${toKebabCase(name)}Store';
import ${name}Form from '@/components/${name}/${name}Form';
import { Box, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ${name}CreateDTO } from '@/app/types/${toKebabCase(name)}';
import { useSession } from 'next-auth/react';
import TypographyHeading from "../../../components/TypographyHeading";

interface ${name}EditPageProps {
  params: {
    uuid: string;
  };
}

export default function ${name}EditPage({ params }: ${name}EditPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { loading, error, handleUpdate } = use${name}Sync(token);
  const currentItem = use${name}Store((state) => 
    state.items.find(item => item.uuid === params.uuid)
  );

  const handleSubmit = async (data: ${name}CreateDTO): Promise<void> => {
    try {
      await handleUpdate(params.uuid, data);
      console.log("${name} updated successfully");
      router.push(\`/dashboard/${toKebabCase(name)}s/\${params.uuid}\`);
    } catch (error) {
      console.error("Error updating ${name}:", error);
      throw error;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading>Error</TypographyHeading>
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!currentItem) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading>${name} not found</TypographyHeading>
        <Typography align="center">
          The requested ${name} could not be found
        </Typography>
      </Box>
    );
  }

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading>Edit ${name}</TypographyHeading>

        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "background.paper",
          }}
        >
          <${name}Form
            initialData={currentItem}
            onSubmit={handleSubmit}
          />
        </Paper>
      </Box>
    </Suspense>
  );
}`;

  // create/page.tsx
  const createPageContent = `'use client';

import React, { Suspense } from "react";
import { use${name}Sync } from '../../../../src/hooks/${name}/use${name}Sync';
import ${name}Form from '@/components/${name}/${name}Form';
import { Box, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ${name}CreateDTO } from '@/app/types/${toKebabCase(name)}';
import { useSession } from 'next-auth/react';
import TypographyHeading from "../../../components/TypographyHeading";

export default function ${name}CreatePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { loading, handleCreate } = use${name}Sync(token);

  const handleSubmit = async (data: ${name}CreateDTO): Promise<void> => {
    try {
      const newItem = await handleCreate(data);

      if (!newItem || !('uuid' in newItem)) {
        throw new Error("No UUID received from ${name} creation");
      }

      console.log("New ${name} created:", newItem);
      router.push(\`/dashboard/${toKebabCase(name)}s/\${newItem.uuid}\`);
    } catch (error) {
      console.error("Error creating ${name}:", error);
      throw error;
    }
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
       
          <TypographyHeading>Create ${name}</TypographyHeading>
       

        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "background.paper",
          }}
        >
          <${name}Form onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
}`;

  // Escribir todos los archivos
  await fs.writeFile(path.join(basePath, "loading.tsx"), loadingContent);
  await fs.writeFile(path.join(basePath, "page.tsx"), pageContent);

  const detailPath = path.join(basePath, "[uuid]");
  await ensureDirectoryExists(detailPath);
  await fs.writeFile(
    path.join(detailPath, "loading.tsx"),
    detailLoadingContent
  );
  await fs.writeFile(path.join(detailPath, "page.tsx"), detailPageContent);

  const editPath = path.join(detailPath, "edit");
  await ensureDirectoryExists(editPath);
  await fs.writeFile(path.join(editPath, "loading.tsx"), formLoadingContent);
  await fs.writeFile(path.join(editPath, "page.tsx"), editPageContent);

  const createPath = path.join(basePath, "create");
  await ensureDirectoryExists(createPath);
  await fs.writeFile(path.join(createPath, "loading.tsx"), formLoadingContent);
  await fs.writeFile(path.join(createPath, "page.tsx"), createPageContent);
}
