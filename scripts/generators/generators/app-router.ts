// scripts/generators/generators/app-router.ts
import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import { toKebabCase, ensureDirectoryExists } from "../utils";

export async function generateAppRouter(config: GeneratorConfig) {
  const { name, baseDir } = config;
  const basePath = path.join(baseDir, "app/dashboard", toKebabCase(name) + "s");
  await ensureDirectoryExists(basePath);

  // loading.tsx
  const loadingContent = `export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}`;

  // page.tsx (list page)
  const pageContent = `'use client';

import { useEffect } from 'react';
import { use${name}Sync } from '@/hooks/use${name}Sync';
import { use${name}Store } from '@/stores/${toKebabCase(name)}Store';
import ${name}List from '@/components/${name}/${name}List';
import { Box, Button, Container, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';

export default function ${name}ListPage() {
  const { data: session } = useSession();
  const token = session?.token as string;

  const {
    loading,
    error,
    handleDelete,
    handleRestore,
    refreshItems,
  } = use${name}Sync(token);

  const items = use${name}Store((state) => state.items);

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  if (loading) {
    return <Loading />;
  }

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
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            ${name} Management
          </Typography>

          <Link href={\`/dashboard/${toKebabCase(name)}s/create\`} passHref>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Create New ${name}
            </Button>
          </Link>
        </Box>

        <${name}List
          items={items}
          onDelete={handleDelete}
          onRestore={handleRestore}
          userRole={session?.user?.role}
        />
      </Box>
    </Container>
  );
}`;

  // [uuid]/page.tsx (detail page)
  const detailPageContent = `'use client';

import { use${name}Sync } from '@/hooks/use${name}Sync';
import { use${name}Store } from '@/stores/${toKebabCase(name)}Store';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Loading from '../../loading';

interface ${name}DetailPageProps {
  params: {
    uuid: string;
  };
}

export default function ${name}DetailPage({ params }: ${name}DetailPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.token as string;

  const { loading, error } = use${name}Sync(token);
  const currentItem = use${name}Store((state) => 
    state.items.find(item => item.uuid === params.uuid)
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  if (!currentItem) {
    return (
      <Container>
        <Typography align="center">
          ${name} not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => router.push(\`/dashboard/${toKebabCase(
              name
            )}s/\${params.uuid}/edit\`)}
          >
            Edit
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            ${name} Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary">ID</Typography>
              <Typography variant="body1">{currentItem.uuid}</Typography>
            </Grid>
            ${config.fields
              .map(
                (field) => `
            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary">${field.name}</Typography>
              <Typography variant="body1">{currentItem.${field.name}}</Typography>
            </Grid>`
              )
              .join("\n            ")}
            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary">Status</Typography>
              <Typography variant="body1">
                {currentItem.deleted_at ? 'Suspended' : 'Available'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary">Created At</Typography>
              <Typography variant="body1">
                {new Date(currentItem.created_at || '').toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary">Updated At</Typography>
              <Typography variant="body1">
                {new Date(currentItem.updated_at || '').toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}`;

  // [uuid]/edit/page.tsx (edit page)
  const editPageContent = `'use client';

import { use${name}Sync } from '@/hooks/use${name}Sync';
import { use${name}Store } from '@/stores/${toKebabCase(name)}Store';
import ${name}Form from '@/components/${name}/${name}Form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loading from '../../../loading';

interface ${name}EditPageProps {
  params: {
    uuid: string;
  };
}

export default function ${name}EditPage({ params }: ${name}EditPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.token as string;

  const { loading, error, handleUpdate } = use${name}Sync(token);
  const currentItem = use${name}Store((state) => 
    state.items.find(item => item.uuid === params.uuid)
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  if (!currentItem) {
    return (
      <Container>
        <Typography align="center">
          ${name} not found
        </Typography>
      </Container>
    );
  }

  const handleSubmit = async (data: any) => {
    await handleUpdate(params.uuid, data);
    router.push(\`/dashboard/${toKebabCase(name)}s/\${params.uuid}\`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Box>

        <Typography variant="h4" gutterBottom>
          Edit ${name}
        </Typography>

        <${name}Form
          initialData={currentItem}
          onSubmit={handleSubmit}
        />
      </Box>
    </Container>
  );
}`;

  // create/page.tsx
  const createPageContent = `'use client';

import { use${name}Sync } from '@/hooks/use${name}Sync';
import ${name}Form from '@/components/${name}/${name}Form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ${name}CreatePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.token as string;

  const { handleCreate } = use${name}Sync(token);

  const handleSubmit = async (data: any) => {
    const newItem = await handleCreate(data);
    if (newItem?.uuid) {
      router.push(\`/dashboard/${toKebabCase(name)}s/\${newItem.uuid}\`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Box>

        <Typography variant="h4" gutterBottom>
          Create New ${name}
        </Typography>

        <${name}Form onSubmit={handleSubmit} />
      </Box>
    </Container>
  );
}`;

  // Escribir archivos
  await fs.writeFile(path.join(basePath, "loading.tsx"), loadingContent);
  await fs.writeFile(path.join(basePath, "page.tsx"), pageContent);

  const detailPath = path.join(basePath, "[uuid]");
  await ensureDirectoryExists(detailPath);
  await fs.writeFile(path.join(detailPath, "page.tsx"), detailPageContent);

  const editPath = path.join(detailPath, "edit");
  await ensureDirectoryExists(editPath);
  await fs.writeFile(path.join(editPath, "page.tsx"), editPageContent);

  const createPath = path.join(basePath, "create");
  await ensureDirectoryExists(createPath);
  await fs.writeFile(path.join(createPath, "page.tsx"), createPageContent);
}
