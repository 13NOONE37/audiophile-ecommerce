ALTER TABLE "product_images" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "product_images" ALTER COLUMN "role" SET DEFAULT 'main'::text;--> statement-breakpoint
DROP TYPE "public"."image_role";--> statement-breakpoint
CREATE TYPE "public"."image_role" AS ENUM('main', 'preview', 'gallery', 'cart');--> statement-breakpoint
ALTER TABLE "product_images" ALTER COLUMN "role" SET DEFAULT 'main'::"public"."image_role";--> statement-breakpoint
ALTER TABLE "product_images" ALTER COLUMN "role" SET DATA TYPE "public"."image_role" USING "role"::"public"."image_role";