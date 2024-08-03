// src/hooks/useUsers.ts

import { useState, useEffect } from "react";
import { UserData } from "../../app/types/user";
import * as usersActions from "../../app/lib/actions/usersActions";

export const useUsers = (token: string) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersActions.getUsers(token);
        console.log("Fetched users response:", response);

        if (response.success && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setError("Received invalid data format");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const createUser = async (userData: UserData) => {
    try {
      const newUser = await usersActions.createUser(token, userData);
      setUsers([...users, newUser]);
    } catch (err) {
      setError("Failed to create user");
    }
  };

  const updateUser = async (uuid: string, userData: UserData) => {
    try {
      const updatedUser = await usersActions.updateUser(token, uuid, userData);
      setUsers(users.map((user) => (user.uuid === uuid ? updatedUser : user)));
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const deleteUser = async (uuid: string) => {
    try {
      const deletedUser = await usersActions.deleteUser(token, uuid);
      setUsers(users.filter((user) => (user.uuid ? deletedUser : user)));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const restoreUser = async (uuid: string) => {
    try {
      const restoredUser = await usersActions.restoreUser(token, uuid);
      setUsers(users.map((user) => (user.uuid === uuid ? restoredUser : user)));
      // O si prefieres recargar toda la lista de usuarios:
      // await fetchUsers();
    } catch (err) {
      setError("Failed to restore user");
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
  };
};
