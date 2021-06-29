import {
  createContext,
  MouseEventHandler,
  PropsWithChildren,
  useContext,
} from "react";
import { useQuery } from "react-query";
import { UnauthenticatedNavbar } from "../Unauthenticated/UnauthenticatedNavbar";

export interface User {
  email: string;
  id: string;
  name: string;
}
interface AuthContextProps {
  currentUser?: User;
  logout: MouseEventHandler;
  login: MouseEventHandler;
}

const authBasePath =
  process.env.NODE_ENV !== "production" ? "http://localhost:3001" : "";
const logout = () => {
  window.open(`${authBasePath}/logout`, "_self");
};

const login = () => {
  window.open(`${authBasePath}/login`, "_self");
};

const AuthContext = createContext<AuthContextProps>({ logout, login });
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const fetchMe = async () => {
    const results = await fetch("/me");
    if (results.status === 403) {
      throw new Error("Unauthenticated");
    }
    return results.json();
  };

  const { data, isSuccess, isLoading, isError } = useQuery(
    "get-current-user",
    fetchMe
  );

  return (
    <>
      {isLoading && <UnauthenticatedNavbar />}
      {isError && <UnauthenticatedNavbar />}
      {isSuccess && (
        <AuthContext.Provider
          value={{
            currentUser: data,
            logout,
            login,
          }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
