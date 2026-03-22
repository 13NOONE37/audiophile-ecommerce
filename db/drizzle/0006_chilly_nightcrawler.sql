CREATE TABLE "product_recomendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"recommended_id" uuid NOT NULL,
	"position" integer DEFAULT 0,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_recomendations" ADD CONSTRAINT "product_recomendations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_recomendations" ADD CONSTRAINT "product_recomendations_recommended_id_products_id_fk" FOREIGN KEY ("recommended_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;