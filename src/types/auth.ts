import React from "react";
import { User } from "./user";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}