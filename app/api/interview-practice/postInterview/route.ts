import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    student_id,
    interview_type,
    difficulty,
    answer_type,
    questions,
    answers,
    tips,
    suggestions,
    duration,
    score,
    finished_at
  } = body;

  let question_scores: string | null = null;
  if (Array.isArray(body.scores)) {
    question_scores = JSON.stringify(body.scores);
  } else if (Array.isArray(body.questionScores)) {
    question_scores = JSON.stringify(body.questionScores);
  } else if (typeof body.question_scores === "string") {
    question_scores = body.question_scores;
  }

  let speech_speed: string | null = null;
  if (Array.isArray(body.speechSpeeds)) {
    speech_speed = JSON.stringify(body.speechSpeeds);
  } else if (typeof body.speech_speed === "string") {
    speech_speed = body.speech_speed;
  }

  let filler_words: string | null = null;
  if (Array.isArray(body.fillerWordsArr)) {
    filler_words = JSON.stringify(body.fillerWordsArr);
  } else if (typeof body.filler_words === "string") {
    filler_words = body.filler_words;
  }

  if (
    !student_id ||
    !interview_type ||
    !difficulty ||
    !answer_type ||
    !questions ||
    !answers ||
    !duration ||
    !finished_at
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("interview_practice_history")
    .insert([
      {
        student_id,
        interview_type,
        difficulty,
        answer_type,
        questions,
        answers,
        tips,
        suggestions,
        duration,
        score,
        finished_at,
        question_scores,
        speech_speed,
        filler_words
      }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
