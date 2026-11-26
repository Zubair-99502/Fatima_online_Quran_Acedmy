import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../../lib/db';
import Teacher from '../../../../models/Teacher';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const items = await Teacher.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items: items.map(item => ({ ...item, _id: String(item._id) })) });
  } catch (error) {
    console.error('Admin teachers GET failed:', error);
    return NextResponse.json({ error: 'Could not load teachers.' }, { status: 500 });
  }
}


export async function POST(request) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    if (!name) return NextResponse.json({ error: 'Teacher name is required.' }, { status: 400 });
    await connectDB();
    const teacher = await Teacher.create({
      name: name.slice(0, 100),
      title: String(body.title || 'Quran Teacher').trim().slice(0, 100),
      gender: String(body.gender || 'Not specified').trim().slice(0, 40),
      qualifications: String(body.qualifications || '').trim().slice(0, 500),
      courses: Array.isArray(body.courses) ? body.courses.map(x => String(x).slice(0, 100)).slice(0, 10) : [],
    });
    return NextResponse.json({ success: true, id: String(teacher._id) }, { status: 201 });
  } catch (error) {
    console.error('Admin teachers POST failed:', error);
    return NextResponse.json({ error: 'Could not save teacher.' }, { status: 500 });
  }
}


export async function DELETE(request) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await request.json();
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid teacher ID.' }, { status: 400 });
    await connectDB();
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) return NextResponse.json({ error: 'Teacher not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin teachers DELETE failed:', error);
    return NextResponse.json({ error: 'Could not delete teacher.' }, { status: 500 });
  }
}
