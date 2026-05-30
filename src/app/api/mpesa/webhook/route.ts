import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("M-PESA Webhook Payload:", JSON.stringify(data, null, 2));

    if (!data.Body || !data.Body.stkCallback) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const callback = data.Body.stkCallback;
    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;

    // We only care about updating successful payments
    if (resultCode === 0) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

      // Find the order by checkout_request_id and update status to paid
      const { error } = await supabaseAdmin
        .from("orders")
        .update({ status: "paid" })
        .eq("checkout_request_id", checkoutRequestId);

      if (error) {
        console.error("Webhook Supabase update error:", error);
      }
    } else {
      console.log(`M-PESA transaction failed or was cancelled. ResultCode: ${resultCode}, Desc: ${callback.ResultDesc}`);
    }

    // Acknowledge receipt to Safaricom Daraja
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" }, { status: 200 });

  } catch (error: any) {
    console.error("M-PESA Webhook Exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
