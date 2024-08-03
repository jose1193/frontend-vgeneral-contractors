// app/contexts/UserContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserData } from "../types/user";

interface UserContextType {
  userData: UserData | null;
  updateUserData: (newData: UserData) => void;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  updateUserData: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUserData(session.user as UserData);
    }
  }, [session]);

  const updateUserData = (newData: UserData) => {
    setUserData(newData);
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
