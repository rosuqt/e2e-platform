/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from "@/components/ui/pagination"
import NotificationItem from "./notification-item"

type Notif = {
  company_name: string;
  content: string;
  created_at: Date;
  external_id: string;
  source: string;
  title: string;
  updated_at: Date;
  user_id: string;
  type?: string;
  job_title: string;
}

const PAGE_SIZE = 8

export default function NotificationsPage() {
  const [notif, setnotif] = useState<Notif[]>([]);
  const [page, setPage] = useState(1);

  const fetchNotifications = async() => {
    const res = await fetch("/api/students/notifications", {
      method: "GET",
    });
    if (!res.ok) throw new Error("Failed to load notifications");
    const data = await res.json();
    setnotif(
      (data.notifications as any[]).map((n, idx) => ({
        ...n,
        company_name: n.company_name ?? "",
        job_title: n.job_title ?? "",
        created_at: n.created_at ? new Date(n.created_at) : new Date(),
        updated_at: n.updated_at ? new Date(n.updated_at) : new Date(),
        external_id: n.external_id ?? n.id?.toString() ?? `${n.title}-${n.created_at}-${idx}`,
        source: n.source ?? "",
      }))
    );
  }
  useEffect(() => { fetchNotifications() }, []);

  const total = notif?.length || 0;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const pagedNotifs = notif?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      <div className="min-h-screen max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
          <div className="p-8 md:p-12">
            <div className="pb-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-700">Notifications</h1>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Latest Notifications</h3>
              <div className="space-y-3">
                {pagedNotifs.map((notification) => (
                  <NotificationItem
                    key={notification.external_id}
                    notif={notification}
                    onClick={() => {}}
                  />
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                {pageCount > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          aria-disabled={page === 1}
                          className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: pageCount }).map((_, idx) => (
                        <PaginationItem key={idx}>
                          <PaginationLink
                            isActive={page === idx + 1}
                            onClick={() => setPage(idx + 1)}
                          >
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                          aria-disabled={page === pageCount}
                          className={page === pageCount ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}