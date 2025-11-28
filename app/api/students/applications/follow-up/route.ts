/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { applicationId, content } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderId =
      (session.user as any).studentId ?? session.user.studentId;

    if (!applicationId || !content) {
      return NextResponse.json(
        { error: "Missing applicationId or content" },
        { status: 400 }
      );
    }

    // FETCH APPLICATION 
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("job_id, followed_up")
      .eq("application_id", applicationId)
      .single();

    if (appError || !application) {
      throw new Error("Application not found.");
    }

    // STIOP IF ALREADY FOLLOWED UP
    if (application.followed_up === true) {
      return NextResponse.json(
        { error: "This application has already been followed up." },
        { status: 400 }
      );
    }

    const jobId = application.job_id;

    // FETCH JOB POSTING
    const { data: jobPosting, error: jobError } = await supabase
      .from("job_postings")
      .select("employer_id")
      .eq("id", jobId)
      .single();

    if (jobError || !jobPosting) {
      throw new Error("Job posting not found.");
    }

    const receiverId = jobPosting.employer_id;

    // CHECK IF CONVERSATION ALREADY EXISTS
    const { data: existingConversation, error: convoError } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(user1_id.eq.${senderId},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${senderId})`
      )
      .maybeSingle();

    if (convoError) throw convoError;

    let conversationId;
    let previousMessages = [];

    // IF NO CONVO → CREATE ONE
    if (!existingConversation) {
      const { data: newConvo, error: createError } = await supabase
        .from("messages")
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          messages: [],
        })
        .select()
        .single();

      if (createError) throw createError;

      conversationId = newConvo.id;
    } else {
      conversationId = existingConversation.id;
      previousMessages = existingConversation.messages || [];
    }

    // CREATE NEW MESSAGE
    const newMessage = {
      sender_id: senderId,
      content,
      time: new Date().toISOString(),
    };

    const updatedMessages = [...previousMessages, newMessage];

    const { error: updateError } = await supabase
      .from("messages")
      .update({ messages: updatedMessages })
      .eq("id", conversationId);

    if (updateError) throw updateError;

    // SET FOLLOWED_UP = TRUE
    const { error: followupError } = await supabase
      .from("applications")
      .update({ followed_up: true })
      .eq("application_id", applicationId);

    if (followupError) throw followupError;

    return NextResponse.json({
      success: true,
      conversationId,
      message: newMessage,
    });

  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json(
        { error: "Missing applicationId" },
        { status: 400 }
      );
    }

    // Fetch only the followed_up column
    const { data, error } = await supabase
      .from("applications")
      .select("followed_up")
      .eq("application_id", applicationId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Return ONLY a boolean
    return NextResponse.json({
      followed_up: data.followed_up === true,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
