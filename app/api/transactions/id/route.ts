import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
    
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
    ) {
    console.log("Deleting transaction ID:", params.id);
    await connectToDB();
  
    try {
      const deletedTransaction = await Transaction.findByIdAndDelete(params.id);
  
      if (!deletedTransaction) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
}
  
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const { id } = params;
    const updatedData = await request.json();
    await connectToDB();
  
    try {
      const updatedTransaction = await Transaction.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedTransaction) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedTransaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
    }
  }
  
