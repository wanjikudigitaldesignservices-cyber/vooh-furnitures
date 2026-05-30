import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { phone, amount, orderId } = await req.json();

    if (!phone || !amount || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Format phone number to 2547XXXXXXXX
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.slice(1);
    }
    if (!formattedPhone.startsWith("254") || formattedPhone.length !== 12) {
      return NextResponse.json({ error: "Invalid Kenyan phone number format" }, { status: 400 });
    }

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      console.error("Missing Daraja environment variables.");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // 1. Get OAuth Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const tokenResponse = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Daraja Auth Error:", errorText);
      return NextResponse.json({ error: "Failed to authenticate with Safaricom" }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Prepare STK Push Payload
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14); // YYYYMMDDHHmmss
    
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vooh-furnitures.vercel.app";
    const callbackUrl = `${baseUrl}/api/mpesa/webhook`;

    // 3. Trigger STK Push
    const stkResponse = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `VOOH-${orderId.slice(0, 8).toUpperCase()}`,
        TransactionDesc: "Payment for Vooh Furnitures Order",
      }),
    });

    const stkData = await stkResponse.json();

    if (stkData.ResponseCode !== "0") {
      console.error("STK Push Failed:", stkData);
      return NextResponse.json({ error: stkData.errorMessage || "Failed to trigger STK Push" }, { status: 500 });
    }

    const checkoutRequestId = stkData.CheckoutRequestID;

    // 4. Save CheckoutRequestID to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabaseAdmin
      .from("orders")
      .update({ checkout_request_id: checkoutRequestId })
      .eq("id", orderId);

    if (dbError) {
      console.error("Supabase Error updating checkout ID:", dbError);
    }

    return NextResponse.json({ success: true, checkoutRequestId }, { status: 200 });

  } catch (error: any) {
    console.error("STK Push Exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
