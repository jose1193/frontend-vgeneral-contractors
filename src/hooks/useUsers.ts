import { useState, useEffect, useCallback } from "react";
import { UserData } from "../../app/types/user";
import * as usersActions from "../../app/lib/actions/usersActions";

export const useUsers = (token: string) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await usersActions.getUsers(token);
      console.log("Fetched users response:", response);

      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setError("Received invalid data format");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData: UserData): Promise<UserData> => {
    try {
      const newUser = await usersActions.createUser(token, userData);
      if (!newUser || !newUser.uuid) {
        throw new Error("Invalid response from server");
      }

      setUsers((prevUsers) => [...prevUsers, newUser]);
      return newUser;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      setError(errorMessage);
      throw error;
    }
  };

  const updateUser = async (uuid: string, userData: UserData) => {
    try {
      const updatedUser = await usersActions.updateUser(token, uuid, userData);
      setUsers(
        users.map((user) =>
          user.uuid === uuid ? { ...updatedUser, uuid } : user
        )
      );
      return updatedUser;
    } catch (err) {
      setError("Failed to update user");
      throw err;
    }
  };

  const deleteUser = useCallback(
    async (uuid: string) => {
      console.log("Attempting to delete user with uuid:", uuid);
      try {
        await usersActions.deleteUser(token, uuid);
        console.log("User deleted successfully");

        // Update the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.uuid === uuid ? { ...user, active: false } : user
          )
        );

        // Fetch the updated list of users
        await fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user");
      }
    },
    [token, fetchUsers]
  );

  const restoreUser = useCallback(
    async (uuid: string) => {
      try {
        await usersActions.restoreUser(token, uuid);
        console.log("User restored successfully");

        // Fetch the updated list of users
        await fetchUsers();
      } catch (err) {
        console.error("Error restoring user:", err);
        setError("Failed to restore user");
      }
    },
    [token, fetchUsers]
  );

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
