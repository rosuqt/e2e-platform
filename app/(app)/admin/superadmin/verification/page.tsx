/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, Eye, CheckCircle, XCircle, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Avatar from "@mui/material/Avatar"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { RejectionDialog } from "./components/rejectiondialog"

// 1. Data Structure Interface
interface VerificationDocument {
  id: string
  first_name: string
  last_name: string
  employer_id: string
  company_name: string
  submitted_at: string
  status: string
  file_type: string | null
  file_path: string
  signed_url: string | null
  description?: string
  reason?: string 
  signed_url_error?: any
}

// 2. Table Component Props Interface (Fixes the ts(7006) error)
interface DocumentsTableProps {
  docs: VerificationDocument[]
  anchorEls: { [key: string]: HTMLElement | null }
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, id: string) => void
  handleMenuClose: (id: string) => void
  onView: (doc: VerificationDocument) => void
  onApprove: (id: string) => void
  onOpenReject: (doc: VerificationDocument) => void
}

export default function VerificationManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(null)
  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({})
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  
  const fetchVerifications = async () => {
    try {
      const res = await fetch("/api/employers/verification/fetchVerifications")
      const data = await res.json()
      setDocuments(data.verifications ?? [])
    } catch (error) {
      console.error("Error fetching verifications:", error)
    }
  }

  useEffect(() => {
    fetchVerifications()
  }, [])

  const searchedDocs = documents.filter((doc) => {
    const search = searchQuery.toLowerCase()
    const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase()
    const matchesSearch =
      fullName.includes(search) ||
      (doc.file_type ?? "").toLowerCase().includes(search) ||
      doc.company_name.toLowerCase().includes(search) ||
      doc.employer_id.toLowerCase().includes(search)

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && (doc.status === "pending" || doc.status === "submitted")) ||
      (activeTab === "approved" && doc.status === "approved") ||
      (activeTab === "rejected" && doc.status === "rejected")

    return matchesSearch && matchesTab
  })

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedDoc) return
    try {
      const res = await fetch("/api/superadmin/actions/addReasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedDoc.id, status: "rejected", reason }),
      })
      if (res.ok) {
        await fetchVerifications()
        setIsViewDialogOpen(false)
        setIsRejectModalOpen(false)
      }
    } catch (error) {
      console.error("Rejection failed:", error)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/superadmin/actions/addReasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      })
      if (res.ok) {
        await fetchVerifications()
        setIsViewDialogOpen(false)
      }
    } catch (error) {
      console.error("Approval failed:", error)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }))
  }

  const handleMenuClose = (id: string) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Verification Documents</h2>
        <p className="text-muted-foreground">Manage and review employer verification submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sent Documents</CardTitle>
          <CardDescription>Filter and process pending requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <DocumentsTable
                docs={searchedDocs}
                anchorEls={anchorEls}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
                onView={(doc) => { setSelectedDoc(doc); setIsViewDialogOpen(true); }}
                onApprove={handleApprove}
                onOpenReject={(doc) => { setSelectedDoc(doc); setIsRejectModalOpen(true); }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Review</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar sx={{ width: 56, height: 56 }} src="/placeholder.svg" />
                <div>
                  <h3 className="text-xl font-bold">{selectedDoc.first_name} {selectedDoc.last_name}</h3>
                  <p className="text-sm text-muted-foreground">Employer ID: {selectedDoc.employer_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-y py-4">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase font-bold">Company</Label>
                  <p className="font-medium">{selectedDoc.company_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase font-bold">Status</Label>
                  <div><StatusBadge status={selectedDoc.status} /></div>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase font-bold">Document Attachment</Label>
                <Button variant="outline" className="w-full justify-start mt-2 gap-2" asChild>
                  <a href={selectedDoc.signed_url ?? "#"} target="_blank" rel="noopener noreferrer">
                    <FileText size={16} /> View {selectedDoc.file_type || "Attachment"}
                  </a>
                </Button>
              </div>
              {selectedDoc.status === "rejected" && selectedDoc.reason && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <Label className="text-red-700 font-bold text-xs uppercase">Rejection Reason</Label>
                  <p className="text-sm text-red-900 mt-1">{selectedDoc.reason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            {selectedDoc && (selectedDoc.status === "pending" || selectedDoc.status === "submitted") && (
              <>
                <Button variant="destructive" onClick={() => setIsRejectModalOpen(true)}>Reject</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(selectedDoc.id)}>Approve</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RejectionDialog
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        entityName={selectedDoc ? `${selectedDoc.first_name} ${selectedDoc.last_name}` : ""}
      />
    </div>
  )
}

function DocumentsTable({ 
  docs, 
  anchorEls, 
  handleMenuOpen, 
  handleMenuClose, 
  onView, 
  onApprove, 
  onOpenReject 
}: DocumentsTableProps) {
  return (
    <TableContainer component={Paper} className="rounded-md border shadow-none overflow-hidden">
      <Table>
        <TableHead className="bg-slate-50">
          <TableRow>
            <TableCell className="font-bold">Name</TableCell>
            <TableCell className="font-bold">Company</TableCell>
            <TableCell className="font-bold">Submitted At</TableCell>
            <TableCell className="font-bold">Status</TableCell>
            <TableCell className="font-bold">Reason</TableCell>
            <TableCell align="right" className="font-bold">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {docs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" className="py-12 text-muted-foreground">
                No documents found for this criteria.
              </TableCell>
            </TableRow>
          ) : (
            docs.map((doc) => {
              const isPending = doc.status === "pending" || doc.status === "submitted";
              return (
                <TableRow key={doc.id} hover>
                  <TableCell className="font-medium">{doc.first_name} {doc.last_name}</TableCell>
                  <TableCell>{doc.company_name}</TableCell>
                  <TableCell>{new Date(doc.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell><StatusBadge status={doc.status} /></TableCell>
                  <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground italic">
                    {doc.reason || "—"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuOpen(e, doc.id)} size="small">
                      <MoreHorizontal size={18} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEls[doc.id]}
                      open={Boolean(anchorEls[doc.id])}
                      onClose={() => handleMenuClose(doc.id)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      <MenuItem onClick={() => { onView(doc); handleMenuClose(doc.id); }}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </MenuItem>
                      {isPending && [
                        <MenuItem key="approve" onClick={() => { onApprove(doc.id); handleMenuClose(doc.id); }} className="text-green-600">
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </MenuItem>,
                        <MenuItem key="reject" onClick={() => { onOpenReject(doc); handleMenuClose(doc.id); }} className="text-red-600">
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </MenuItem>
                      ]}
                    </Menu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = status === "submitted" ? "pending" : status;
  if (s === "pending") return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>;
  if (s === "approved") return <Badge className="bg-blue-600 hover:bg-blue-600">Approved</Badge>;
  if (s === "rejected") return <Badge variant="destructive">Rejected</Badge>;
  return null;
}