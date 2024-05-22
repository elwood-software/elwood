import { nativeTheme } from 'electron'
import { z } from 'zod'

export const Settings = z.object({
  is_first_time: z.boolean().default(true),
  theme: z.string().default(nativeTheme.shouldUseDarkColors ? 'dark' : 'light'),
  last_opened_at: z.string().default(new Date().toISOString()),
  last_app_path: z.string().default(''),
  last_width: z.number().default(1024),
  last_height: z.number().default(728),
  last_x: z.nullable(z.number()).default(null),
  last_y: z.nullable(z.number()).default(null)
})

export type SettingsSchema = z.infer<typeof Settings>

export const Workspaces = z.object({
  last_active_id: z.nullable(z.string()).default(null),
  workspaces: z
    .record(
      z.string().uuid(),
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
        anonKey: z.string()
      })
    )
    .default({})
})

export type WorkspacesSchema = z.infer<typeof Workspaces>
