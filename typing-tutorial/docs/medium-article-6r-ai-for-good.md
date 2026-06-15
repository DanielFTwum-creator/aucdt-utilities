*#ai-for-good*

# Before 6R, After 6R: What Happens When You Ask AI to Rebuild Mavis Beacon for the Next Generation

I grew up on Mavis Beacon Teaches Typing. Every afternoon after school, the same ritual: boot up the desktop, click into the lesson, watch the little animated hands hover over the keyboard, and type until the home row stopped feeling like a foreign country. For a generation of us, Mavis Beacon wasn't just software — it was the thing that quietly taught our fingers to think.

Decades later, as Head of ICT at Techbridge University College (TUC) in Oyibi, Ghana, I found myself asking a simple question: why does typing instruction still feel stuck in the 1990s, while everything else in education software has moved on?

So we built VortexType — a typing tutor for our students — and then did something that turned out to matter more than the build itself: we asked Claude to review it against the standard that taught a generation, and tell us, honestly, what was missing.

## Before 6R: A Typing Tutor That Looked Modern But Taught Nothing

The first version of VortexType checked all the contemporary boxes. Dark mode. A sleek, terminal-inspired UI. Real-time WPM and accuracy counters. A gamified combo streak that lit up when you typed a run of correct keys. It looked, frankly, better than Mavis Beacon ever did.

But when we sat a first-year student in front of it, something was off. They could see *that* they'd made a mistake — a red flash, a buzz, a broken streak — but not *why*, and not what to do about it. The interface was reporting on the user's performance instead of teaching them.

That's the trap a lot of "modern" edtech falls into: we optimize for the dashboard and forget the lesson. Mavis Beacon never had a combo counter. It didn't need one. What it had was something almost embarrassingly simple — a pair of hands on screen, always visible, always showing you exactly which finger to move next. That single visual element did more pedagogical work than every stat widget combined.

## Enter the 6R Review

We'd already built six categories of feedback into VortexType — Resting posture, Rhythm, Transition guidance, Response feedback, Streak rewards, and Resilience (error recovery). On paper, it was a complete system. But "complete on paper" and "complete for a learner" are different things, so we asked Claude to walk through each of the six R's, one at a time, and compare what we'd built against what actually made Mavis Beacon work.

The review didn't come back as a list of bugs. It came back as a list of *absences*.

**R1 — Resting.** We had a text label reading "ASDF / JKL;". Mavis Beacon had animated hands resting on those exact keys, all the time, reinforcing posture passively, without the learner having to read anything.

**R3 — Transition.** We had a sentence describing which finger should move next — "Anchor Left Middle on D, extend forward to index E." Technically correct. Completely unreadable at typing speed. Mavis Beacon showed you the same information by literally lifting a finger on screen.

**R4 — Response.** We played a tone on *every single correct keystroke*. Claude pointed out this was a known fatigue pattern — and that Mavis Beacon's audio feedback is reserved for *mistakes*, not constant ticking. We had built something that would wear a learner down over a 20-minute session without them quite knowing why.

**R6 — Resilience.** This was the one place we'd genuinely gone further than Mavis Beacon — VortexType auto-generates a remediation drill from the exact keys a student fumbled. But we'd wrapped it in language like "R6 Cognitive Calibration Alignment Active," which is the kind of phrase that means everything to an engineer and nothing to a seventeen-year-old trying to pass a typing test.

None of these were things we'd have caught by staring at our own UI. We knew the system. We didn't know what it felt like to *not* know it.

## After 6R: Teaching the Interface to Get Out of the Way

The directives that came out of the review weren't a redesign — they were closer to a translation. Take what the system already knew (which finger, which key, which mistake) and say it the way a learner needs to hear it, not the way a database needs to store it.

The hand diagram became the centerpiece, not a stat panel. The audio feedback went quiet by default, reserved for the moments that actually need a learner's attention — an error, a completed drill. The calibration banner stopped talking about "cognitive alignment" and started saying, in effect: *you keep missing this key, let's fix that before we move on.*

What's left when you strip away the jargon is something closer to what Mavis Beacon was all along: a system that watches you closely and says very little, because the things it shows you — where your fingers are, where they need to go — say everything that matters.

## Why This Is an AI-for-Good Story

It would be easy to frame this as "AI helped us build a typing tutor faster." That's true, but it's not the interesting part. The interesting part is that AI was the reviewer, not just the builder — and the standard it was asked to review against wasn't a benchmark dataset or a best-practices checklist. It was a piece of cultural memory: software that taught millions of people a physical skill, well enough that some of us still remember exactly what it felt like.

Claude didn't know VortexType. It didn't know Mavis Beacon either, not really — it knew about both the way you'd describe them to a colleague. What it could do was hold the two side by side, category by category, and notice — calmly, without ego — that we'd built six systems for giving feedback and forgotten the one thing feedback is for: helping someone get better without making them think about the feedback at all.

For an institution like TUC, in Oyibi, Ghana, building tools for students who may never have had access to a typing class before, that distinction isn't academic. A typing tutor that *feels* instructive instead of merely *looking* instructive is the difference between a tool students use once and a tool that quietly becomes part of how they learn to work.

That's the version of "AI for good" I find most useful: not AI generating something new from nothing, but AI helping us notice what we already knew — and had simply stopped seeing.

---

*Daniel Frempong Twum is Head of ICT and Special Advisor to the Founder at Techbridge University College, Oyibi, Greater Accra, Ghana. VortexType is an internal typing tutor built for TUC students, under active development.*
