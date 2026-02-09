import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import PrintItem from "@/app/models/PrintItem";

// GET - Fetch all items
export async function GET() {
  try {
    await connectDB();
    const items = await PrintItem.find({}).sort({ timestamp: -1 });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}

// POST - Create new item
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const newItem = await PrintItem.create(body);

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 },
    );
  }
}

// DELETE - Clear all items
export async function DELETE() {
  try {
    await connectDB();
    await PrintItem.deleteMany({});

    return NextResponse.json({ success: true, message: "All items deleted" });
  } catch (error) {
    console.error("Error deleting items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete items" },
      { status: 500 },
    );
  }
}
