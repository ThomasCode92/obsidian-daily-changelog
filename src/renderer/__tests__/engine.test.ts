import { describe, it, expect } from 'vitest';
import { renderDayView, renderMarkdown } from '../engine';
import { FileEvent, ChangelogView } from '../types';

describe('Changelog Engine', () => {
  const day = new Date('2026-10-01T00:00:00Z');
  const dayStart = day.getTime();
  const dayEnd = new Date('2026-10-01T23:59:59.999Z').getTime();

  it('should identify notes created today', () => {
    const events: FileEvent[] = [
      { type: 'create', path: 'Note 1.md', timestamp: dayStart + 1000 },
      { type: 'create', path: 'Note 2.md', timestamp: dayStart + 2000 },
    ];
    const view = renderDayView(events, day);
    expect(view.created).toEqual(['Note 1.md', 'Note 2.md']);
    expect(view.edited).toEqual([]);
  });

  it('should identify notes edited today', () => {
    const events: FileEvent[] = [
      { type: 'create', path: 'Note 1.md', timestamp: dayStart - 1000 },
      { type: 'create', path: 'Note 2.md', timestamp: dayStart - 1000 },
      { type: 'modify', path: 'Note 1.md', timestamp: dayStart + 1000 },
      { type: 'modify', path: 'Note 2.md', timestamp: dayStart + 2000 },
    ];
    const view = renderDayView(events, day);
    expect(view.created).toEqual([]);
    expect(view.edited).toEqual(['Note 1.md', 'Note 2.md']);
  });


  it('should put note in Created section if both created and edited today', () => {
    const events: FileEvent[] = [
      { type: 'create', path: 'Note 1.md', timestamp: dayStart + 1000 },
      { type: 'modify', path: 'Note 1.md', timestamp: dayStart + 2000 },
    ];
    const view = renderDayView(events, day);
    expect(view.created).toEqual(['Note 1.md']);
    expect(view.edited).toEqual([]);
  });

  it('should exclude notes created and deleted on the same day', () => {
    const events: FileEvent[] = [
      { type: 'create', path: 'Transient.md', timestamp: dayStart + 1000 },
      { type: 'delete', path: 'Transient.md', timestamp: dayStart + 2000 },
    ];
    const view = renderDayView(events, day);
    expect(view.created).toEqual([]);
    expect(view.edited).toEqual([]);
  });

  it('should keep notes that were edited today but deleted tomorrow', () => {
    const events: FileEvent[] = [
      { type: 'create', path: 'OldNote.md', timestamp: dayStart - 86400000 },
      { type: 'modify', path: 'OldNote.md', timestamp: dayStart + 1000 },
      { type: 'delete', path: 'OldNote.md', timestamp: dayEnd + 1000 },
    ];
    const view = renderDayView(events, day);
    expect(view.edited).toEqual(['OldNote.md']);
  });

  it('should resolve renames and mark as edited', () => {
    const events: FileEvent[] = [
      { type: 'create', path: 'OldName.md', timestamp: dayStart - 86400000 },
      { type: 'rename', path: 'NewName.md', oldPath: 'OldName.md', timestamp: dayStart + 1000 },
    ];
    const view = renderDayView(events, day);
    expect(view.edited).toEqual(['NewName.md']);
  });

  it('should render the markdown for a day with activity', () => {
    const view: ChangelogView = {
      date: '2026-10-01',
      created: ['Note A.md', 'Note B.md'],
      edited: ['Note C.md'],
    };
    const md = renderMarkdown(view);
    expect(md).toBe('# Changelog — 2026-10-01\n\n## Created today (2)\n- [[Note A.md]]\n- [[Note B.md]]\n\n## Edited today (1)\n- [[Note C.md]]\n\n');
  });


  it('should filter out non-markdown files', () => {
    const events: FileEvent[] = [
      { type: 'create', path: 'Note.md', timestamp: dayStart + 1000 },
      { type: 'create', path: 'Image.png', timestamp: dayStart + 2000 },
    ];
    const view = renderDayView(events, day);
    expect(view.created).toEqual(['Note.md']);
  });

  it('should filter out excluded paths', () => {
    const events: FileEvent[] = [
      { type: 'create', path: 'Note.md', timestamp: dayStart + 1000 },
      { type: 'create', path: 'changelog/2026-10-01.md', timestamp: dayStart + 2000 },
      { type: 'create', path: '.obsidian/app.json', timestamp: dayStart + 3000 },
    ];
    const view = renderDayView(events, day);
    expect(view.created).toEqual(['Note.md']);
  });






});
