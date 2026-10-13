-- Supabase expone el esquema public por su API REST con la llave anon.
-- La app entra como el rol dueño de las tablas (se salta RLS), así que activar
-- RLS sin políticas cierra esa puerta sin afectar a la tienda.
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_sources" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wompi_events" ENABLE ROW LEVEL SECURITY;
