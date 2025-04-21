"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { Calendar, Clock, Users, MessageSquare, Award, ChevronDown, ChevronUp, Plus, Trash2, BookOpen, Briefcase, Bus, UserCheck, Clock as ClockIcon, Lightbulb } from "lucide-react";
import type { JobPostingData } from "../../lib/types";
import React from "react";

interface ManageStepProps {
  formData: JobPostingData;
  updateFormData: (data: Partial<JobPostingData>) => void;
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
    }>
  >([]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("text");
  const [newQuestionOptions, setNewQuestionOptions] = useState("");
  const [newQuestionAutoReject, setNewQuestionAutoReject] = useState(false);

  useEffect(() => {
    setSelectedPerks(formData.perksAndBenefits || []);
    setQuestions(formData.applicationQuestions || []);
  }, [formData]);

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
    setSelectedPerks((prev) => {
      const newPerks = prev.includes(perkId) ? prev.filter((id) => id !== perkId) : [...prev, perkId];
      const updatedData = { ...formData, perksAndBenefits: newPerks };
      updateFormData(updatedData);
      sessionStorage.setItem("jobFormData", JSON.stringify(updatedData));
      return newPerks;
    });
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      const options =
        newQuestionType !== "text" && newQuestionOptions.trim()
          ? newQuestionOptions.split(",").map((opt) => opt.trim())
          : undefined;

      const updatedQuestions = [
        ...questions,
        {
          question: newQuestion,
          type: newQuestionType,
          options,
          autoReject: newQuestionAutoReject,
        },
      ];

      setQuestions(updatedQuestions);
      const updatedData = { ...formData, applicationQuestions: updatedQuestions };
      updateFormData(updatedData);
      sessionStorage.setItem("jobFormData", JSON.stringify(updatedData));
      setNewQuestion("");
      setNewQuestionOptions("");
      setNewQuestionAutoReject(false);
      setNewQuestionType("text");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-full">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Manage applications</h2>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline-date" className="text-sm text-gray-600 mb-1.5 block">
                        Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="deadline-date"
                          type="date"
                          value={formData.applicationDeadline?.date || ""}
                          onChange={(e) =>
                            updateFormData({
                              applicationDeadline: {
                                ...formData.applicationDeadline,
                                date: e.target.value,
                              },
                            })
                          }
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deadline-time" className="text-sm text-gray-600 mb-1.5 block">
                        Time
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="deadline-time"
                          type="time"
                          value={formData.applicationDeadline?.time || ""}
                          onChange={(e) =>
                            updateFormData({
                              applicationDeadline: {
                                ...formData.applicationDeadline,
                                time: e.target.value,
                              },
                            })
                          }
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
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
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      min="1"
                      value={formData.maxApplicants}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          updateFormData({ maxApplicants: e.target.value });
                        } else if (e.target.value === "") {
                          updateFormData({ maxApplicants: "" });
                        }
                      }}
                      placeholder="Number of applicants"
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
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
                        </SelectContent>
                      </Select>
                    </div>

                    <AnimatePresence>
                      {newQuestionType !== "text" && (
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
                              onChange={(e) => setNewQuestionOptions(e.target.value)}
                              placeholder="Option 1, Option 2, Option 3"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Separate each option with a comma (e.g. Yes, No, Maybe)
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoReject"
                        checked={newQuestionAutoReject}
                        onCheckedChange={(checked) => setNewQuestionAutoReject(checked === true)}
                        className="data-[state=checked]:bg-red-500 border-red-200"
                      />
                      <Label htmlFor="autoReject" className="text-sm text-gray-700">
                        Auto-reject if answer doesn&apos;t match criteria
                      </Label>
                    </div>

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
                                        : "Multi select"}
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
                                  const updatedData = { ...formData, applicationQuestions: updatedQuestions };
                                  updateFormData(updatedData);
                                  sessionStorage.setItem("jobFormData", JSON.stringify(updatedData)); // Store in sessionStorage
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
                onClick={(e) => e.stopPropagation()} // Prevent event propagation
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

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mt-6">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <span className="font-medium">Pro tip:</span> Adding screening questions helps you filter candidates more
          efficiently and reduces time spent on unsuitable applicants.
        </p>
      </div>
    </div>
  );
}
