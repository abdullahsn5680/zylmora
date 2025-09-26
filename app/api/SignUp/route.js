export const config = {
  runtime: 'nodejs',
};

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/Utils/connectDb";
import users from "@/models/users";
import bcrypt from "bcryptjs";
export const POST = async (request) => {
  try {
    await dbConnect();
    const data = await request.json();
    if (data) {
      const { Username, email, password } = data;
      const ifUsers = await users.findOne({ Username: Username });
      if (ifUsers) {
        return NextResponse.json(
          { message: "User alredy exisits", sucess: false },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("triger3");
      const newUser = new users({
        Username: Username,
        email: email,
        password: hashedPassword,
        isactive: true,
        admin: false,
      });

      await newUser.save();

      return NextResponse.json(
        { message: "User created successfully", sucess: true },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Invalid request data", sucess: false },
      { status: 401 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: `The email "${error.keyValue.email}" is already registered.`,
          success: false,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internel server error", sucess: false },
      { status: 500 }
    );
  }
};
