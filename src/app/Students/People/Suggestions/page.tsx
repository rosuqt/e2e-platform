'use client'
import Sidebar from "../components/sidebar-following";
import TopBar from "../components/topbar";
import React, { useState, useEffect } from "react";
import StudentsGrid from "../components/Suggestions";

type Student = {
  name: string;
  avatar: string;
  college: string;
  course: string;
};


export default function Suggestions() {
    return (
        <div className="flex group">
            <div className="group relative">
                <Sidebar />
            </div>
            <div className="flex-1 transition-all duration-300 ml-16 group-hover:ml-64">
              <TopBar />
                <div className="p-4"> 
                  <StudentsGrid/>
                </div>
            </div>
        </div>
        );
}