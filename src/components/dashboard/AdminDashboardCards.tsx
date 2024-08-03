import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  ContentPaste as ContentPasteSearchIcon,
  PostAdd as PostAddIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { withRoleProtection } from "../withRoleProtection";
const DashboardCards = () => {
  const cardData = [
    {
      title: "Users",
      value: "145",
      icon: <PeopleIcon />,
      color: "#3f51b5",
      change: 5.2,
    },
    {
      title: "Deals",
      value: "$56,789",
      icon: <MoneyIcon />,
      color: "#4caf50",
      change: -2.1,
    },
    {
      title: "Claims",
      value: "211",
      icon: <PostAddIcon />,
      color: "#ff9800",
      change: 3.7,
    },
    {
      title: "Projects",
      value: "140",
      icon: <ContentPasteSearchIcon />,
      color: "#f44336",
      change: 0.8,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            elevation={3}
            sx={{
              borderLeft: `4px solid ${card.color}`,
              borderRight: `1px solid rgba(255, 255, 255, 0.2)`,
              borderTop: `1px solid rgba(255, 255, 255, 0.2)`,
              borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
              borderRadius: "4px",
              "&:hover": {
                boxShadow: `0 0 10px ${card.color}88`,
              },
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    color="textPrimary"
                    sx={{ fontWeight: "bold" }}
                    gutterBottom
                    variant="h6"
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="h5">{card.value}</Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {card.change >= 0 ? (
                      <ArrowUpwardIcon sx={{ color: "green", fontSize: 16 }} />
                    ) : (
                      <ArrowDownwardIcon sx={{ color: "red", fontSize: 16 }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: card.change >= 0 ? "green" : "red",
                        ml: 0.5,
                      }}
                    >
                      {Math.abs(card.change)}%
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: card.color,
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(card.icon, {
                    style: { color: "white" },
                  })}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default withRoleProtection(DashboardCards, ["Super Admin"]);
