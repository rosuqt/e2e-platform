import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const student_id = searchParams.get("student_id");
  if (!student_id) {
    return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
  }
  const { data: profile, error } = await supabase
    .from("student_profile")
    .select("uploaded_resume_url, uploaded_cover_letter_url, updated_at")
    .eq("student_id", student_id)
    .single();

  if (error && error.code === "PGRST116") {
    return NextResponse.json({});
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(profile || {});
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string;
    const student_id = formData.get("student_id") as string;

    if (!file || !fileType || !student_id) {
      return NextResponse.json({ error: "Missing file, fileType, or student_id" }, { status: 400 });
    }

    const { data: studentData, error: studentError } = await supabase
      .from("registered_students")
      .select("last_name")
      .eq("student_id", student_id)
      .single();

    if (studentError) {
      return NextResponse.json({ error: `Student fetch error: ${studentError.message}` }, { status: 400 });
    }
    if (!studentData?.last_name) {
      return NextResponse.json({ error: `Student last name not found for student_id: ${student_id}` }, { status: 400 });
    }

    const lastName = String(studentData.last_name).replace(/\s+/g, '').toUpperCase();
    const ext = file.name.split(".").pop();
    const fileLabel = fileType === "resume" ? "RESUME" : "COVER_LETTER";
    const fileName = `${lastName}_${fileLabel}.${ext}`;
    const storagePath = `${student_id}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("student.documents")
      .upload(storagePath, uint8Array, { upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const updateObj: Record<string, string> = {};
    if (fileType === "resume") updateObj.uploaded_resume_url = storagePath;
    if (fileType === "cover_letter") updateObj.uploaded_cover_letter_url = storagePath;
    updateObj.updated_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("student_profile")
      .update(updateObj)
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  const { type, student_id, data } = await req.json();

  if (!student_id || !type) {
    return NextResponse.json({ error: "Missing student_id or type" }, { status: 400 });
  }

  let { data: profile } = await supabase
    .from("student_profile")
    .select("*")
    .eq("student_id", student_id)
    .single();

  if (!profile) {
    const { error: insertError } = await supabase
      .from("student_profile")
      .insert({ student_id });
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    const { data: newProfile } = await supabase
      .from("student_profile")
      .select("*")
      .eq("student_id", student_id)
      .single();
    profile = newProfile;
  }

  // Add Education Modal
  if (type === "education") {
    const { school, acronym, degree, years, level, iconColor } = data;
    const educations = profile?.educations || [];
    educations.push({ school, acronym, degree, years, level, iconColor });

    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ educations, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  // Add Expertise Modal
  if (type === "expertise") {
    const { skill, mastery } = data;
    const expertise = profile?.expertise || [];
    expertise.push({ skill, mastery });

    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ expertise, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  // Add Certificate Modal
  if (type === "cert") {
    const { title, issuer, issueDate, description, attachmentUrl, category } = data;
    const certs = profile?.certs || [];
    certs.push({ title, issuer, issueDate, description, attachmentUrl, category });

    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ certs, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  // Add/Edit Contact Modal
  if (type === "contact") {
    const { email, countryCode, phone, socials } = data;
    const contact_info = { email, countryCode, phone, socials };

    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ contact_info, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
