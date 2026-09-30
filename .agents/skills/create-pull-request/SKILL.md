---
name: create-pull-request
description:
  Create a GitHub pull request following project conventions. Use when the user
  asks to create a PR, submit changes for review, or open a pull request.
  Handles commit analysis, branch management, PR template usage, and PR creation
  using the gh CLI tool.
---

# Create Pull Request

This skill guides you through creating a well-structured GitHub pull request
that follows project conventions and best practices.

Every pull request contains code of a specific module of the
[Java Masterclass](https://www.udemy.com/course/java-the-complete-java-developer-course/)
course of Tim Buchalka. The branch name is related to a specific module of the
course, every commit is a video or lesson within that module.

## Prerequisites Check

Before proceeding, verify the following:

### 1. Check if `gh` CLI is installed

```bash
gh --version
```

If not installed, inform the user:

> The GitHub CLI (`gh`) is required but not installed. Please install it:
>
> - macOS: `brew install gh`
> - Other: https://cli.github.com/

### 2. Check if authenticated with GitHub

```bash
gh auth status
```

If not authenticated, guide the user to run `gh auth login`.

### 3. Verify clean working directory

```bash
git status
```

If there are uncommitted changes, ask the user whether to:

- Commit them as part of this PR
- Stash them temporarily
- Discard them (with caution)

## Gather Context

### 1. Identify the current branch

```bash
git branch --show-current
```

Ensure you're not on `main` or `master`. If so, ask the user to create or switch
to a feature branch.

### 2. Find the base branch

```bash
git remote show origin | grep "HEAD branch"
```

This is typically `main` or `master`.

### 3. Analyze recent commits relevant to this PR

```bash
git log origin/main..HEAD --oneline --no-decorate
```

Review these commits to understand:

- What changes are being introduced
- The scope of the PR (single feature/fix or multiple changes)
- Whether commits should be squashed or reorganized

### 4. Review the diff

```bash
git diff origin/main..HEAD --stat
```

This shows which files changed and helps identify the type of change.

### 5. Review the README

```bash
cat README.md
```

Every module has a README file that provides an overview and instructions
specific to that module. Ensure that the README accurately reflects the changes
introduced by this PR. If there is no README file, use the [/create-readme](#)
skill to generate one.

## Information Gathering

Before creating the PR, you need the following information. Check if it can be
inferred from:

- Commit messages
- Branch name (e.g., `testing-file-upload`)
- Changed files and their content

If any critical information is missing, use `ask_followup_question` to ask the
user:

### Required Information

1. **Course Module**: If the related course module is not clear from the
   context, ask the user to specify it.
2. **Description**: What is this module about? What concepts, principle,
   language features, ... does it cover?

### Example clarifying question

If the course module is not found:

> I couldn't find a related course module in the commit messages, branch name or
> README. What course module does this PR relate to? (Enter the module name or
> "None" if not applicable)

## Git Best Practices

Before creating the PR, consider these best practices:

### Commit Hygiene

1. **Atomic commits**: Each commit should represent a single logical change
2. **Clear commit messages**: Every commit message is the name of a single
   lesson.
3. **No merge commits**: Prefer rebasing over merging to keep history clean

### Branch Management

1. **Rebase on latest main** (if needed):

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Squash if appropriate**: If there are many small "WIP" commits, consider
   interactive rebase:
   ```bash
   git rebase -i origin/main
   ```
   Only suggest this if commits appear messy and the user is comfortable with
   rebasing.

### Push Changes

Ensure all commits are pushed:

```bash
git push origin HEAD
```

If the branch was rebased, you may need:

```bash
git push origin HEAD --force-with-lease
```

## Create the Pull Request

**IMPORTANT**: Read and use the PR template at
`.github/pull_request_template.md`. The PR body format must **strictly match**
the template structure. Do not deviate from the template format.

When filling out the template:

- Replace `MODULE_NAME` with the actual course module name.
- Fill in all sections with relevant information gathered from commits and
  context
- Complete the "Pre-flight Checklist" items that apply
- When using bullet point, add one (relevant) emoji per point to enhance
  readability

### Create PR with gh CLI

**Use a temporary file for the PR body** to avoid shell escaping issues, newline
problems, and other command-line flakiness:

1. Write the PR body to a temporary file:

   ```
   ./tmp/pr-body.md
   ```

2. Create the PR using the file:

   ```bash
   gh pr create --title "PR_TITLE" --body-file ./tmp/pr-body.md --base main
   ```

3. Clean up the temporary file:
   ```bash
   rm ./tmp/pr-body.md
   ```

For draft PRs:

```bash
gh pr create --title "PR_TITLE" --body-file ./tmp/pr-body.md --base main --draft
```

**Why use a file?** Passing complex markdown with newlines, special characters,
and checkboxes directly via `--body` is error-prone. The `--body-file` flag
handles all content reliably.

## Post-Creation

After creating the PR:

1. **Display the PR URL** so the user can review it
2. **Remind about CI checks**: Tests and linting will run automatically
3. **Suggest next steps**:
   - Add reviewers if needed: `gh pr edit --add-reviewer USERNAME`
   - Add labels if needed: `gh pr edit --add-label "bug"`

## Error Handling

### Common Issues

1. **No commits ahead of main**: The branch has no changes to submit
   - Ask if the user meant to work on a different branch

2. **Branch not pushed**: Remote doesn't have the branch
   - Push the branch first: `git push -u origin HEAD`

3. **PR already exists**: A PR for this branch already exists
   - Show the existing PR: `gh pr view`
   - Ask if they want to update it instead

4. **Merge conflicts**: Branch conflicts with base
   - Guide user through resolving conflicts or rebasing

## Summary Checklist

Before finalizing, ensure:

- [ ] `gh` CLI is installed and authenticated
- [ ] Working directory is clean
- [ ] All commits are pushed
- [ ] Branch is up-to-date with base branch
- [ ] Related Udemy course is identified, or placeholder is used
- [ ] PR description follows the template exactly
- [ ] Appropriate type of change is selected
- [ ] Pre-flight checklist items are addressed
