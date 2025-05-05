
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-04-30.basil",
// });

// export async function POST(req: Request) {
//   try {
//     const { items } = await req.json();

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: items.map((item: any) => ({
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: item.name,
//             images: [item.image],
//           },
//           unit_amount: item.price * 100,
//         },
//         quantity: item.quantity,
//       })),
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
//     });

//     return NextResponse.json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     return NextResponse.json(
//       { error: "Error creating checkout session" },
//       { status: 500 }
//     );
//   }
// }