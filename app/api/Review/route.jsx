import { NextResponse } from "next/server";
import Review from "@/models/Review";
import dbConnect from "@/Utils/connectDb";
import { AuthGuard } from "@/Utils/guards";



async function getReviewsHandler(req) {
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get("pid");

  await dbConnect();

  try {
    if (!pid) throw new Error("Product ID is not provided");

    const reviews = await Review.find({ pid });
    return NextResponse.json(reviews, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function addReviewHandler(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const newReview = await Review.create(body);

    const pid = body.pid;
    const reviews = await Review.find({ pid });
    return NextResponse.json(reviews, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

async function updateReviewHandler(req) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("id");

  if (!_id) return NextResponse.json({ error: "Review ID is required" }, { status: 400 });

  await dbConnect();

  try {
    const body = await req.json();
    const updatedReview = await Review.findByIdAndUpdate(_id, body, { new: true });

    if (!updatedReview) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

async function deleteReviewHandler(req) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("id");
  const uid = searchParams.get("uid");

  if (!_id) return NextResponse.json({ error: "Review ID is required" }, { status: 400 });

  await dbConnect();

  try {
    const review = await Review.findById(_id);
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    if (!review.uid || review.uid.toString() !== uid) {
      return NextResponse.json({ error: "Not a valid user" }, { status: 400 });
    }

    await Review.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export const GET = AuthGuard(getReviewsHandler);
export const POST = AuthGuard(addReviewHandler);
export const PUT = AuthGuard(updateReviewHandler);
export const DELETE = AuthGuard(deleteReviewHandler);
