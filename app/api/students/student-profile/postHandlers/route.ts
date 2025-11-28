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
    .select("student_id, uploaded_resume_url, uploaded_cover_letter_url, updated_at, certs")
    .eq("student_id", student_id)
    .single();

  if (error && error.code === "PGRST116") {
    return NextResponse.json({ student_id });
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let uploaded_resume_url: string[] = [];
  if (profile) {
    if (Array.isArray(profile.uploaded_resume_url)) {
      uploaded_resume_url = profile.uploaded_resume_url;
    } else if (typeof profile.uploaded_resume_url === "string" && profile.uploaded_resume_url) {
      uploaded_resume_url = [profile.uploaded_resume_url];
    }
  }

  return NextResponse.json({
    ...(profile || {}),
    student_id,
    uploaded_resume_url,
  });
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
    } else if (fileType === "avatar") {
      const ext = file.name.split(".").pop() || "png";
      const adminSupabase = getAdminSupabase();

      const { data: avatarFiles } = await adminSupabase.storage
        .from("user.avatars")
        .list(student_id, { limit: 100 });
      const storagePath = `${student_id}/avatar.${ext}`;
      if (avatarFiles && avatarFiles.length > 0) {
        const toDelete = avatarFiles.map(f => `${student_id}/${f.name}`);
        if (toDelete.length > 0) {
          await adminSupabase.storage.from("user.avatars").remove(toDelete);
        }
      }

      await new Promise(res => setTimeout(res, 300));

      const fileBuffer = await file.arrayBuffer();
      const blob = new Blob([fileBuffer], { type: file.type });

      const { error: uploadError } = await adminSupabase.storage
        .from("user.avatars")
        .upload(storagePath, blob, { upsert: true, contentType: file.type });
      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }
      await supabase
        .from("student_profile")
        .update({ profile_img: storagePath, updated_at: new Date().toISOString() })
        .eq("student_id", student_id);
      return NextResponse.json({ publicUrl: storagePath });
    } else if (fileType === "cover") {
      const ext = file.name.split(".").pop() || "png";
      const adminSupabase = getAdminSupabase();
      const { data: coverFiles } = await adminSupabase.storage
        .from("user.covers")
        .list(student_id, { limit: 100 });
      const storagePath = `${student_id}/cover.${ext}`;
      if (coverFiles && coverFiles.length > 0) {
        const toDelete = coverFiles.map(f => `${student_id}/${f.name}`);
        if (toDelete.length > 0) {
          await adminSupabase.storage.from("user.covers").remove(toDelete);
        }
      }

      await new Promise(res => setTimeout(res, 300));

      const fileBuffer = await file.arrayBuffer();
      const blob = new Blob([fileBuffer], { type: file.type });

      const { error: uploadError } = await adminSupabase.storage
        .from("user.covers")
        .upload(storagePath, blob, { upsert: true, contentType: file.type });
      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }
      await supabase
        .from("student_profile")
        .update({ cover_image: storagePath, updated_at: new Date().toISOString() })
        .eq("student_id", student_id);
      return NextResponse.json({ publicUrl: storagePath });
    } else if (fileType === "portfolio") {
      if (!customPath) {
        return NextResponse.json({ error: "Missing customPath for portfolio" }, { status: 400 });
      }
      storagePath = customPath;
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
        // Remove this block if you want to allow uploads for any student_id
        // return NextResponse.json({ error: `Student first or last name not found for student_id: ${student_id}` }, { status: 400 });
      }

      const ext = file.name.split(".").pop();
      const firstName = String(studentData.first_name).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      const lastName = String(studentData.last_name).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      let fileLabel = "";
      let subfolder = "";
      if (fileType === "resume") {
        fileLabel = "RESUME";
        subfolder = "resume";
      } else {
        fileLabel = "COVER_LETTER";
        subfolder = "coverletter";
      }
      const baseFileName = `${firstName}_${lastName}_${fileLabel}`;
      let fileName = `${baseFileName}.${ext}`;
      let candidatePath = `${student_id}/${subfolder}/${fileName}`;

      const adminSupabase = getAdminSupabase();
      const { data: existingFiles } = await adminSupabase.storage
        .from("student.documents")
        .list(`${student_id}/${subfolder}`, { limit: 100 });

      let suffix = 1;
      if (existingFiles && Array.isArray(existingFiles)) {
        const existingNames = existingFiles.map(f => f.name.toUpperCase());
        while (existingNames.includes(fileName.toUpperCase())) {
          fileName = `${baseFileName}_${suffix}.${ext}`;
          candidatePath = `${student_id}/${subfolder}/${fileName}`;
          suffix++;
        }
      }
      storagePath = candidatePath;
    }

    const adminSupabase = getAdminSupabase();
    const { error: uploadError } = await adminSupabase.storage
      .from("student.documents")
      .upload(storagePath, file, { upsert: true, contentType: file.type });

    if (uploadError) {
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

    if (fileType === "portfolio") {
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

  const { data: profile } = await supabase
    .from("student_profile")
    .select("*")
    .eq("student_id", student_id)
    .single();

  let effectiveProfile = profile;
  if (!effectiveProfile) {
    const { error: upsertError } = await supabase
      .from("student_profile")
      .upsert({ student_id }, { onConflict: "student_id" });
    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }
    const { data: newProfile } = await supabase
      .from("student_profile")
      .select("*")
      .eq("student_id", student_id)
      .single();
    effectiveProfile = newProfile;
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

  if (body.action === "rename" && (body.fileType === "resume" || body.fileType === "cover_letter")) {
    const fileType = body.fileType;
    let oldName = body.oldName;
    let newName = body.newName;
    const fileUrl = body.fileUrl;
    console.log("[RENAME] Incoming body:", body);
    console.log("[RENAME] oldName:", oldName, "newName:", newName, "fileUrl:", fileUrl);
    if (!oldName || !newName || !fileUrl) {
      console.log("[RENAME] Missing value(s):", {
        oldNameMissing: !oldName,
        newNameMissing: !newName,
        fileUrlMissing: !fileUrl,
      });
      return NextResponse.json({ error: "Missing oldName, newName, or fileUrl" }, { status: 400 });
    }

    const storagePath = fileUrl.replace(/^\/storage\//, "");
    const student_id = body.student_id;
    const subfolder = fileType === "resume" ? "resume" : "coverletter";
    oldName = storagePath.split("/").pop();
    console.log("[RENAME] storagePath:", storagePath, "oldName:", oldName);

    const ext = oldName.split(".").pop();
    if (!newName.endsWith(`.${ext}`)) {
      newName = `${newName}.${ext}`;
    }
    const newPath = `${student_id}/${subfolder}/${newName}`;
    console.log("[RENAME] newName:", newName, "newPath:", newPath);

    const adminSupabase = getAdminSupabase();
    const { data: existingFiles } = await adminSupabase.storage
      .from("student.documents")
      .list(`${student_id}/${subfolder}`, { limit: 100 });
    console.log("[RENAME] existingFiles:", existingFiles);
    if (existingFiles && existingFiles.some(f => f.name === newName)) {
      console.log("[RENAME] File with this name already exists.");
      return NextResponse.json({ error: "A file with this name already exists." }, { status: 409 });
    }

    const { error: moveError } = await adminSupabase.storage
      .from("student.documents")
      .move(storagePath, newPath);
    if (moveError) {
      console.log("[RENAME] Move error:", moveError);
      return NextResponse.json({ error: moveError.message }, { status: 500 });
    }
    console.log("[RENAME] Move success");

    const { data: latestProfile } = await supabase
      .from("student_profile")
      .select("*")
      .eq("student_id", student_id)
      .single();
    const field = fileType === "resume" ? "uploaded_resume_url" : "uploaded_cover_letter_url";
    let arr: string[] = [];
    if (latestProfile && Array.isArray(latestProfile[field])) {
      arr = latestProfile[field];
    } else if (latestProfile && typeof latestProfile[field] === "string" && latestProfile[field]) {
      arr = [latestProfile[field]];
    }
 
    arr = arr.map(path =>
      path.endsWith(`/${oldName}`) ? newPath : path
    );
    console.log("[RENAME] Updated arr for DB:", arr);
    const updateObj: Record<string, unknown> = {};
    updateObj[field] = arr;
    updateObj.updated_at = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("student_profile")
      .update(updateObj)
      .eq("student_id", student_id);
    if (updateError) {
      console.log("[RENAME] DB update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    console.log("[RENAME] DB update success");
    return NextResponse.json({ success: true });
  }

  const { type, data } = body;
  if (!type) {
    return NextResponse.json({ error: "Missing type" }, { status: 400 });
  }

  if (type === "education") {
    const { school, acronym, degree, years, level, iconColor } = data;
    const educations: {
      school?: string;
      acronym?: string;
      degree?: string;
      years?: string;
      level?: string;
      iconColor?: string;
    }[] = effectiveProfile?.educations || [];
    const duplicate = educations.some(
      (e) =>
        (e.school?.trim().toLowerCase() ?? "") === String(school).trim().toLowerCase() &&
        (e.degree?.trim().toLowerCase() ?? "") === String(degree).trim().toLowerCase() &&
        (e.level?.trim().toLowerCase() ?? "") === String(level).trim().toLowerCase()
    );
    if (duplicate) {
      return NextResponse.json({ error: "DUPLICATE_EDUCATION" }, { status: 409 });
    }
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

  if (type === "expertise") {
    const { skill, mastery } = data;
    const expertise = effectiveProfile?.expertise || [];
    const exists = expertise.some(
      (e: { skill: string }) =>
        e.skill.trim().toLowerCase() === String(skill).trim().toLowerCase()
    );
    if (exists) {
      return NextResponse.json({ error: "Expertise already exists." }, { status: 409 });
    }
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

  if (type === "expertise_update") {
    const expertise = Array.isArray(data) ? data : [];
    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ expertise, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (type === "cert") {
    const { title, issuer, issueDate, description, attachmentUrl, category } = data;
    const certs = effectiveProfile?.certs || [];
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

  if (type === "cert_update") {
    const { old, data } = body;
    type Cert = {
      title: string;
      issuer: string;
      issueDate: string;
      description?: string;
      attachmentUrl?: string;
      category?: string;
    };
    let certs: Cert[] = effectiveProfile?.certs || [];
    certs = certs.map((c: Cert) =>
      c.title === old.title && c.issuer === old.issuer && c.issueDate === old.issueDate
        ? { ...c, ...data }
        : c
    );
    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ certs, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

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

  if (type === "portfolio") {
    const { title, description, link, attachmentUrl, category } = data;
    const portfolio = effectiveProfile?.portfolio || [];
    portfolio.push({ title, description, link, attachmentUrl, category });

    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ portfolio, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (type === "portfolio_update") {
    const portfolio = Array.isArray(data) ? data : [];
    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ portfolio, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (type === "experience") {
    const { jobTitle, company, jobType, years, iconColor } = data;
    const experiences = effectiveProfile?.experiences || [];
    experiences.push({ jobTitle, company, jobType, years, iconColor });

    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ experiences, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (type === "experience_update") {
    const experiences = Array.isArray(data) ? data : [];
    const { error: updateError } = await supabase
      .from("student_profile")
      .update({ experiences, updated_at: new Date().toISOString() })
      .eq("student_id", student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
