import { FileEvent, ChangelogView } from './types';

export function renderDayView(events: FileEvent[], day: Date): ChangelogView {
  const dayStart = new Date(day).setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(day).setUTCHours(23, 59, 59, 999);

  const currentNames = new Map<string, string>();
  const createdTodayOriginal = new Set<string>();
  const editedTodayOriginal = new Set<string>();

  for (const e of events) {
    if (e.timestamp > dayEnd) break;

    if (e.type === 'create') {
      currentNames.set(e.path, e.path);
      if (e.timestamp >= dayStart) {
        createdTodayOriginal.add(e.path);
      }
    } else if (e.type === 'modify') {
      const originalPath = findOriginalPath(currentNames, e.path);
      if (e.timestamp >= dayStart) {
        editedTodayOriginal.add(originalPath);
      }
    } else if (e.type === 'rename') {
      const oldPath = e.oldPath!;
      const newPath = e.path;
      const originalPath = findOriginalPath(currentNames, oldPath);
      currentNames.set(originalPath, newPath);
      if (e.timestamp >= dayStart) {
        editedTodayOriginal.add(originalPath);
      }
    } else if (e.type === 'delete') {
      const originalPath = findOriginalPath(currentNames, e.path);
      currentNames.delete(originalPath);
    }
  }

  const view: ChangelogView = {
    date: day.toISOString().split('T')[0],
    created: [],
    edited: [],
  };

  for (const [originalPath, currentName] of currentNames.entries()) {
    if (!isMarkdown(currentName) || isExcluded(currentName)) {
      continue;
    }

    if (createdTodayOriginal.has(originalPath)) {
      view.created.push(currentName);
    } else if (editedTodayOriginal.has(originalPath)) {
      view.edited.push(currentName);
    }
  }

  return view;
}

function isMarkdown(path: string): boolean {
  return path.toLowerCase().endsWith('.md');
}

function isExcluded(path: string): boolean {
  return path.startsWith('changelog/') || path.startsWith('.obsidian/');
}

function findOriginalPath(names: Map<string, string>, path: string): string {
  for (const [orig, curr] of names.entries()) {
    if (curr === path) return orig;
  }
  return path;
}


export function renderMarkdown(view: ChangelogView): string {
  let md = `# Changelog — ${view.date}\n\n`;

  if (view.created.length === 0 && view.edited.length === 0) {
    return md + `Nothing created or edited.\n`;
  }

  if (view.created.length > 0) {
    md += `## Created today (${view.created.length})\n`;
    view.created.forEach(path => {
      md += `- [[${path}]]\n`;
    });
    md += `\n`;
  }

  if (view.edited.length > 0) {
    md += `## Edited today (${view.edited.length})\n`;
    view.edited.forEach(path => {
      md += `- [[${path}]]\n`;
    });
    md += `\n`;
  }

  return md;
}
