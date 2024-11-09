import { Role, User, UserRole } from "@prisma/client";
import { Schema } from "prompt";

export interface AdminInputSchema extends Schema {
  properties: {
    email: {
      description: string;
      required: boolean;
      format: "email";
    };
    name: {
      description: string;
      required: boolean;
      pattern: RegExp;
      message?: string;
    };
    password: {
      description: string;
      hidden: boolean;
      replace: string;
      required: boolean;
      conform: (value: string) => boolean;
      message: string;
    };
  };
}

export interface MethodSchema extends Schema {
  properties: {
    choice: {
      description: string;
      required: boolean;
      pattern: RegExp;
      message: string;
    };
  };
}

export interface ConfirmSchema extends Schema {
  properties: {
    confirm: {
      description: string;
      required: boolean;
      pattern: RegExp;
      message?: string;
    };
  };
}

export interface UserEmailSchema extends Schema {
  properties: {
    email: {
      description: string;
      required: boolean;
      format: "email";
    };
  };
}

export interface AdminSetupResponse {
  success: boolean;
  user?: User & {
    roles: (UserRole & {
      role: Role;
    })[];
  };
  error?: string;
}

export type GetSecureInput = (schema: Schema) => Promise<{
  [key: string]: string;
}>;

export type SetupAdmin = () => Promise<void>;

export interface AdminCreationData {
  email: string;
  name: string;
  password: string;
}

export interface ExistingUserData {
  email: string;
}
