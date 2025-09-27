import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export function AuthGuard(handler) {
  return async (req) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    req.user = session.user;
    return handler(req);
  };
}

export function AdminGuard(handler) {
  return async (req) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== true) {
      return NextResponse.json({ message: "Forbidden - Admins only" }, { status: 403 });
    }

    req.user = session.user;
    return handler(req);
  };
}
