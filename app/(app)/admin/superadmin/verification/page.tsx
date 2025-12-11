/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, ReactNode } from "react"
import { Search,  MoreHorizontal, Eye, CheckCircle, XCircle, Clock, FileText } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
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

interface VerificationDocument {
  name: ReactNode
  userId: ReactNode
  type: ReactNode
  submittedAt: ReactNode
  description: ReactNode
  signed_url_error: any
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
}

export default function VerificationManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(null)
  const [actionReason, setActionReason] = useState("")
  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({})
  const [documents, setDocuments] = useState<VerificationDocument[]>([])

  useEffect(() => {
    async function fetchVerifications() {
      const res = await fetch("/api/employers/verification/fetchVerifications")
      const { verifications } = await res.json()
      setDocuments(verifications ?? [])
    }
    fetchVerifications()
  }, [])

  useEffect(() => {
    console.log("Documents state:", documents)
  }, [documents])

  const searchedDocs = documents.filter((doc) => {
    const search = searchQuery.toLowerCase()
    const matchesSearch =
      `${doc.first_name} ${doc.last_name}`.toLowerCase().includes(search) ||
      (doc.file_type ?? "").toLowerCase().includes(search) ||
      doc.company_name.toLowerCase().includes(search) ||
      doc.employer_id.toLowerCase().includes(search)

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && doc.status === "pending") ||
      (activeTab === "approved" && doc.status === "approved") ||
      (activeTab === "rejected" && doc.status === "rejected")

    return matchesSearch && matchesTab
  })

  const handleViewDoc = (doc: VerificationDocument) => {
    setSelectedDoc(doc)
    setIsViewDialogOpen(true)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }))
  }

  const handleMenuClose = (id: string) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Verification Documents</h2>
          <p className="text-muted-foreground">Track and manage submitted verification documents</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Sent Documents</CardTitle>
          <CardDescription>Review, approve, or reject submitted verification documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search documents..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({documents.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({documents.filter((d) => d.status === "pending").length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({documents.filter((d) => d.status === "approved").length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({documents.filter((d) => d.status === "rejected").length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <DocumentsTable docs={searchedDocs} onViewDoc={handleViewDoc} anchorEls={anchorEls} handleMenuOpen={handleMenuOpen} handleMenuClose={handleMenuClose} />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <DocumentsTable docs={searchedDocs} onViewDoc={handleViewDoc} anchorEls={anchorEls} handleMenuOpen={handleMenuOpen} handleMenuClose={handleMenuClose} />
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <DocumentsTable docs={searchedDocs} onViewDoc={handleViewDoc} anchorEls={anchorEls} handleMenuOpen={handleMenuOpen} handleMenuClose={handleMenuClose} />
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <DocumentsTable docs={searchedDocs} onViewDoc={handleViewDoc} anchorEls={anchorEls} handleMenuOpen={handleMenuOpen} handleMenuClose={handleMenuClose} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>Review the submitted verification document.</DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar sx={{ width: 48, height: 48 }} src="/placeholder.svg?height=48&width=48" alt="User" />
                <div>
                  <h3 className="text-lg font-bold">{selectedDoc.name}</h3>
                  <p className="text-muted-foreground">User ID: {selectedDoc.userId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedDoc.status} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Document Type</Label>
                  <p className="font-medium">{selectedDoc.type}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Submitted At</Label>
                  <p className="font-medium">
                    {selectedDoc && selectedDoc.submitted_at
                      ? new Date(selectedDoc.submitted_at).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <div className="mt-1 p-3 bg-slate-50 rounded-md">
                  <p>{selectedDoc.description}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Document</Label>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href={selectedDoc.signed_url ?? "#"} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4" />
                    View Document
                  </a>
                </Button>
                {selectedDoc.signed_url_error && (
                  <p className="text-xs text-red-500 mt-2">{selectedDoc.signed_url_error}</p>
                )}
              </div>
              {selectedDoc.status === "pending" && (
                <div>
                  <Label htmlFor="action-reason">Reason for Action</Label>
                  <Textarea
                    id="action-reason"
                    placeholder="Provide a reason for approving or rejecting this document..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedDoc && selectedDoc.status === "pending" && (
              <>
                <Button variant="destructive" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DocumentsTable({
  docs,
  anchorEls,
  handleMenuOpen,
  handleMenuClose,
}: {
  docs: VerificationDocument[]
  onViewDoc: (doc: VerificationDocument) => void
  anchorEls: { [key: string]: HTMLElement | null }
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, id: string) => void
  handleMenuClose: (id: string) => void
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
    await fetch("/api/employers/verification/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    handleMenuClose(id);
    // Optionally refresh data
    window.location.reload();
  };

  return (
    <TableContainer component={Paper} className="rounded-md border">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Employer ID</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Submitted At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {docs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" className="py-8 text-muted-foreground">
                No documents found
              </TableCell>
            </TableRow>
          ) : (
            docs.map((doc) => {
              const normalizedStatus = doc.status === "submitted" ? "pending" : doc.status;
              return (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.first_name} {doc.last_name}</TableCell>
                  <TableCell>{doc.employer_id}</TableCell>
                  <TableCell>{doc.company_name}</TableCell>
                  <TableCell>{doc.file_type}</TableCell>
                  <TableCell>{formatDate(doc.submitted_at)}</TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="actions"
                      onClick={(e) => handleMenuOpen(e, doc.id)}
                      size="small"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEls[doc.id] || null}
                      open={Boolean(anchorEls[doc.id])}
                      onClose={() => handleMenuClose(doc.id)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      <MenuItem
                        component="a"
                        href={doc.signed_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleMenuClose(doc.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Document
                      </MenuItem>
                      {normalizedStatus === "pending" && (
                        <>
                          <MenuItem
                            onClick={() => handleStatusChange(doc.id, "rejected")}
                            style={{ color: "#dc2626" }}
                          >
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            Reject
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleStatusChange(doc.id, "approved")}
                            style={{ color: "#16a34a" }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Approve
                          </MenuItem>
                        </>
                      )}
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
  // Treat "submitted" as "pending" for badge display
  const normalizedStatus = status === "submitted" ? "pending" : status;
  if (normalizedStatus === "pending") {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    )
  } else if (normalizedStatus === "approved") {
    return (
      <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Approved
      </Badge>
    )
  } else if (normalizedStatus === "rejected") {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
    )
  }
  return null
}
