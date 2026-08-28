CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"customer_id" uuid,
	"subscription_id" uuid,
	"status" text DEFAULT 'pending' NOT NULL,
	"amount_cents" integer NOT NULL,
	"shipping_cents" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'COP' NOT NULL,
	"items" jsonb NOT NULL,
	"shipping" jsonb NOT NULL,
	"notes" text,
	"wompi_transaction_id" text,
	"wompi_payment_method" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "payment_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"wompi_payment_source_id" integer NOT NULL,
	"type" text NOT NULL,
	"brand" text,
	"last_four" text,
	"exp_month" text,
	"exp_year" text,
	"status" text DEFAULT 'AVAILABLE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"payment_source_id" uuid NOT NULL,
	"manage_token" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"cafe_handle" text NOT NULL,
	"size_label" text NOT NULL,
	"grind" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"frequency_days" integer NOT NULL,
	"unit_price_cents" integer NOT NULL,
	"amount_cents" integer NOT NULL,
	"shipping" jsonb NOT NULL,
	"next_charge_at" timestamp with time zone NOT NULL,
	"last_charged_at" timestamp with time zone,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_manage_token_unique" UNIQUE("manage_token")
);
--> statement-breakpoint
CREATE TABLE "wompi_events" (
	"id" text PRIMARY KEY NOT NULL,
	"event" text NOT NULL,
	"transaction_id" text,
	"verified" boolean NOT NULL,
	"payload" jsonb NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_sources" ADD CONSTRAINT "payment_sources_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_payment_source_id_payment_sources_id_fk" FOREIGN KEY ("payment_source_id") REFERENCES "public"."payment_sources"("id") ON DELETE no action ON UPDATE no action;