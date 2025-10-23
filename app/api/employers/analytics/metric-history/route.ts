import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "../../../../../src/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const range = searchParams.get("range") || "week"
    
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    let since: Date

    if (range === "week") {
      since = new Date()
      since.setDate(since.getDate() - 7)
    } else if (range === "month") {
      since = new Date()
      since.setMonth(since.getMonth() - 1)
    } else if (range === "year") {
      since = new Date()
      since.setFullYear(since.getFullYear() - 1)
    } else if (range === "previous-week") {
      since = new Date()
      since.setDate(since.getDate() - 14)
      const until = new Date()
      until.setDate(until.getDate() - 7)
      
      const query = supabase
        .from("job_metrics_history")
        .select("action, created_at")
        .eq("job_id", jobId)
        .gte("created_at", since.toISOString())
        .lt("created_at", until.toISOString())

      const { data, error } = await query.order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching metrics history:", error)
        return NextResponse.json({ error: "Failed to fetch metrics history" }, { status: 500 })
      }

      const actionCounts = data.reduce((acc: Record<string, number>, item) => {
        acc[item.action] = (acc[item.action] || 0) + 1
        return acc
      }, {})

      const summary = {
        view: actionCounts.view || 0,
        click: actionCounts.click || 0,
        apply: actionCounts.apply || 0
      }
      
      return NextResponse.json({
        summary: summary,
        weeklyData: [],
        totalRecords: data.length,
        usingFallback: false
      })
    } else if (range === "previous-month") {
      since = new Date()
      since.setMonth(since.getMonth() - 2)
      const until = new Date()
      until.setMonth(until.getMonth() - 1)
      
      const query = supabase
        .from("job_metrics_history")
        .select("action, created_at")
        .eq("job_id", jobId)
        .gte("created_at", since.toISOString())
        .lt("created_at", until.toISOString())

      const { data, error } = await query.order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching metrics history:", error)
        return NextResponse.json({ error: "Failed to fetch metrics history" }, { status: 500 })
      }

      const actionCounts = data.reduce((acc: Record<string, number>, item) => {
        acc[item.action] = (acc[item.action] || 0) + 1
        return acc
      }, {})

      const summary = {
        view: actionCounts.view || 0,
        click: actionCounts.click || 0,
        apply: actionCounts.apply || 0
      }

      return NextResponse.json({
        summary: summary,
        weeklyData: [],
        totalRecords: data.length,
        usingFallback: false
      })
    } else {
      since = new Date(0)
    }

    let query = supabase
      .from("job_metrics_history")
      .select("action, created_at")
      .eq("job_id", jobId)

    if (range !== "all") {
      query = query.gte("created_at", since.toISOString())
    }

    const { data, error } = await query.order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching metrics history:", error)
      return NextResponse.json({ error: "Failed to fetch metrics history" }, { status: 500 })
    }

    const actionCounts = data.reduce((acc: Record<string, number>, item) => {
      acc[item.action] = (acc[item.action] || 0) + 1
      return acc
    }, {})

    const summary = {
      view: actionCounts.view || 0,
      click: actionCounts.click || 0,
      apply: actionCounts.apply || 0
    }

    console.log("Summary:", summary)

    const weeklyData = []
    const startDate = new Date(since)
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startDate)
      weekStart.setDate(startDate.getDate() + (i * 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      const weekData = data.filter(item => {
        const itemDate = new Date(item.created_at)
        return itemDate >= weekStart && itemDate <= weekEnd
      })
      
      weeklyData.push({
        name: `Week ${i + 1}`,
        views: weekData.filter(item => item.action === "view").length,
        clicks: weekData.filter(item => item.action === "click").length,
        applicants: weekData.filter(item => item.action === "apply").length
      })
    }

    return NextResponse.json({
      summary: summary,
      weeklyData: weeklyData,
      totalRecords: data.length
    })
  } catch (error) {
    console.error("Error in metrics history API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

