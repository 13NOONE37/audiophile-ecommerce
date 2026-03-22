ALTER TABLE "product_recomendations" RENAME TO "product_recommendations";--> statement-breakpoint
ALTER TABLE "product_recommendations" DROP CONSTRAINT "product_recomendations_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "product_recommendations" DROP CONSTRAINT "product_recomendations_recommended_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "product_recommendations" ADD CONSTRAINT "product_recommendations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_recommendations" ADD CONSTRAINT "product_recommendations_recommended_id_products_id_fk" FOREIGN KEY ("recommended_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;