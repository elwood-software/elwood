"use client";

import { useSettings, type SettingsContextValue } from "./use-settings.js";

export function useLink(): SettingsContextValue["Link"] {
  const { Link } = useSettings();
  return Link;
}
