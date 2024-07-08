import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  ContentPaste as ContentPasteSearchIcon,
  PostAdd as PostAddIcon,
} from "@mui/icons-material";

const DashboardCards = () => {
  const cardData = [
    { title: "Users", value: "145", icon: <PeopleIcon />, color: "#3f51b5" },
    {
      title: "Deals",
      value: "$56,789",
      icon: <MoneyIcon />,
      color: "#4caf50",
    },
    { title: "Claims", value: "211", icon: <PostAddIcon />, color: "#ff9800" },
    {
      title: "Projects",
      value: "140",
      icon: <ContentPasteSearchIcon />,
      color: "#f44336",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card elevation={3}>
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
                  {React.cloneElement(card.icon, { style: { color: "white" } })}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
