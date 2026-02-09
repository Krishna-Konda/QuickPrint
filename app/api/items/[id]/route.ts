import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import PrintItem from "@/app/models/PrintItem";

// DELETE - Delete single item by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = params;

    const deletedItem = await PrintItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: deletedItem });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 },
    );
  }
}
