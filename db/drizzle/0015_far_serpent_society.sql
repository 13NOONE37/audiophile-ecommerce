ALTER TABLE "orders" ALTER COLUMN "confirmation_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "confirmation_token_expires_at" SET DEFAULT '2026-05-06T07:05:36.207Z';