import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "@/lib/supabase";

//POST REQUEST HOPEFULLY
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventTitle, eventLocation, eventDate, eventStart, eventEnd } = await req.json();

    // Get ID maybe 
    const employerId = (session.user as any).employerId ?? session.user.employerId;

    const { data, error } = await supabase
      .from("employer_calendar")
      .insert([
        {
          employer_id: employerId,
          event_title: eventTitle,
          event_location: eventLocation,
          event_date: eventDate,
          event_start: eventStart,
          event_end: eventEnd,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

//PAIN RENDERING FROM SUPABASE
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employerId = (session.user as any).employerId ?? (session.user as any).id;

    const { data, error } = await supabase
      .from("employer_calendar")
      .select("*")
      .eq("employer_id", employerId)
      .order("event_start", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, events: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

//EDIT
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, eventTitle, eventLocation, eventDate, eventStart, eventEnd } =
      await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    const employerId = (session.user as any).employerId ?? session.user.employerId;

    const { data, error } = await supabase
      .from("employer_calendar")
      .update({
        event_title: eventTitle,
        event_location: eventLocation,
        event_date: eventDate,
        event_start: eventStart,
        event_end: eventEnd,
      })
      .eq("id", id) 
      .eq("employer_id", employerId) 
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

//DELETE
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    const employerId = (session.user as any).employerId ?? session.user.employerId;

    const { error } = await supabase
      .from("employer_calendar")
      .delete()
      .eq("id", id) // only delete this event
      .eq("employer_id", employerId); // ensure ownership

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Event deleted!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}