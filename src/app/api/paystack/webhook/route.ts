import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  // Use service role key to bypass RLS for webhook updates
  // Initializing inside the handler prevents build-time errors when env vars are missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder_key";
  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
  
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    
    if (!signature) {
      return NextResponse.json({ error: "No signature found" }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY || "sk_test_placeholder";
    
    // Verify signature
    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const event = body.event;
    const data = body.data;

    // Handle successful payment
    if (event === "charge.success") {
      const orderId = data.metadata?.custom_fields?.find((f: any) => f.variable_name === "order_id")?.value;
      const reference = data.reference;

      if (orderId) {
        // Update order in database
        const { error } = await supabaseAdmin
          .from("orders")
          .update({ 
            status: "paid", 
            paystack_ref: reference 
          })
          .eq("id", orderId);

        if (error) {
          console.error("Webhook Supabase Error:", error);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
