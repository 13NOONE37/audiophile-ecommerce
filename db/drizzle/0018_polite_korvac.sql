CREATE SEQUENCE "public"."order_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_number" SET DEFAULT 
    'ORD-' ||
    lpad(nextval('order_seq')::text, 6, '0')
  ;