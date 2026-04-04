ALTER TABLE "product_variants" ALTER COLUMN "sku" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "short_name" varchar(12) NOT NULL;