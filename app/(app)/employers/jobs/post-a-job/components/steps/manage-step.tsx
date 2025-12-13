"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { Calendar,  Users, MessageSquare, Award, ChevronDown, ChevronUp, Plus, Trash2, BookOpen, Briefcase, Bus, UserCheck, Clock as ClockIcon, Lightbulb } from "lucide-react";
import type { JobPostingData } from "../../lib/types";
import React from "react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface ManageStepProps {
  formData: JobPostingData;
  updateFormData: (data: Partial<JobPostingData>) => void;
}

function arraysEqual(a: unknown[], b: unknown[]) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (typeof a[i] === "object" && typeof b[i] === "object") {
      if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
    } else {
      if (a[i] !== b[i]) return false;
    }
  }
  return true;
}

export function ManageStep({ formData, updateFormData }: ManageStepProps) {
  const [sections, setSections] = useState({
    deadline: true,
    maxApplicants: true,
    questions: true,
    perks: true,
  });

  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);
  const [questions, setQuestions] = useState<
    Array<{
      question: string;
      type: string;
      options?: string[];
      autoReject: boolean;
      correctAnswer?: string | string[];
    }>
  >([]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("text");
  const [newQuestionOptions, setNewQuestionOptions] = useState("");
  const [newQuestionAutoReject, setNewQuestionAutoReject] = useState(false);
  const [newQuestionCorrectAnswer, setNewQuestionCorrectAnswer] = useState<string | string[]>("");
  const [textAutoRejectKeywords, setTextAutoRejectKeywords] = useState("");
  const [deadlineError, setDeadlineError] = useState<string | null>(null);
  const [newQuestionOptionsError, setNewQuestionOptionsError] = useState<string | null>(null);
  const [maxApplicantsError, setMaxApplicantsError] = useState<string | null>(null);

  const syncingPerks = useRef(false);
  const syncingQuestions = useRef(false);

  useEffect(() => {
    if (!arraysEqual(selectedPerks, formData.perksAndBenefits || [])) {
      syncingPerks.current = true;
      setSelectedPerks(formData.perksAndBenefits || []);
    }
  }, [formData.perksAndBenefits]);

  useEffect(() => {
    if (!arraysEqual(questions, formData.applicationQuestions || [])) {
      syncingQuestions.current = true;
      setQuestions(formData.applicationQuestions || []);
    }
  }, [formData.applicationQuestions]);

  useEffect(() => {
    if (syncingPerks.current) {
      syncingPerks.current = false;
      return;
    }
    if (
      !arraysEqual(formData.perksAndBenefits || [], selectedPerks)
      && !arraysEqual(selectedPerks, [])
    ) {
      const updatedData = { ...formData, perksAndBenefits: selectedPerks };
      updateFormData(updatedData);
      sessionStorage.setItem("jobFormData", JSON.stringify(updatedData));
    }
  }, [selectedPerks, formData, updateFormData]);

  useEffect(() => {
    if (syncingQuestions.current) {
      syncingQuestions.current = false;
      return;
    }
    if (
      !arraysEqual(formData.applicationQuestions || [], questions)
      && !arraysEqual(questions, [])
    ) {
      const updatedData = { ...formData, applicationQuestions: questions };
      updateFormData(updatedData);
      sessionStorage.setItem("jobFormData", JSON.stringify(updatedData));
    }
  }, [questions, formData, updateFormData]);

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => {
      const next = { ...prev, [section]: !prev[section] }
      setTimeout(() => {
        if (!next[section]) {
          if (section === "deadline") {
            updateFormData({ applicationDeadline: { date: "", time: "" } })
          }
          if (section === "maxApplicants") {
            updateFormData({ maxApplicants: "" })
          }
          if (section === "questions") {
            setQuestions([])
          }
          if (section === "perks") {
            setSelectedPerks([])
          }
        }
      }, 0)
      return next
    })
  };

  const perks = [
    { id: "training", label: "Free Training & Workshops - Skill development", icon: <BookOpen className="h-5 w-5 text-green-500" />, checked: false },
    { id: "certification", label: "Certification Upon Completion - Proof of experience", icon: <Award className="h-5 w-5 text-blue-500" />, checked: false },
    { id: "potential", label: "Potential Job Offer - Possible full-time employment", icon: <Briefcase className="h-5 w-5 text-yellow-500" />, checked: false },
    { id: "transportation", label: "Transportation Allowance - Support for expenses", icon: <Bus className="h-5 w-5 text-purple-500" />, checked: false },
    { id: "mentorship", label: "Mentorship & Guidance - Hands-on learning", icon: <UserCheck className="h-5 w-5 text-orange-500" />, checked: false },
    { id: "flexible", label: "Flexible Hours - Adjusted schedules for students", icon: <ClockIcon className="h-5 w-5 text-pink-500" />, checked: false },
  ];

  const handlePerkChange = (perkId: string) => {
    setSelectedPerks((prev) =>
      prev.includes(perkId) ? prev.filter((id) => id !== perkId) : [...prev, perkId]
    );
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      if (newQuestionType === "text" && newQuestionAutoReject) {
        if (!textAutoRejectKeywords.trim()) {
          setNewQuestionOptionsError("Enter at least one keyword for auto-reject.");
          return;
        }
        setNewQuestionOptionsError(null);
      }
      if (newQuestionType !== "text") {
        if (newQuestionType === "yesno") {
          setNewQuestionOptionsError(null);
          if (newQuestionAutoReject && (newQuestionCorrectAnswer !== "Yes" && newQuestionCorrectAnswer !== "No")) {
            setNewQuestionOptionsError("Select the correct answer for auto-reject.");
            return;
          }
        } else {
          if (!newQuestionOptions.trim()) {
            setNewQuestionOptionsError("Options are required for this answer type.");
            return;
          }
          const optionsArr = newQuestionOptions.split(",").map((opt) => opt.trim());
          if (optionsArr.length < 2) {
            setNewQuestionOptionsError("Enter at least two options, separated by commas.");
            return;
          }
          if (newQuestionType === "multi") {
            const lower = optionsArr.map((o) => o.toLowerCase());
            const hasDuplicates = new Set(lower).size !== lower.length;
            if (hasDuplicates) {
              setNewQuestionOptionsError("Options must not contain duplicates.");
              return;
            }
            if (newQuestionAutoReject && (!Array.isArray(newQuestionCorrectAnswer) || (newQuestionCorrectAnswer as string[]).length === 0)) {
              setNewQuestionOptionsError("Select at least one correct answer for auto-reject.");
              return;
            }
          }
          if (newQuestionType === "single" && newQuestionAutoReject && (!newQuestionCorrectAnswer || !(optionsArr.includes(newQuestionCorrectAnswer as string)))) {
            setNewQuestionOptionsError("Select the correct answer for auto-reject.");
            return;
          }
          setNewQuestionOptionsError(null);
        }
      }
      const options =
        newQuestionType === "yesno"
          ? ["Yes", "No"]
          : newQuestionType !== "text" && newQuestionOptions.trim()
            ? newQuestionOptions.split(",").map((opt) => opt.trim())
            : undefined;

      const correctAnswer =
        newQuestionAutoReject
          ? newQuestionType === "multi"
            ? newQuestionCorrectAnswer
            : newQuestionType === "text"
              ? textAutoRejectKeywords.split(",").map((k) => k.trim()).filter(Boolean)
              : newQuestionCorrectAnswer
          : undefined;

      const updatedQuestions = [
        ...questions,
        {
          question: newQuestion,
          type: newQuestionType,
          options: options && Array.isArray(options) ? options : undefined,
          autoReject: newQuestionAutoReject,
          correctAnswer,
        },
      ];

      setQuestions(updatedQuestions);
      setNewQuestion("");
      setNewQuestionOptions("");
      setNewQuestionAutoReject(false);
      setNewQuestionType("text");
      setNewQuestionCorrectAnswer("");
      setTextAutoRejectKeywords("");
      setNewQuestionOptionsError(null);
    }
  };

  const validateDeadline = (date: string) => {
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    if (isNaN(selected.getTime())) return "Invalid date";
    if (selected < today) return "Date must be today or in the future";
    const year = selected.getFullYear();
    const currentYear = today.getFullYear();
    if (year < currentYear || year > currentYear + 10) return `Year must be between ${currentYear} and ${currentYear + 10}`;
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 pb-2 border-b border-blue-100">
        <div className="bg-blue-100 p-2 rounded-full">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Manage applications</h2>
      </div>

      <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
        <p className="text-sm text-blue-700 flex items-center">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <span className="font-medium ">Pro tip: </span>{" "}
          <span>
           Helps you filter candidates more efficiently and reduces time spent on unsuitable applicants.{" "}
            <span className="font-bold">You can skip it if you prefer.</span>
          </span>
        </p>
      </div>

      <div className="space-y-5">
        {/* Application Deadline */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <div
            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between cursor-pointer border-b border-gray-100"
            onClick={() => toggleSection("deadline")}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={sections.deadline}
                onCheckedChange={() => toggleSection("deadline")}
                onClick={(e) => e.stopPropagation()}
                className="data-[state=checked]:bg-blue-500 border-blue-300"
              />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-gray-800">Application Deadline</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 hidden md:block">
                Specify an application deadline to automatically close the job posting
              </div>
              {sections.deadline ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          <AnimatePresence>
            {sections.deadline && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-5">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deadline-date" className="text-sm text-gray-600 mb-1.5 block">
                          Date
                        </Label>
                        <DatePicker
                          value={formData.applicationDeadline?.date ? new Date(formData.applicationDeadline.date) : null}
                          onChange={(date) => {
                            const value = date instanceof Date && !isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : "";
                            const err = validateDeadline(value);
                            setDeadlineError(err);
                            updateFormData({
                              applicationDeadline: {
                                ...formData.applicationDeadline,
                                date: value,
                              },
                            });
                          }}
                          slotProps={{
                            textField: {
                              id: "deadline-date",
                              size: "small",
                              error: !!deadlineError,
                              helperText: deadlineError || "",
                              fullWidth: true,
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="deadline-time" className="text-sm text-gray-600 mb-1.5 block">
                          Time
                        </Label>
                        <TimePicker
                          value={
                            formData.applicationDeadline?.time
                              ? (() => {
                                  const [h, m] = formData.applicationDeadline.time.split(":");
                                  const d = new Date();
                                  d.setHours(Number(h) || 0, Number(m) || 0, 0, 0);
                                  return d;
                                })()
                              : null
                          }
                          onChange={(date) => {
                            const value =
                              date instanceof Date && !isNaN(date.getTime())
                                ? date.toTimeString().slice(0, 5)
                                : "";
                            let deadlineDate = formData.applicationDeadline?.date;
                            if (!deadlineDate && value) {
                              const today = new Date();
                              deadlineDate = today.toISOString().slice(0, 10);
                            }
                            updateFormData({
                              applicationDeadline: {
                                ...formData.applicationDeadline,
                                date: deadlineDate,
                                time: value,
                              },
                            });
                          }}
                          slotProps={{
                            textField: {
                              id: "deadline-time",
                              size: "small",
                              fullWidth: true,
                            }
                          }}
                        />
                      </div>
                    </div>
                  </LocalizationProvider>
                  <p className="text-xs text-gray-500 mt-3">
                    Your job posting will automatically close at this date and time.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Max Applicant */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <div
            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between cursor-pointer border-b border-gray-100"
            onClick={() => toggleSection("maxApplicants")}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={sections.maxApplicants}
                onCheckedChange={() => toggleSection("maxApplicants")}
                onClick={(e) => e.stopPropagation()}
                className="data-[state=checked]:bg-blue-500 border-blue-300"
              />
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-gray-800">Max Applicants</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 hidden md:block">
                Limit how many candidates can apply before the job closes
              </div>
              {sections.maxApplicants ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          <AnimatePresence>
            {sections.maxApplicants && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-5">
                  <div className="relative flex flex-col">
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        type="number"
                        min="1"
                        max="10000"
                        value={formData.maxApplicants}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            setMaxApplicantsError(null);
                            updateFormData({ maxApplicants: "" });
                            return;
                          }
                          const num = Number.parseInt(value);
                          if (isNaN(num) || num < 1) {
                            setMaxApplicantsError("Enter a valid number greater than 0.");
                            updateFormData({ maxApplicants: "" });
                          } else if (num > 10000) {
                            setMaxApplicantsError("Number of applicants must not exceed 10,000.");
                            updateFormData({ maxApplicants: "" });
                          } else {
                            setMaxApplicantsError(null);
                            updateFormData({ maxApplicants: value });
                          }
                        }}
                        placeholder="Number of applicants"
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 ${maxApplicantsError ? "border-red-500" : ""}`}
                      />
                    </div>
                    {maxApplicantsError && (
                      <div className="text-xs text-red-500 mt-1">{maxApplicantsError}</div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Your job posting will automatically close when this number of applications is reached.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Application questions */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <div
            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between cursor-pointer border-b border-gray-100"
            onClick={() => toggleSection("questions")}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={sections.questions}
                onCheckedChange={() => toggleSection("questions")}
                onClick={(e) => e.stopPropagation()}
                className="data-[state=checked]:bg-blue-500 border-blue-300"
              />
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-gray-800">Application Questions</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 hidden md:block">
                Ask candidates specific questions to filter and pre-screen applicants
              </div>
              {sections.questions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          <AnimatePresence>
            {sections.questions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-5 space-y-5">
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                      <Label htmlFor="question" className="text-sm text-gray-700 mb-1.5 block">
                        Question
                      </Label>
                      <Input
                        id="question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="e.g. Do you have experience with React?"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="questionType" className="text-sm text-gray-700 mb-1.5 block">
                        Answer type
                      </Label>
                      <Select value={newQuestionType} onValueChange={setNewQuestionType}>
                        <SelectTrigger id="questionType" className="border-gray-200 focus:ring-blue-500">
                          <SelectValue placeholder="Select answer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text answer</SelectItem>
                          <SelectItem value="single">Single select</SelectItem>
                          <SelectItem value="multi">Multi select</SelectItem>
                          <SelectItem value="yesno">Yes or No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <AnimatePresence>
                      {newQuestionType !== "text" && newQuestionType !== "yesno" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div>
                            <Label htmlFor="options" className="text-sm text-gray-700 mb-1.5 block">
                              Options (comma separated)
                            </Label>
                            <Input
                              id="options"
                              value={newQuestionOptions}
                              onChange={(e) => {
                                setNewQuestionOptions(e.target.value);
                                setNewQuestionOptionsError(null);
                                setNewQuestionCorrectAnswer("");
                              }}
                              placeholder="Option 1, Option 2, Option 3"
                              className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${newQuestionOptionsError ? "border-red-500" : ""}`}
                            />
                            {newQuestionAutoReject && (
                              <div className="mt-2">
                                <Label className="text-sm text-gray-700 mb-1.5 block">
                                  Select correct answer{newQuestionType === "multi" ? "(s)" : ""}
                                </Label>
                                {newQuestionType === "single" && (
                                  <Select
                                    value={typeof newQuestionCorrectAnswer === "string" ? newQuestionCorrectAnswer : ""}
                                    onValueChange={setNewQuestionCorrectAnswer}
                                  >
                                    <SelectTrigger className="border-gray-200 focus:ring-blue-500">
                                      <SelectValue placeholder="Select correct answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {newQuestionOptions
                                        .split(",")
                                        .map((opt) => opt.trim())
                                        .filter((opt) => opt)
                                        .map((opt, idx) => (
                                          <SelectItem key={idx} value={opt}>
                                            {opt}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                )}
                                {newQuestionType === "multi" && (
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {newQuestionOptions
                                      .split(",")
                                      .map((opt) => opt.trim())
                                      .filter((opt) => opt)
                                      .map((opt, idx) => (
                                        <label key={idx} className="flex items-center gap-1 text-sm">
                                          <input
                                            type="checkbox"
                                            checked={Array.isArray(newQuestionCorrectAnswer) && newQuestionCorrectAnswer.includes(opt)}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setNewQuestionCorrectAnswer((prev) =>
                                                  Array.isArray(prev) ? [...prev, opt] : [opt]
                                                );
                                              } else {
                                                setNewQuestionCorrectAnswer((prev) =>
                                                  Array.isArray(prev) ? prev.filter((v) => v !== opt) : []
                                                );
                                              }
                                            }}
                                          />
                                          {opt}
                                        </label>
                                      ))}
                                  </div>
                                )}
                              </div>
                            )}
                            {newQuestionOptionsError && (
                              <div className="text-xs text-red-500 mt-1">{newQuestionOptionsError}</div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Separate each option with a comma (e.g. Yes, No, Maybe)
                            </p>
                          </div>
                        </motion.div>
                      )}
                      {newQuestionType === "yesno" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div>
                            <Label className="text-sm text-gray-700 mb-1.5 block">
                              Options
                            </Label>
                            <div className="text-gray-800 text-sm mb-2">Yes, No</div>
                            {newQuestionAutoReject && (
                              <div>
                                <Label className="text-sm text-gray-700 mb-1.5 block">
                                  Select correct answer
                                </Label>
                                <Select
                                  value={typeof newQuestionCorrectAnswer === "string" ? newQuestionCorrectAnswer : ""}
                                  onValueChange={setNewQuestionCorrectAnswer}
                                >
                                  <SelectTrigger className="border-gray-200 focus:ring-blue-500">
                                    <SelectValue placeholder="Select correct answer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                      {newQuestionType === "text" && newQuestionAutoReject && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div>
                            <Label htmlFor="text-keywords" className="text-sm text-gray-700 mb-1.5 block">
                              Auto-reject keywords (comma separated)
                            </Label>
                            <Input
                              id="text-keywords"
                              value={textAutoRejectKeywords}
                              onChange={e => {
                                setTextAutoRejectKeywords(e.target.value);
                                setNewQuestionOptionsError(null);
                              }}
                              placeholder="e.g. React, Node.js, Internship"
                              className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${newQuestionOptionsError ? "border-red-500" : ""}`}
                            />
                            {newQuestionOptionsError && (
                              <div className="text-xs text-red-500 mt-1">{newQuestionOptionsError}</div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Enter keywords that must be present in the answer. Separate with commas.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {newQuestionType !== "text" && (
                      <div className="flex items-center space-x-2">
                       
                      </div>
                    )}
                    {newQuestionType === "text" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="autoRejectText"
                          checked={newQuestionAutoReject}
                          onCheckedChange={(checked) => setNewQuestionAutoReject(checked === true)}
                          className="data-[state=checked]:bg-red-500 border-red-200"
                        />
                        <Label htmlFor="autoRejectText" className="text-sm text-gray-700">
                          Auto-reject if answer does not contain required keywords
                        </Label>
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={addQuestion}
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add Question
                    </Button>
                  </div>

                  <AnimatePresence>
                    {questions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <h4 className="font-medium text-sm text-gray-700">Added Questions:</h4>
                        {questions.map((q, index) => (
                          <motion.div
                            key={index}
                            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <p className="font-medium text-gray-800">{q.question}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    {q.type === "text"
                                      ? "Text"
                                      : q.type === "single"
                                        ? "Single select"
                                        : q.type === "multi"
                                          ? "Multi select"
                                          : "Yes/No"}
                                  </span>
                                  {q.autoReject && (
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                      Auto-reject
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 -mt-1 -mr-1"
                                onClick={() => {
                                  const updatedQuestions = questions.filter((_, i) => i !== index);
                                  setQuestions(updatedQuestions);
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            {q.options && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Options:</p>
                                <div className="flex flex-wrap gap-1">
                                  {q.options.map((opt, i) => (
                                    <span
                                      key={i}
                                      className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                                    >
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Perks and benefits */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <div
            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between cursor-pointer border-b border-gray-100"
            onClick={() => toggleSection("perks")}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={sections.perks}
                onCheckedChange={() => toggleSection("perks")}
                onClick={(e) => e.stopPropagation()} 
                className="data-[state=checked]:bg-blue-500 border-blue-300"
              />
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-gray-800">Perks and Benefits</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 hidden md:block">
                Highlight the advantages of the role that support and attract candidates
              </div>
              {sections.perks ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          <AnimatePresence>
            {sections.perks && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-5">
                  <p className="text-sm text-gray-700 mb-4">
                    Select all the perks and benefits you offer for this position
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {perks.map((perk) => (
                      <div
                        key={perk.id}
                        className={`flex items-start p-3 rounded-lg border ${
                          selectedPerks.includes(perk.id)
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } transition-colors cursor-pointer`}
                        onClick={() => handlePerkChange(perk.id)}
                      >
                        <Checkbox
                          id={perk.id}
                          checked={selectedPerks.includes(perk.id)}
                          onCheckedChange={() => handlePerkChange(perk.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 data-[state=checked]:bg-blue-500 border-blue-300"
                        />
                        <div className="ml-2 flex items-center gap-2">
                          {React.cloneElement(perk.icon, { className: "h-4 w-4 " + perk.icon.props.className })}
                          <Label htmlFor={perk.id} className="text-sm cursor-pointer">
                            {perk.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
