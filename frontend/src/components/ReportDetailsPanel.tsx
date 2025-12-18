"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: number;
  text: string;
  type: string;
  required?: boolean;
  options?: string[];
}

interface Report {
  id: number;
  status: string;
  data: string;
  remarks: string | null;
  form: {
    title: string;
    questions: string;
  };
  inspector: {
    name: string;
  };
  reviewedBy?: {
    name: string;
  };
  createdAt: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  aiSummary?: string | null;
}

interface ReportDetailsPanelProps {
  report: Report | null;
  onClose: () => void;
}

export default function ReportDetailsPanel({
  report,
  onClose,
}: ReportDetailsPanelProps) {
  const parseQuestions = (questionsStr: string): Question[] => {
    try {
      return JSON.parse(questionsStr);
    } catch {
      return [];
    }
  };

  const parseAnswers = (dataStr: string): Record<string, string> => {
    try {
      // Handle double-encoded JSON
      let parsed = JSON.parse(dataStr);
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      return parsed;
    } catch {
      return {};
    }
  };

  const getAnswerForQuestion = (
    questionId: number,
    answers: Record<string, string>
  ): string => {
    return answers[questionId.toString()] || "No answer provided";
  };

  if (!report) return null;

  return (
    <AnimatePresence>
      {report && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[90vw] md:w-150 lg:w-175 xl:w-200 bg-white shadow-2xl z-50 scrollbar-hide overflow-y-auto"
          >
            {/* Header - Sticky */}
            <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between z-10 shadow-sm">
              <div className="flex-1 min-w-0 mr-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {report.form.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Report ID: #{report.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close panel"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Report Metadata */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">
                    Report Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base text-gray-600">
                        Status:
                      </span>
                      <Badge className="bg-green-500 rounded-md w-fit">
                        {report.status}
                      </Badge>
                    </div>
                    
                    {report.aiSummary && (
                      <div className="col-span-1 bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <h4 className="text-sm font-semibold text-purple-900 mb-1 flex items-center gap-2">
                          ✨ AI Summary & Evaluation
                        </h4>
                        <p className="text-sm text-purple-800 leading-relaxed">
                          {report.aiSummary}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base text-gray-600">
                        Inspector:
                      </span>
                      <span className="text-sm sm:text-base font-medium">
                        {report.inspector.name}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base text-gray-600">
                        Created:
                      </span>
                      <span className="text-sm sm:text-base font-medium">
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {report.submittedAt && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                        <span className="text-sm sm:text-base text-gray-600">
                          Submitted:
                        </span>
                        <span className="text-sm sm:text-base font-medium">
                          {new Date(report.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {report.reviewedBy && (
                      <>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-sm sm:text-base text-gray-600">
                            Reviewed by:
                          </span>
                          <span className="text-sm sm:text-base font-medium">
                            {report.reviewedBy.name}
                          </span>
                        </div>
                        {report.reviewedAt && (
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm sm:text-base text-gray-600">
                              Reviewed at:
                            </span>
                            <span className="text-sm sm:text-base font-medium">
                              {new Date(report.reviewedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {report.remarks && (
                      <div className="pt-3 border-t">
                        <span className="text-sm sm:text-base text-gray-600 block mb-2">
                          Remarks:
                        </span>
                        <p className="text-xs sm:text-sm bg-gray-50 p-3 rounded-md wrap-break-word">
                          {report.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Questions and Answers */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">
                    Inspection Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {parseQuestions(report.form.questions).map(
                      (question, index) => {
                        const answers = parseAnswers(report.data);
                        const answer = getAnswerForQuestion(
                          question.id,
                          answers
                        );

                        return (
                          <div
                            key={question.id}
                            className="pb-6 border-b last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              <span className="hrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm">
                                {index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base font-medium text-gray-900 mb-2 wrap-break-word">
                                  {question.text}
                                  {question.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </p>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-xs sm:text-sm text-gray-700 wrap-break-word">
                                    {answer}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Type: {question.type}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
