import { z } from "zod";

export const PortfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  category_id: z.string().nullable(),
  image_url: z.string().url().nullable().or(z.literal("")).optional(),
  project_url: z.string().url().nullable().or(z.literal("")).optional(),
  client_name: z.string().nullable(),
  completed_at: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  published: z.boolean(),
});

export const CategorySchema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
});

export const RecentProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
  category: z.string().nullable(),
  image_url: z.string().url().nullable().or(z.literal("")).optional(),
  published: z.boolean().optional(),
});

export const TestimonialSchema = z.object({
  client_name: z.string().min(1),
  role: z.string().nullable(),
  quote: z.string().min(1),
  rating: z.number().min(1).max(5).optional(),
  logo_url: z.string().url().nullable().or(z.literal("")).optional(),
  enabled: z.boolean().optional(),
});

export const TeamMemberSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  description: z.string().nullable(),
  bio: z.string().nullable(),
  photo_url: z.string().url().nullable().or(z.literal("")).optional(),
  sort_order: z.number().optional(),
  published: z.boolean().optional(),
});

export const ServiceRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable(),
  service: z.string().nullable(),
  message: z.string().min(1),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
});

export const ContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().nullable(),
  message: z.string().min(1),
});

export const SettingsSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
  description: z.string().nullable(),
});

export const TableSchemas: Record<string, any> = {
  portfolio_items: PortfolioItemSchema,
  portfolio_categories: CategorySchema,
  recent_projects: RecentProjectSchema,
  testimonials: TestimonialSchema,
  team_members: TeamMemberSchema,
  service_requests: ServiceRequestSchema,
  contact_messages: ContactMessageSchema,
  settings: SettingsSchema,
};

export default TableSchemas;
