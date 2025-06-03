import { NextRequest, NextResponse } from "next/server";
import supabase, { getAdminSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const student_id = searchParams.get("student_id");
  if (!student_id) {
    return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
  }
  const { data: profile, error } = await supabase
    .from("student_profile")
    .select("uploaded_resume_url, uploaded_cover_letter_url, updated_at, certs") 
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
    const customPath = formData.get("customPath") as string | null;

    if (!file || !fileType || !student_id) {
      return NextResponse.json({ error: "Missing file, fileType, or student_id" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("student_profile")
      .select("*")
      .eq("student_id", student_id)
      .single();

    let storagePath = "";
    if (fileType === "cert" && customPath) {
      storagePath = customPath;
    } else if (fileType === "cert") {
      let certTitle = formData.get("certTitle") as string | undefined;
      if (!certTitle) certTitle = "CERTIFICATE";
      const safeTitle = certTitle
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
      const ext = file.name.split(".").pop();
      const fileName = `${safeTitle}.${ext}`;
      storagePath = `${student_id}/certs/${fileName}`;
    } else {
      const { data: studentData, error: studentError } = await supabase
        .from("registered_students")
        .select("first_name, last_name")
        .eq("id", student_id)
        .single();

      if (studentError) {
        return NextResponse.json({ error: `Student fetch error: ${studentError.message}` }, { status: 400 });
      }
      if (!studentData?.first_name || !studentData?.last_name) {
        return NextResponse.json({ error: `Student first or last name not found for student_id: ${student_id}` }, { status: 400 });
      }

      const ext = file.name.split(".").pop();
      const fileLabel = fileType === "resume" ? "RESUME" : "COVER_LETTER";
      const subfolder = fileType === "resume" ? "resume" : "coverletter";
      const originalBase = file.name.replace(/\.[^/.]+$/, "");
      const safeBase = originalBase.replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/\s+/g, "_").slice(0, 32);
      const rand = Math.floor(1000 + Math.random() * 9000);
      const fileName = `${safeBase}_${fileLabel}_${rand}.${ext}`;
      storagePath = `${student_id}/${subfolder}/${fileName}`;
    }

    const adminSupabase = getAdminSupabase();
    const { error: uploadError } = await adminSupabase.storage
      .from("student.documents")
      .upload(storagePath, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      console.error("Upload error:", uploadError, "storagePath:", storagePath, "fileType:", fileType, "fileName:", file?.name);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    if (fileType === "resume" || fileType === "cover_letter") {

      const field = fileType === "resume" ? "uploaded_resume_url" : "uploaded_cover_letter_url";
      let currentArr: string[] = [];
      if (profile && Array.isArray(profile[field])) {
        currentArr = profile[field];
      } else if (profile && typeof profile[field] === "string" && profile[field]) {
        currentArr = [profile[field]];
      }

      if (!currentArr.includes(storagePath)) {
        currentArr.push(storagePath);
      }
      if (currentArr.length > 3) {
        currentArr = currentArr.slice(-3);
      }
      const updateObj: Record<string, unknown> = {};
      updateObj[field] = currentArr;
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

    if (fileType === "cert") {
      return NextResponse.json({ data: { path: storagePath } });
    }
  }

  const body = await req.json();
  let student_id = body.student_id;

  if (!student_id) {

    try {
      const { getServerSession } = await import("next-auth");
      const authOptions = (await import("../../../../../lib/authOptions")).authOptions;
      const session = await getServerSession(authOptions);
      student_id = (session?.user as { studentId?: string })?.studentId;
    } catch {

    }
  }

  if (!student_id) {
    return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
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

  const updatableFields = ["skills", "introduction", "career_goals", "short_bio", "profile_img", "cover_image"];
  const updateObj: Record<string, unknown> = {};
  for (const field of updatableFields) {
    if (field in body) {
      updateObj[field] = body[field];
    }
  }
  if (Object.keys(updateObj).length > 0) {
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

  const { type, data } = body;
  if (!type) {
    return NextResponse.json({ error: "Missing type" }, { status: 400 });
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
