"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import { useTheme } from "../../../app/ui/StyledRoot";

interface Task {
  id: string;
  content: string;
  description: string;
  amount: number;
  warning?: boolean;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  totalAmount: number;
  totalTasks: number;
}

interface ColumnsState {
  [key: string]: Column;
}

const initialColumns: ColumnsState = {
  appointmentScheduled: {
    id: "appointmentScheduled",
    title: "Appointment Scheduled",
    tasks: [
      {
        id: "task-1",
        content: "VG-RU 2024 Inspeccion",
        description: "VG-RU 2024, Maria Reyna",
        amount: 0,
      },
      {
        id: "task-2",
        content: "VG-RU Inspeccion Karla Morales",
        description: "Karla Morales",
        amount: 0,
        warning: true,
      },
      {
        id: "task-3",
        content: "VG-RU 2024 Inspeccion",
        description: "VG-RU 2024, Maria Martinez",
        amount: 0,
        warning: true,
      },
      {
        id: "task-4",
        content: "Trato Victor Tess",
        description: "Victor Tess",
        amount: 0,
        warning: true,
      },
    ],
    totalAmount: 0,
    totalTasks: 4,
  },
  proposalSent: {
    id: "proposalSent",
    title: "Proposal Sent/Presented",
    tasks: [
      {
        id: "task-5",
        content: "Trato Maria Test",
        description: "Maria Test",
        amount: 0,
        warning: true,
      },
      {
        id: "task-6",
        content: "Trato company tess",
        description: "company tess",
        amount: 120,
        warning: true,
      },
      {
        id: "task-7",
        content: "VG Tess Roof",
        description: "VG-JACK, Adrian Labrador Tess",
        amount: 1000,
        warning: true,
      },
      {
        id: "task-8",
        content: "Contrucion de Roofing",
        description: "Roof tess, Roofing Tess",
        amount: 10,
        warning: true,
      },
    ],
    totalAmount: 1130,
    totalTasks: 4,
  },
  proposalSigned: {
    id: "proposalSigned",
    title: "Proposal Signed",
    tasks: [
      {
        id: "task-9",
        content: "VG-JACK inspecc",
        description: "VG-JACK, Adrian Labrador Tess",
        amount: 0,
      },
    ],
    totalAmount: 0,
    totalTasks: 1,
  },
  negociacionComenzada: {
    id: "negociacionComenzada",
    title: "Negociación comenzada",
    tasks: [],
    totalAmount: 0,
    totalTasks: 0,
  },
};

const Kanban: React.FC = () => {
  const [columns, setColumns] = useState<ColumnsState>(initialColumns);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const { darkMode } = useTheme();
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks =
      source.droppableId === destination.droppableId
        ? sourceTasks
        : [...destColumn.tasks];

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks,
        totalAmount: sourceTasks.reduce((sum, task) => sum + task.amount, 0),
        totalTasks: sourceTasks.length,
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks,
        totalAmount: destTasks.reduce((sum, task) => sum + task.amount, 0),
        totalTasks: destTasks.length,
      },
    });
  };

  const handleTitleEdit = (columnId: string, newTitle: string) => {
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        title: newTitle,
      },
    });
  };

  const finishTitleEdit = () => {
    setEditingTitle(null);
  };

  const addCard = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: "Nueva tarea",
      description: "Descripción de la nueva tarea",
      amount: 0,
    };

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        tasks: [...columns[columnId].tasks, newTask],
        totalAmount: columns[columnId].totalAmount + newTask.amount,
        totalTasks: columns[columnId].totalTasks + 1,
      },
    });
  };

  const removeCard = (columnId: string, taskId: string) => {
    const column = columns[columnId];
    const taskToRemove = column.tasks.find((task) => task.id === taskId);
    if (!taskToRemove) return;

    const updatedTasks = column.tasks.filter((task) => task.id !== taskId);

    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        tasks: updatedTasks,
        totalAmount: column.totalAmount - taskToRemove.amount,
        totalTasks: column.totalTasks - 1,
      },
    });
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: "100vh",
          p: 2,
          mb: 10,
        }}
      >
        <Grid container spacing={2}>
          {Object.values(columns).map((column) => (
            <Grid item xs={12} sm={12} md={6} lg={3} key={column.id}>
              <Paper
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {editingTitle === column.id ? (
                    <TextField
                      value={column.title}
                      onChange={(e) =>
                        handleTitleEdit(column.id, e.target.value)
                      }
                      onBlur={finishTitleEdit}
                      autoFocus
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Box>
                      <Typography
                        variant="h6"
                        onClick={() => setEditingTitle(column.id)}
                        sx={{
                          cursor: "pointer",
                          mb: 1,
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: darkMode ? "text.primary" : "#172B4D",
                        }}
                      >
                        {column.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${column.totalAmount} · {column.totalTasks} tratos
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ flexGrow: 1, p: 1, overflowY: "auto" }}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              elevation={2}
                              sx={{
                                p: 2,
                                mb: 1,
                                borderLeft: task.warning
                                  ? "4px solid #FFC400"
                                  : "4px solid #4CAF50",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      mb: 0.5,
                                      fontWeight: "bold",
                                      color: darkMode
                                        ? "text.primary"
                                        : "#172B4D",
                                    }}
                                  >
                                    {task.content}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 0.5 }}
                                  >
                                    {task.description}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    ${task.amount}
                                  </Typography>
                                </Box>
                                <IconButton
                                  onClick={() => removeCard(column.id, task.id)}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
                <Button
                  onClick={() => addCard(column.id)}
                  fullWidth
                  sx={{
                    mt: 1,
                    py: 1,
                    bgcolor: "#e0e0e0",
                    color: "#172B4D",
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    "&:hover": {
                      bgcolor: "#d5d5d5",
                    },
                  }}
                >
                  + Agregar tarjeta
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DragDropContext>
  );
};

export default Kanban;
