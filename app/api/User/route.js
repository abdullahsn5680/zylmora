import { NextResponse } from "next/server";
import dbConnect from "@/Utils/connectDb";
import users from "@/models/users";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { Id, updateData } = body;

  if (!Id) {
    return NextResponse.json({ message: "Missing user ID" }, { status: 400 });
  }

  const user = await users.findById(Id);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (!updateData) {
    return NextResponse.json({ data: user }, { status: 200 });
  }

  try {
    const { oldPassword, newPassword, ...otherFields } = updateData;

    if (newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: "Incorrect old password" }, { status: 401 });
      }

      otherFields.password = await bcrypt.hash(newPassword, 10);
    }

    if (otherFields.address && typeof otherFields.address === 'string') {
      try {
        otherFields.address = JSON.parse(otherFields.address);
      } catch (e) {
        return NextResponse.json({ message: "Invalid address format" }, { status: 400 });
      }
    }

    const updatedUser = await users.findByIdAndUpdate(Id, otherFields, {
      new: true,
    });

    return NextResponse.json({ data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ message: "Update failed", error }, { status: 500 });
  }
}
