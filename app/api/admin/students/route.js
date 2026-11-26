import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../../lib/db';
import Student from '../../../../models/Student';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request) {
  if (!await requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const items = await Student.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      items: items.map(item => ({ ...item, _id: String(item._id) })),
    });
  } catch (error) {
    console.error('Admin students GET failed:', error);
    return NextResponse.json({ error: 'Could not load students.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!await requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!String(body.name || '').trim()) {
      return NextResponse.json({ error: 'Student name is required.' }, { status: 400 });
    }

    await connectDB();
    const student = await Student.create({
      name: String(body.name).trim().slice(0, 100),
      parentName: String(body.parentName || '').trim().slice(0, 100),
      country: String(body.country || '').trim().slice(0, 80),
      course: String(body.course || '').trim().slice(0, 100),
      teacher: String(body.teacher || '').trim().slice(0, 100),
      schedule: String(body.schedule || '').trim().slice(0, 160),
    });

    return NextResponse.json({ success: true, id: String(student._id) }, { status: 201 });
  } catch (error) {
    console.error('Admin students POST failed:', error);
    return NextResponse.json({ error: 'Could not save student.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!await requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid student ID.' }, { status: 400 });
    }
    if (!['Active', 'Paused', 'Completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid student status.' }, { status: 400 });
    }

    await connectDB();
    const student = await Student.findByIdAndUpdate(id, { status }, { new: true });
    if (!student) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin students PATCH failed:', error);
    return NextResponse.json({ error: 'Could not update student.' }, { status: 400 });
  }
}
