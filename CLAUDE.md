# Instructions for Claude

## Start of every session
1. Read PROJECT_BRIEF.md (the vision) and ROADMAP.md (current phase and progress).
2. Tell me the current phase and the next unchecked task, then confirm before starting.

## End of every session
Update ROADMAP.md:
- Check off finished tasks
- Update "Current status" (phase, next action, blockers, date)
- Move answered open questions into the decision log
- Add a short session log entry

## How to work with me
- I'm a beginner, currently doing CS50. I want to understand everything we build.
- Explain decisions briefly and in plain language: what we're doing, why, and what the alternatives were.
- When something is a rabbit hole I haven't learned yet, teach the concept before writing the code.
- Push back if I'm overscoping or skipping a phase.
- Prefer existing open source tools and libraries over custom code.
- No em dashes, no AI-sounding writing in any user-facing text on the site.

## Project rules
- Never hard-code a ticker or company name. Everything comes from one config file.
- API keys and secrets stay server-side, in environment variables, never committed.
- Every external API must be cached and must have an error fallback.
- Check data source terms allow public display, and credit sources on the site.
- When I repeat a process that will be needed again (e.g. setting up a stock), suggest saving it as a reusable skill, command, subagent or script.
