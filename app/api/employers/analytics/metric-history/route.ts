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

    const generateWeeklyData = () => {
      const now = new Date()
      const weeklyData = []
      
      if (range === "week") {
        for (let i = 6; i >= 0; i--) {
          const dayStart = new Date(now)
          dayStart.setDate(now.getDate() - i)
          dayStart.setHours(0, 0, 0, 0)
          
          const dayEnd = new Date(dayStart)
          dayEnd.setHours(23, 59, 59, 999)
          
          const dayData = data.filter(item => {
            const itemDate = new Date(item.created_at)
            return itemDate >= dayStart && itemDate <= dayEnd
          })
          
          weeklyData.push({
            name: dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            views: dayData.filter(item => item.action === "view").length,
            clicks: dayData.filter(item => item.action === "click").length,
            applicants: dayData.filter(item => item.action === "apply").length
          })
        }
      } else if (range === "month") {
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - (i * 7) - 6)
          weekStart.setHours(0, 0, 0, 0)
          
          const weekEnd = new Date(now)
          weekEnd.setDate(now.getDate() - (i * 7))
          weekEnd.setHours(23, 59, 59, 999)
          
          const weekData = data.filter(item => {
            const itemDate = new Date(item.created_at)
            return itemDate >= weekStart && itemDate <= weekEnd
          })
          
          weeklyData.push({
            name: `Week ${4-i}`,
            views: weekData.filter(item => item.action === "view").length,
            clicks: weekData.filter(item => item.action === "click").length,
            applicants: weekData.filter(item => item.action === "apply").length
          })
        }
      } else {
        for (let i = 11; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999)
          
          const monthData = data.filter(item => {
            const itemDate = new Date(item.created_at)
            return itemDate >= monthStart && itemDate <= monthEnd
          })
          
          weeklyData.push({
            name: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            views: monthData.filter(item => item.action === "view").length,
            clicks: monthData.filter(item => item.action === "click").length,
            applicants: monthData.filter(item => item.action === "apply").length
          })
        }
      }
      
      return weeklyData
    }

    return NextResponse.json({
      summary: summary,
      weeklyData: generateWeeklyData(),
      totalRecords: data.length
    })
  } catch (error) {
    console.error("Error in metrics history API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

