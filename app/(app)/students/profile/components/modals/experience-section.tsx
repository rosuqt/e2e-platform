import { Briefcase, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const colorMap: Record<string, { color: string; textColor: string }> = {
  "#2563eb": { color: "bg-blue-600", textColor: "text-white" },
  "#22c55e": { color: "bg-green-500", textColor: "text-white" },
  "#facc15": { color: "bg-yellow-400", textColor: "text-white" },
  "#f59e42": { color: "bg-orange-400", textColor: "text-white" },
  "#ef4444": { color: "bg-red-500", textColor: "text-white" },
  "#a855f7": { color: "bg-purple-500", textColor: "text-white" },
  "#64748b": { color: "bg-slate-500", textColor: "text-white" }
};

type ExperienceSectionProps = {
  experiences: {
    jobTitle: string;
    company: string;
    jobType: string;
    years: string;
    iconColor: string;
  }[];
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  deletingExpIdx: number | null;
  onAdd: () => void;
};

export default function ExperienceSection({
  experiences,
  onEdit,
  onDelete,
  deletingExpIdx,
  onAdd
}: ExperienceSectionProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Experience</h3>
      <p className="text-sm text-gray-500 mb-3 -mt-2">Showcase your work experience and roles held.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiences.map((exp, idx) => {
          const colorInfo = colorMap[exp.iconColor] || colorMap["#2563eb"];
          return (
            <div key={idx} className="flex gap-3 items-center relative">
              <div className={`${colorInfo.color} p-2 rounded-md flex items-center justify-center`} style={{ minWidth: 40, minHeight: 40 }}>
                <Briefcase size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-medium">{exp.jobTitle}</h4>
                <p className="text-sm text-gray-600">{exp.company + " | " + exp.jobType}</p>
                <p className="text-xs text-gray-500">{exp.years}</p>
              </div>
              <div className="flex items-center gap-1 absolute right-2 top-2">
                <button
                  className="flex items-center justify-center text-blue-500 hover:text-blue-700"
                  title="Edit Experience"
                  onClick={() => onEdit(idx)}
                  style={{ marginLeft: 0 }}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="flex items-center justify-center text-red-500 hover:text-red-700"
                  title="Delete Experience"
                  disabled={deletingExpIdx === idx}
                  onClick={() => onDelete(idx)}
                  style={{ marginLeft: 8 }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {deletingExpIdx === idx && (
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-red-500">
                  ...
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Button
          size="sm"
          variant="outline"
          className="border-blue-300 text-blue-600 hover:bg-blue-50"
          onClick={onAdd}
        >
          Add Experience
        </Button>
      </div>
    </div>
  );
}
