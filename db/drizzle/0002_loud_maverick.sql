CREATE TYPE "public"."image_role" AS ENUM('main', 'secondary', 'cart');--> statement-breakpoint
CREATE TYPE "public"."image_type" AS ENUM('desktop', 'tablet', 'mobile');--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "role" "image_role" DEFAULT 'main' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "type" "image_type" DEFAULT 'desktop' NOT NULL;