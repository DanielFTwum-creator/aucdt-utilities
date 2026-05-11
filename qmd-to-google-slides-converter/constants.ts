
import type { SlidesData } from './types';

export const slidesData: SlidesData = {
  title: "14-Day Sprint Daily Standup",
  subtitle: "10:10 AM Meeting Guide",
  author: "Asanska University College of Design & Technology",
  slides: [
    {
      title: "Sprint Overview",
      content: [
        { type: "columns", data: [
          { items: [
            "Duration: 14 Days",
            "Daily Meeting: 10:10 AM",
            "Target Length: 15-20 minutes"
          ]},
          { items: [
            "Goal: Stay aligned, unblock issues, maintain momentum",
            "Format: Quick, focused, action-oriented"
          ]}
        ]}
      ]
    },
    {
      title: "Meeting Structure",
      content: [
        { type: "box", style: "blue", data: [
          "Each team member shares 3 things:",
          "✅ What I completed yesterday",
          "🎯 What I'm working on today",
          "🚧 Any blockers or dependencies"
        ]},
        { type: "box", style: "burgundy", data: [
          "Golden Rule: Quick decisions only—park complex discussions for later."
        ]}
      ]
    },
    {
      title: "Critical Success Factors",
      content: [
        { type: "columns", data: [
          { 
            heading: "🔄 Consistency",
            items: ["Same time, same place", "Non-negotiable", "No exceptions"]
          },
          { 
            heading: "📊 Accountability",
            items: ["Can't attend? Send updates", "Assign backup facilitators", "Keep everyone engaged"]
          }
        ]}
      ]
    },
    {
      title: "Common Pitfalls to Avoid",
      content: [
        { type: "box", style: "burgundy", data: [
          "Watch Out For:",
          "❌ Solving problems in the standup",
          "❌ Letting it run over 20 minutes",
          "❌ Skipping when nothing changed",
          "❌ Not following up on blockers"
        ]}
      ]
    },
    {
      title: "Day 14: Sprint Complete! 🎉",
      content: [
        { type: "box", style: "yellow", data: [
          "Celebrate the wins"
        ]},
        { type: "box", style: "blue", data: [
          "Hold a retrospective:",
          "What went well?",
          "What could improve?",
          "What will we do differently next time?"
        ]}
      ]
    }
  ]
};
