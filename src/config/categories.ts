export const CATEGORIES = {
  Body: [],
  Home: [],
  Finances: [],
  Job: [],
  Projects: [],
  Fun: [],
} as const;

export type CategoryName = keyof typeof CATEGORIES;
