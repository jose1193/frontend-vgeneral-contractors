// app/profile/loading.tsx
import React from "react";
import { Box, Paper, Skeleton, Grid, Divider } from "@mui/material";
import { Suspense } from "react";
import UserProfileSkeleton from "../../../src/components/skeletons/UserProfileSkeleton";
export default function Loading() {
  return <Suspense fallback={<UserProfileSkeleton />}></Suspense>;
}
