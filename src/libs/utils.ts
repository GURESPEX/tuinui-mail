import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v7 as uuidv7 } from "uuid";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export const uuid = () => uuidv7();
