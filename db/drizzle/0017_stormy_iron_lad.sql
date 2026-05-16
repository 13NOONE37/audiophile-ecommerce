ALTER TABLE "orders" RENAME COLUMN "first_name" TO "name";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "street" TO "address";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "confirmation_token_expires_at" SET DEFAULT now() + interval '2 days';--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "variant_id_snapshot" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "house_number";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "apartment_number";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "region";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "notes";