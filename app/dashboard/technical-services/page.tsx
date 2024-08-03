"use client";

import { useSession } from "next-auth/react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Link,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Suspense, useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import RoleGuard from "../../../src/components/RoleGuard";

// Define interfaces for our data structures
interface Event {
  title: string;
  date: string;
  category: string;
  address: string;
  technicians: string;
}

interface EventsData {
  today: number;
  tomorrow: number;
  records: Event[];
}

export default function TechnicalServicesDashboardPage() {
  return (
    <RoleGuard allowedRoles={["Technical Services"]}>
      <TechnicalServicesDashboardContent />
    </RoleGuard>
  );
}

function TechnicalServicesDashboardContent() {
  const [events, setEvents] = useState<EventsData>({
    today: 0,
    tomorrow: 0,
    records: [],
  });

  useEffect(() => {
    // Fetch events data here
    // For now, we'll use mock data
    setEvents({
      today: 0,
      tomorrow: 0,
      records: [
        {
          title: "INSTALAR CARPA",
          date: "Tue 29, Nov 2022 - 01:30 PM",
          category: "TARP > Hurricane",
          address: "7759 Sapphire Lane , Orlando Florida, 32822",
          technicians: "Victor Lara /",
        },
        {
          title: "MITIGACION",
          date: "Tue 29, Nov 2022 - 01:30 PM",
          category: "Mitigation > Hurricane",
          address: "7759 Sapphire Lane , Orlando Florida, 32822",
          technicians: "Victor Lara /",
        },
      ],
    });
  }, []);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 5, ml: -8 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Suspense fallback={<CircularProgress />}>
            <EventsDisplay events={events} />
          </Suspense>
        </Grid>
      </Grid>
    </Box>
  );
}

const EventsDisplay: React.FC<{ events: EventsData }> = ({ events }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Today Events</Typography>
              <Typography variant="h4">{events.today}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tomorrow Events</Typography>
              <Typography variant="h4">{events.tomorrow}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Last 24 Records
      </Typography>

      <Grid container spacing={2}>
        {events.records.map((event, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography>{event.date}</Typography>
                <Typography>{event.category}</Typography>
                <Typography>{event.address}</Typography>
                <Typography>Technicians: {event.technicians}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Completar Trabajo
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
