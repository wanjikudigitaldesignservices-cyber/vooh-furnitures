import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import OrderReceiptEmail from "@/components/emails/OrderReceiptEmail";

// Initialize Resend with fallback for testing
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

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
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .update({ status: "paid" })
        .eq("checkout_request_id", checkoutRequestId)
        .select()
        .single();

      if (error) {
        console.error("Webhook Supabase update error:", error);
      } else if (order && resend) {
        // Send email receipt
        try {
          // If the admin hasn't set a custom domain, use the Resend testing email
          const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
          // If testing with onboarding@resend.dev, you can only send TO the verified email address
          // In production, this would be order.customer_email
          const toEmail = process.env.RESEND_FROM_EMAIL ? order.customer_email : "onboarding@resend.dev";

          await resend.emails.send({
            from: `Vooh Furnitures <${fromEmail}>`,
            to: toEmail,
            subject: `Receipt for your order #${order.id.split('-')[0].toUpperCase()}`,
            react: OrderReceiptEmail({
              orderId: order.id,
              customerName: order.customer_name,
              items: order.items,
              subtotal: order.subtotal,
              deliveryFee: order.delivery_fee,
              total: order.total,
              deliveryMethod: order.delivery_address ? "home" : "pickup",
              deliveryAddress: order.delivery_address,
              branchPickup: order.branch_pickup,
            }),
          });
          console.log(`Receipt email sent to ${toEmail}`);
        } catch (emailErr) {
          console.error("Failed to send receipt email:", emailErr);
        }
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
