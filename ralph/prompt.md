# HUMAN IN THE LOOP

## CHOOSE A ISSUE

### ISSUES

GitHub Issues are provided at start of context. Parse them to understand the open issues.

You will work on the HITL (Human In the Loop) tasks only, not the AFK ones.

You've also been passed a file containing the last few commits. Review these to understand what work has been done.

If all HITL tasks are complete, output <promise>READY FOR NEXT ISSUES</promise>.

### ISSUE SELECTION

Pick the next task, use the GitHub cli tool (gh). Prioritize tasks in this order:

1. Critical bugfixes
2. Development infrastructure

   > Getting development infrastructure like tests and types and dev scripts ready is an important precursor to building features.

3. Tracer bullets for new features

   > Tracer bullets are small slices of functionality that go through all layers of the system, allowing you to test and validate your approach early. This helps in identifying potential issues and ensures that the overall architecture is sound before investing significant time in development.
   >
   > TL;DR - build a tiny, end-to-end slice of the feature first, then expand it out.

4. Polish and quick wins
5. Refactors

## IMPLEMENT THE ISSUE

### EXPLORATION

Explore the repo.

### IMPLEMENTATION

Use /tdd to complete the task.

### FEEDBACK LOOPS

When ready, run the feedback loops:

- `pnpm test` to run the tests

## SHOW YOUR WORK

### COMMIT

Make a git commit. The (conventional) commit message must:

1. Include key decisions made
2. Blockers or notes for next iteration
3. Mention the issue (eg. Resolves: #292344)

Make sure to **never commit on `main`**! Create a branch first if needed.

### THE PULL REQUEST

If the task is complete, use /create-pull-request.

If the task is not complete, add a note to the task note with what was done.

## FINAL RULES

ONLY WORK ON A SINGLE ISSUE.
