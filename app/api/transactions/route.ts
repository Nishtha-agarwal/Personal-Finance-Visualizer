import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";

// GET: Fetch all transactions
export async function GET(request: NextRequest) {
  await connectToDB();
  const transactions = await Transaction.find();
  return NextResponse.json(transactions);
}

// POST: Create a new transaction
export async function POST(request: NextRequest) {
  await connectToDB();
  const body = await request.json();
  const transaction = await Transaction.create(body);
  return NextResponse.json(transaction);
}
