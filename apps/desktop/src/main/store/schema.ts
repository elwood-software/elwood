import { nativeTheme } from 'electron'
import { z } from 'zod'

export const Settings = z.object({
  is_first_time: z.boolean().default(true),
  theme: z.string().default(nativeTheme.shouldUseDarkColors ? 'dark' : 'light'),
  last_opened_at: z.string().default(new Date().toISOString()),
  last_app_path: z.string().default('')
})

export type SettingsSchema = z.infer<typeof Settings>

export const Workspaces = z
  .object({
    last_active_id: z.string(),
    workspaces: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          url: z.string(),
          anonKey: z.string()
        })
      )
      .default([])
  })
  .partial()

export type WorkspacesSchema = z.infer<typeof Workspaces>
