import { NextResponse } from "next/server";
import Review from "@/models/Review";
import dbConnect from "@/Utils/connectDb";


export async function GET(req) {
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("pid");
  await dbConnect();
  try {
    if (id) {
      const review = await Review.find({pid:id})
      return NextResponse.json(review, { status: 200 });
    }else{
        throw new Error("Id is not provided");
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newReview = await Review.create(body);
    const id = body.pid;
      const review = await Review.find({pid:id})
    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("id");

  if (!_id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  try {
    const body = await req.json();
    const updatedReview = await Review.findByIdAndUpdate(_id, body, { new: true });
    if (!updatedReview) return NextResponse.json({ error: "Review not found" }, { status: 404 });
    return NextResponse.json(updatedReview, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("id");
  const uid = searchParams.get("uid");

  if (!_id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const review = await Review.findById(_id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (!review.uid || review.uid.toString() !== uid) {
      return NextResponse.json({ error: "Not a valid user" }, { status: 400 });
    }

    await Review.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });

  } catch (err) {
   
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

