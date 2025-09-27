export const config = {
  runtime: 'nodejs',
};

import { NextResponse } from 'next/server';
import dbConnect from '@/Utils/connectDb';
import users from '@/models/users';
import bcrypt from 'bcryptjs';
import { AuthGuard } from '@/Utils/guards';




async function updateUserHandler(request) {
  await dbConnect();
  const body = await request.json();
  const { Id, updateData } = body;

  if (!Id) {
    return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
  }

  const user = await users.findById(Id);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }


  if (!updateData) {
    const { password, ...sanitizedUser } = user.toObject();
    return NextResponse.json({ data: sanitizedUser }, { status: 200 });
  }

  try {
    const { oldPassword, newPassword, ...otherFields } = updateData;


    if (newPassword) {
      if (!user.password) {
        return NextResponse.json({ message: 'No password set for this account' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(oldPassword || '', user.password);
      if (!isMatch) {
        return NextResponse.json({ message: 'Incorrect old password' }, { status: 401 });
      }
      otherFields.password = await bcrypt.hash(newPassword, 10);
    }

  
    if ('address' in otherFields) {
      if (!Array.isArray(otherFields.address)) {
        return NextResponse.json({ message: 'Address must be an array' }, { status: 400 });
      }
    }


    const updatedUser = await users.findByIdAndUpdate(Id, { $set: otherFields }, { new: true });

    const { password, ...sanitizedUser } = updatedUser.toObject();
    return NextResponse.json({ data: sanitizedUser }, { status: 200 });
  } catch (error) {
    console.error('Update failed:', error.message, error.stack);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}


export const POST = AuthGuard(updateUserHandler);
