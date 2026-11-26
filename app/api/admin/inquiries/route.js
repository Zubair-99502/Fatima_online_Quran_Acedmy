import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../../lib/db';
import Inquiry from '../../../../models/Inquiry';
import { requireAdmin } from '../../../../lib/auth';

const allowedStatuses = ['New', 'Contacted', 'Trial Scheduled', 'Enrolled', 'Closed'];


export async function GET(request) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const items = await Inquiry.find().sort({ createdAt: -1 }).limit(300).lean();
    return NextResponse.json({ items: items.map(item => ({ ...item, _id: String(item._id) })) });
  } catch (error) {
    console.error('Admin inquiries GET failed:', error);
    return NextResponse.json({ error: 'Could not load inquiries.' }, { status: 500 });
  }
}


export async function PATCH(request) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (!mongoose.isValidObjectId(body.id)) return NextResponse.json({ error: 'Invalid inquiry ID.' }, { status: 400 });
    if (!allowedStatuses.includes(body.status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    await connectDB();
    const item = await Inquiry.findByIdAndUpdate(body.id, { status: body.status }, { new: true, runValidators: true });
    if (!item) return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin inquiries PATCH failed:', error);
    return NextResponse.json({ error: 'Could not update inquiry.' }, { status: 500 });
  }
}
