ALTER TABLE "payments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "payments" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "confirmation_token_expires_at" SET DEFAULT '2026-05-24T20:27:52.238Z';--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "variant_id_snapshot" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "stripe_session_id" text;--> statement-breakpoint
DROP TYPE "public"."order_status";