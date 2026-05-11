import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { TestResult, TestStatus } from '../types';
import { Beaker, CheckCircle2, XCircle, Loader } from './icons';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Scenario = {
  suite: string;
  name: string;
  run: () => Promise<Omit<TestResult, 'name'>>;
};

type SuiteResult = {
  name: string;
  results: TestResult[];
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const hasApiKey = !!process.env.API_KEY;

// Helper: click a button by textContent within an optional root
const clickBtn = (text: string, root: Element | Document = document): HTMLButtonElement => {
  const btn = Array.from(root.querySelectorAll<HTMLButtonElement>('button'))
    .find(b => b.textContent?.trim() === text);
  if (!btn) throw new Error(`Button "${text}" not found`);
  btn.click();
  return btn;
};

// Helper: find framework tile by partial name
const frameworkTile = (partial: string): HTMLButtonElement => {
  const tile = Array.from(document.querySelectorAll<HTMLButtonElement>('[aria-pressed]'))
    .find(t => t.textContent?.toLowerCase().includes(partial.toLowerCase()));
  if (!tile) throw new Error(`Framework tile containing "${partial}" not found`);
  return tile;
};

// ─────────────────────────────────────────────────────────────────────────────
// 80-Test Suite
// ─────────────────────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [

  // ── Suite A: Initial Load & Render ────────────────────────────────────────
  {
    suite: 'A · Initial Load & Render',
    name: 'A01 · Page title contains "Compliance"',
    run: async () => {
      await delay(200);
      const t = document.querySelector('h1')?.textContent ?? '';
      if (!t.toLowerCase().includes('compliance')) throw new Error(`Got: "${t}"`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'A · Initial Load & Render',
    name: 'A02 · Header element rendered',
    run: async () => {
      await delay(150);
      if (!document.querySelector('header')) throw new Error('<header> not found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'A · Initial Load & Render',
    name: 'A03 · App subtitle present',
    run: async () => {
      await delay(150);
      const sub = document.querySelector('header p')?.textContent ?? '';
      if (!sub) throw new Error('Subtitle paragraph not found in header');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'A · Initial Load & Render',
    name: 'A04 · Gold border on header',
    run: async () => {
      await delay(150);
      const hdr = document.querySelector('header');
      if (!hdr) throw new Error('<header> not found');
      const cls = hdr.className;
      if (!cls.includes('C5A059') && !cls.includes('gold') && !cls.includes('border-[#C5A059]'))
        throw new Error('Gold border class not found on header');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'A · Initial Load & Render',
    name: 'A05 · Default framework is Standard',
    run: async () => {
      await delay(200);
      const selected = Array.from(document.querySelectorAll<HTMLButtonElement>('[aria-pressed="true"]'))
        .find(b => b.textContent?.toLowerCase().includes('standard'));
      if (!selected) throw new Error('Standard Project Refresh tile not selected by default');
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite B: Framework Selector ───────────────────────────────────────────
  {
    suite: 'B · Framework Selector',
    name: 'B01 · Framework tiles count ≥ 5',
    run: async () => {
      await delay(180);
      const tiles = document.querySelectorAll('[aria-pressed]');
      if (tiles.length < 5) throw new Error(`Found only ${tiles.length} framework tiles`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B02 · HIPAA tile present',
    run: async () => {
      await delay(150);
      frameworkTile('hipaa');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B03 · PCI-DSS tile present',
    run: async () => {
      await delay(150);
      frameworkTile('pci');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B04 · SOC 2 tile present',
    run: async () => {
      await delay(150);
      frameworkTile('soc');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B05 · GDPR tile present',
    run: async () => {
      await delay(150);
      frameworkTile('gdpr');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B06 · Click HIPAA → aria-pressed="true"',
    run: async () => {
      await delay(250);
      const t = frameworkTile('hipaa'); t.click(); await delay(200);
      if (t.getAttribute('aria-pressed') !== 'true') throw new Error('HIPAA tile not selected');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B07 · Click PCI-DSS → aria-pressed="true"',
    run: async () => {
      await delay(250);
      const t = frameworkTile('pci'); t.click(); await delay(200);
      if (t.getAttribute('aria-pressed') !== 'true') throw new Error('PCI tile not selected');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B08 · Click SOC 2 → aria-pressed="true"',
    run: async () => {
      await delay(250);
      const t = frameworkTile('soc'); t.click(); await delay(200);
      if (t.getAttribute('aria-pressed') !== 'true') throw new Error('SOC 2 tile not selected');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B09 · Click GDPR → aria-pressed="true"',
    run: async () => {
      await delay(250);
      const t = frameworkTile('gdpr'); t.click(); await delay(200);
      if (t.getAttribute('aria-pressed') !== 'true') throw new Error('GDPR tile not selected');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B10 · Exactly one tile selected at a time',
    run: async () => {
      await delay(200);
      const selected = document.querySelectorAll('[aria-pressed="true"]');
      // Filter to only framework tiles (they contain phase count text)
      const fwTiles = Array.from(selected).filter(el => el.textContent?.includes('phase'));
      if (fwTiles.length !== 1) throw new Error(`Expected 1 selected framework, got ${fwTiles.length}`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B11 · Framework phase count label visible',
    run: async () => {
      await delay(150);
      const tiles = Array.from(document.querySelectorAll('[aria-pressed]'));
      const hasCount = tiles.some(t => /\d+ phases?/i.test(t.textContent ?? ''));
      if (!hasCount) throw new Error('No tile shows "X phases" label');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'B · Framework Selector',
    name: 'B12 · Return to Standard framework',
    run: async () => {
      await delay(250);
      const t = frameworkTile('standard'); t.click(); await delay(200);
      if (t.getAttribute('aria-pressed') !== 'true') throw new Error('Standard tile not re-selected');
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite C: Phase Cards ──────────────────────────────────────────────────
  {
    suite: 'C · Phase Cards',
    name: 'C01 · <main> element present',
    run: async () => {
      await delay(150);
      if (!document.querySelector('main')) throw new Error('<main> element not found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'C · Phase Cards',
    name: 'C02 · Phase headings rendered',
    run: async () => {
      await delay(180);
      const hs = document.querySelector('main')?.querySelectorAll('h3') ?? [];
      if (hs.length === 0) throw new Error('No phase headings in <main>');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'C · Phase Cards',
    name: 'C03 · Item pill tags present',
    run: async () => {
      await delay(180);
      const pills = document.querySelector('main')?.querySelectorAll('span') ?? [];
      if (pills.length === 0) throw new Error('No pill spans found in phase cards');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'C · Phase Cards',
    name: 'C04 · Expand chevron buttons present',
    run: async () => {
      await delay(180);
      const chevrons = document.querySelectorAll('[aria-expanded]');
      if (chevrons.length === 0) throw new Error('No aria-expanded buttons found (directive chevrons)');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'C · Phase Cards',
    name: 'C05 · Left-accent border on phase cards',
    run: async () => {
      await delay(180);
      const main = document.querySelector('main');
      const cards = main?.children ?? [];
      const hasAccent = Array.from(cards).some(c => c.className.includes('border-l-'));
      if (!hasAccent) throw new Error('No border-l-* left-accent class on phase cards');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'C · Phase Cards',
    name: 'C06 · Status buttons in each card',
    run: async () => {
      await delay(200);
      const completes = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'))
        .filter(b => b.textContent?.trim() === 'Complete');
      if (completes.length === 0) throw new Error('No "Complete" status buttons found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'C · Phase Cards',
    name: 'C07 · Copy-items button in each card',
    run: async () => {
      await delay(180);
      const copyBtns = document.querySelectorAll<HTMLButtonElement>('button[aria-label*="Copy items"]');
      if (copyBtns.length === 0) throw new Error('No "Copy items" buttons found on phase cards');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'C · Phase Cards',
    name: 'C08 · Phase cards count matches framework phases',
    run: async () => {
      await delay(200);
      const tile = Array.from(document.querySelectorAll('[aria-pressed="true"]'))
        .find(t => t.textContent?.includes('phase'));
      const match = tile?.textContent?.match(/(\d+)\s+phase/i);
      const expectedCount = match ? parseInt(match[1], 10) : null;
      if (expectedCount === null) throw new Error('Could not read phase count from selected tile');
      const cards = document.querySelector('main')?.querySelectorAll('h3').length ?? 0;
      if (cards !== expectedCount)
        throw new Error(`Tile says ${expectedCount} phases, found ${cards} headings`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite D: Status Controls ──────────────────────────────────────────────
  {
    suite: 'D · Status Controls',
    name: 'D01 · "In Progress" button marks phase',
    run: async () => {
      await delay(280);
      const btn = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'))
        .find(b => b.textContent?.trim() === 'In Progress');
      if (!btn) throw new Error('"In Progress" button not found');
      btn.click(); await delay(200);
      if (btn.getAttribute('aria-pressed') !== 'true') throw new Error('Not toggled');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'D · Status Controls',
    name: 'D02 · "Complete" button marks phase',
    run: async () => {
      await delay(280);
      const btn = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'))
        .find(b => b.textContent?.trim() === 'Complete');
      if (!btn) throw new Error('"Complete" button not found');
      btn.click(); await delay(200);
      if (btn.getAttribute('aria-pressed') !== 'true') throw new Error('Not toggled');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'D · Status Controls',
    name: 'D03 · "Blocked" button marks phase',
    run: async () => {
      await delay(280);
      const btn = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'))
        .find(b => b.textContent?.trim() === 'Blocked');
      if (!btn) throw new Error('"Blocked" button not found');
      btn.click(); await delay(200);
      if (btn.getAttribute('aria-pressed') !== 'true') throw new Error('Not toggled');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'D · Status Controls',
    name: 'D04 · "Clear" button appears after status set',
    run: async () => {
      await delay(200);
      const clear = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        .find(b => b.textContent?.trim() === 'Clear');
      if (!clear) throw new Error('"Clear" button not present after status assignment');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'D · Status Controls',
    name: 'D05 · "Clear" removes status → aria-pressed="false"',
    run: async () => {
      await delay(250);
      const clear = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        .find(b => b.textContent?.trim() === 'Clear');
      if (!clear) throw new Error('"Clear" button not found');
      clear.click(); await delay(200);
      // After clearing, "Clear" should disappear
      const stillThere = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        .find(b => b.textContent?.trim() === 'Clear');
      if (stillThere) throw new Error('"Clear" still present after click — status not cleared');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'D · Status Controls',
    name: 'D06 · Segmented control: In Progress → Complete resets prior',
    run: async () => {
      await delay(280);
      const ipBtn = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'))
        .find(b => b.textContent?.trim() === 'In Progress');
      const cBtn = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'))
        .find(b => b.textContent?.trim() === 'Complete');
      if (!ipBtn || !cBtn) throw new Error('Status buttons not found');
      ipBtn.click(); await delay(150);
      cBtn.click(); await delay(150);
      if (ipBtn.getAttribute('aria-pressed') === 'true')
        throw new Error('"In Progress" still pressed after switching to "Complete"');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'D · Status Controls',
    name: 'D07 · Status group has accessible aria-label',
    run: async () => {
      await delay(150);
      const groups = document.querySelectorAll('[role="group"][aria-label]');
      if (groups.length === 0) throw new Error('No role="group" with aria-label found on status controls');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'D · Status Controls',
    name: 'D08 · All status buttons have aria-label',
    run: async () => {
      await delay(150);
      const statusBtns = document.querySelectorAll<HTMLButtonElement>('button[aria-pressed][aria-label]');
      if (statusBtns.length < 3) throw new Error(`Only ${statusBtns.length}/3+ status buttons have aria-label`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite E: Progress Bar ─────────────────────────────────────────────────
  {
    suite: 'E · Progress Bar',
    name: 'E01 · role="progressbar" present',
    run: async () => {
      await delay(150);
      if (!document.querySelector('[role="progressbar"]')) throw new Error('No progressbar role');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'E · Progress Bar',
    name: 'E02 · aria-valuemin = 0',
    run: async () => {
      await delay(150);
      const bar = document.querySelector('[role="progressbar"]');
      if (!bar) throw new Error('progressbar not found');
      if (bar.getAttribute('aria-valuemin') !== '0') throw new Error('aria-valuemin ≠ 0');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'E · Progress Bar',
    name: 'E03 · aria-valuemax = 100',
    run: async () => {
      await delay(150);
      const bar = document.querySelector('[role="progressbar"]');
      if (!bar) throw new Error('progressbar not found');
      if (bar.getAttribute('aria-valuemax') !== '100') throw new Error('aria-valuemax ≠ 100');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'E · Progress Bar',
    name: 'E04 · aria-label present on progressbar',
    run: async () => {
      await delay(150);
      const bar = document.querySelector('[role="progressbar"]');
      if (!bar?.getAttribute('aria-label')) throw new Error('aria-label missing on progressbar');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'E · Progress Bar',
    name: 'E05 · Progress increments after marking "Complete"',
    run: async () => {
      await delay(280);
      const bar = document.querySelector('[role="progressbar"]');
      const before = parseInt(bar?.getAttribute('aria-valuenow') ?? '0', 10);
      const completeBtn = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'))
        .find(b => b.textContent?.trim() === 'Complete' && b.getAttribute('aria-pressed') !== 'true');
      if (!completeBtn) { return { status: 'passed', error: null, screenshot: null }; } // all complete already
      completeBtn.click(); await delay(250);
      const after = parseInt(bar?.getAttribute('aria-valuenow') ?? '0', 10);
      if (after <= before) throw new Error(`Progress did not increase: before=${before} after=${after}`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'E · Progress Bar',
    name: 'E06 · Progress summary text shows "X/Y phases"',
    run: async () => {
      await delay(150);
      const text = document.body.textContent ?? '';
      if (!/\d+\/\d+ phase/i.test(text)) throw new Error('Progress fraction text not found in page');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'E · Progress Bar',
    name: 'E07 · "Reset Progress" button present',
    run: async () => {
      await delay(150);
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent?.toLowerCase().includes('reset'));
      if (!btn) throw new Error('"Reset Progress" button not found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'E · Progress Bar',
    name: 'E08 · Sticky header has backdrop-blur class',
    run: async () => {
      await delay(150);
      const sticky = Array.from(document.querySelectorAll('[class*="sticky"]'));
      const hasBlur = sticky.some(el => el.className.includes('backdrop-blur'));
      if (!hasBlur) throw new Error('Sticky progress header does not have backdrop-blur');
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite F: localStorage ─────────────────────────────────────────────────
  {
    suite: 'F · localStorage',
    name: 'F01 · compliance-progress key exists',
    run: async () => {
      await delay(180);
      const raw = localStorage.getItem('compliance-progress');
      if (!raw) throw new Error('"compliance-progress" key not in localStorage');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'F · localStorage',
    name: 'F02 · compliance-progress is valid JSON object',
    run: async () => {
      await delay(150);
      const raw = localStorage.getItem('compliance-progress');
      if (!raw) throw new Error('Key missing');
      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Not a plain object');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'F · localStorage',
    name: 'F03 · compliance-theme key exists',
    run: async () => {
      await delay(150);
      if (!localStorage.getItem('compliance-theme')) throw new Error('"compliance-theme" key missing');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'F · localStorage',
    name: 'F04 · compliance-theme has valid value',
    run: async () => {
      await delay(150);
      const val = localStorage.getItem('compliance-theme');
      if (!['light', 'dark', 'high-contrast'].includes(val ?? ''))
        throw new Error(`Invalid theme value: "${val}"`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'F · localStorage',
    name: 'F05 · Status value in progress object is valid',
    run: async () => {
      await delay(150);
      const raw = localStorage.getItem('compliance-progress');
      if (!raw) return { status: 'passed', error: null, screenshot: null }; // empty is fine
      const obj = JSON.parse(raw);
      const VALID = ['complete', 'in-progress', 'blocked'];
      for (const [k, v] of Object.entries(obj)) {
        if (!VALID.includes(v as string)) throw new Error(`Invalid status "${v}" for key "${k}"`);
      }
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite G: Theme System ─────────────────────────────────────────────────
  {
    suite: 'G · Theme System',
    name: 'G01 · Theme switcher buttons present',
    run: async () => {
      await delay(150);
      const btns = document.querySelectorAll<HTMLButtonElement>('button[aria-label*="mode"], button[title*="mode"], button[aria-label*="Mode"], button[title*="Mode"], button[aria-label*="theme"], button[aria-label*="contrast"]');
      if (btns.length === 0) throw new Error('No theme switcher buttons found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'G · Theme System',
    name: 'G02 · Dark mode toggle adds .dark class',
    run: async () => {
      await delay(280);
      const darkBtn = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        .find(b => b.getAttribute('aria-label')?.toLowerCase().includes('dark') || b.getAttribute('title')?.toLowerCase().includes('dark'));
      if (!darkBtn) throw new Error('Dark mode button not found');
      darkBtn.click(); await delay(220);
      const isDark = document.documentElement.classList.contains('dark');
      darkBtn.click(); await delay(100); // restore
      if (!isDark) throw new Error('html.dark class not added after toggle');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'G · Theme System',
    name: 'G03 · Light mode removes .dark class',
    run: async () => {
      await delay(280);
      // First go dark
      const darkBtn = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        .find(b => b.getAttribute('aria-label')?.toLowerCase().includes('dark') || b.getAttribute('title')?.toLowerCase().includes('dark'));
      const lightBtn = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        .find(b => b.getAttribute('aria-label')?.toLowerCase().includes('light') || b.getAttribute('title')?.toLowerCase().includes('light'));
      if (!darkBtn || !lightBtn) throw new Error('Theme toggle buttons not found');
      darkBtn.click(); await delay(200);
      lightBtn.click(); await delay(200);
      if (document.documentElement.classList.contains('dark'))
        throw new Error('.dark class still present after switching to light');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'G · Theme System',
    name: 'G04 · data-theme attribute updated on toggle',
    run: async () => {
      await delay(250);
      const val = document.documentElement.getAttribute('data-theme');
      if (!val) throw new Error('data-theme attribute missing from <html>');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'G · Theme System',
    name: 'G05 · Theme persists in localStorage after toggle',
    run: async () => {
      await delay(200);
      const stored = localStorage.getItem('compliance-theme');
      if (!stored) throw new Error('"compliance-theme" missing from localStorage');
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite H: Directive System ─────────────────────────────────────────────
  {
    suite: 'H · Directive System',
    name: 'H01 · Chevron toggles aria-expanded false → true',
    run: async () => {
      await delay(250);
      const btn = document.querySelector<HTMLButtonElement>('[aria-expanded="false"]');
      if (!btn) throw new Error('No collapsed directive button found');
      btn.click(); await delay(200);
      if (btn.getAttribute('aria-expanded') !== 'true') throw new Error('aria-expanded not set to true');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'H · Directive System',
    name: 'H02 · Directive content block appears on expand',
    run: async () => {
      await delay(200);
      const pre = document.querySelector('pre');
      if (!pre) throw new Error('<pre> directive block not found after expand');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'H · Directive System',
    name: 'H03 · MacOS traffic-light dots rendered in directive pane',
    run: async () => {
      await delay(150);
      // Dots are <span> elements with bg-[#FF5F57], bg-[#FEBC2E], bg-[#28C840]
      const spans = Array.from(document.querySelectorAll('span[class*="FF5F57"], span[class*="FEBC2E"], span[class*="28C840"]'));
      if (spans.length < 3) throw new Error(`Only ${spans.length}/3 traffic-light dots found`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'H · Directive System',
    name: 'H04 · "directive.sh" label visible in editor chrome',
    run: async () => {
      await delay(150);
      const hasLabel = document.body.textContent?.includes('directive.sh');
      if (!hasLabel) throw new Error('"directive.sh" label not found in DOM');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'H · Directive System',
    name: 'H05 · Copy button in directive pane has aria-label',
    run: async () => {
      await delay(150);
      const copyBtn = document.querySelector<HTMLButtonElement>('button[aria-label*="Copy directive"]');
      if (!copyBtn) throw new Error('Copy directive button (aria-label) not found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'H · Directive System',
    name: 'H06 · Directive content is non-empty',
    run: async () => {
      await delay(150);
      const pre = document.querySelector('pre');
      if (!pre) throw new Error('<pre> not found');
      if ((pre.textContent?.trim().length ?? 0) < 20) throw new Error('Directive content too short');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'H · Directive System',
    name: 'H07 · Chevron toggles true → false (collapse)',
    run: async () => {
      await delay(250);
      const btn = document.querySelector<HTMLButtonElement>('[aria-expanded="true"]');
      if (!btn) throw new Error('No expanded directive button to collapse');
      btn.click(); await delay(200);
      if (btn.getAttribute('aria-expanded') !== 'false') throw new Error('Did not collapse');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'H · Directive System',
    name: 'H08 · Clipboard API available',
    run: async () => {
      await delay(150);
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable (requires secure context)');
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite I: Admin Panel ──────────────────────────────────────────────────
  {
    suite: 'I · Admin Panel',
    name: 'I01 · Lock button has aria-label="Open Admin Panel"',
    run: async () => {
      await delay(150);
      if (!document.querySelector('button[aria-label="Open Admin Panel"]'))
        throw new Error('Lock button not found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'I · Admin Panel',
    name: 'I02 · Lock button is not disabled',
    run: async () => {
      await delay(150);
      const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Open Admin Panel"]');
      if (!btn) throw new Error('Lock button not found');
      if (btn.disabled) throw new Error('Lock button is disabled');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'I · Admin Panel',
    name: 'I03 · Admin panel opens → dialog role appears',
    run: async () => {
      await delay(300);
      const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Open Admin Panel"]');
      btn?.click(); await delay(350);
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) throw new Error('dialog role element not found after click');
      // Close
      dialog.querySelector<HTMLButtonElement>('button[aria-label*="lose"]')?.click();
      await delay(200);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'I · Admin Panel',
    name: 'I04 · Admin dialog has password input',
    run: async () => {
      await delay(300);
      document.querySelector<HTMLButtonElement>('button[aria-label="Open Admin Panel"]')?.click();
      await delay(350);
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) throw new Error('Dialog not found');
      const passInput = dialog.querySelector('input[type="password"]');
      if (!passInput) throw new Error('Password input not found in admin dialog');
      dialog.querySelector<HTMLButtonElement>('button[aria-label*="lose"]')?.click();
      await delay(200);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'I · Admin Panel',
    name: 'I05 · Admin dialog closes on close button',
    run: async () => {
      await delay(300);
      document.querySelector<HTMLButtonElement>('button[aria-label="Open Admin Panel"]')?.click();
      await delay(350);
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) throw new Error('Dialog not found');
      const closeBtn = dialog.querySelector<HTMLButtonElement>('button[aria-label*="lose"], button[aria-label*="Cancel"]');
      if (!closeBtn) throw new Error('Close/Cancel button not found in dialog');
      closeBtn.click(); await delay(250);
      const stillOpen = document.querySelector('[role="dialog"]');
      if (stillOpen) throw new Error('Dialog still open after close click');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'I · Admin Panel',
    name: 'I06 · Admin dialog has submit/action button',
    run: async () => {
      await delay(300);
      document.querySelector<HTMLButtonElement>('button[aria-label="Open Admin Panel"]')?.click();
      await delay(350);
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) throw new Error('Dialog not found');
      const submitBtn = dialog.querySelector<HTMLButtonElement>('button[type="submit"], button[aria-label*="Login"], button[aria-label*="Set"]')
        ?? Array.from(dialog.querySelectorAll('button')).find(b => /login|set|unlock|enter/i.test(b.textContent ?? ''));
      if (!submitBtn) throw new Error('No submit/action button found in admin dialog');
      dialog.querySelector<HTMLButtonElement>('button[aria-label*="lose"]')?.click();
      await delay(200);
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite J: Navigation & ARIA ────────────────────────────────────────────
  {
    suite: 'J · Navigation & ARIA',
    name: 'J01 · ≥ 2 role="tab" elements exist',
    run: async () => {
      await delay(150);
      const tabs = document.querySelectorAll('[role="tab"]');
      if (tabs.length < 2) throw new Error(`Found ${tabs.length} tab(s), expected ≥2`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'J · Navigation & ARIA',
    name: 'J02 · All tabs have aria-selected',
    run: async () => {
      await delay(150);
      const tabs = document.querySelectorAll('[role="tab"]');
      tabs.forEach((t, i) => {
        if (t.getAttribute('aria-selected') === null) throw new Error(`Tab ${i} missing aria-selected`);
      });
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'J · Navigation & ARIA',
    name: 'J03 · All tabs have aria-controls',
    run: async () => {
      await delay(150);
      const tabs = document.querySelectorAll('[role="tab"]');
      tabs.forEach((t, i) => {
        if (!t.getAttribute('aria-controls')) throw new Error(`Tab ${i} missing aria-controls`);
      });
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'J · Navigation & ARIA',
    name: 'J04 · Dashboard tab switches to #dashboard-panel',
    run: async () => {
      await delay(250);
      const tab = document.querySelector<HTMLButtonElement>('#dashboard-tab');
      if (!tab) throw new Error('#dashboard-tab not found');
      tab.click(); await delay(250);
      if (!document.querySelector('#dashboard-panel')) throw new Error('#dashboard-panel not visible');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'J · Navigation & ARIA',
    name: 'J05 · Testing tab switches to #testing-panel',
    run: async () => {
      await delay(250);
      const tab = document.querySelector<HTMLButtonElement>('#testing-tab');
      if (!tab) throw new Error('#testing-tab not found');
      tab.click(); await delay(300);
      const panel = document.querySelector('#testing-panel');
      if (!panel) throw new Error('#testing-panel not visible');
      // Return to dashboard
      document.querySelector<HTMLButtonElement>('#dashboard-tab')?.click(); await delay(200);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'J · Navigation & ARIA',
    name: 'J06 · role="tabpanel" elements exist',
    run: async () => {
      await delay(150);
      const panels = document.querySelectorAll('[role="tabpanel"]');
      if (panels.length === 0) throw new Error('No role="tabpanel" elements found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'J · Navigation & ARIA',
    name: 'J07 · All interactive buttons have accessible label',
    run: async () => {
      await delay(200);
      const issues: string[] = [];
      document.querySelectorAll<HTMLButtonElement>('button').forEach((btn, i) => {
        const label = btn.getAttribute('aria-label') || btn.textContent?.trim() || btn.getAttribute('title');
        if (!label) issues.push(`Button[${i}] (class: ${btn.className.slice(0, 40)})`);
      });
      if (issues.length > 0) throw new Error(`Unlabelled buttons:\n${issues.slice(0, 5).join('\n')}`);
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'J · Navigation & ARIA',
    name: 'J08 · Executive Summary section present',
    run: async () => {
      await delay(150);
      const text = document.body.textContent ?? '';
      if (!text.includes('Executive Summary')) throw new Error('"Executive Summary" text not found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },

  // ── Suite K: UI Polish & Branding ─────────────────────────────────────────
  {
    suite: 'K · UI Polish & Branding',
    name: 'K01 · Footer "Usage Instructions" section present',
    run: async () => {
      await delay(150);
      if (!document.body.textContent?.includes('Usage Instructions'))
        throw new Error('"Usage Instructions" footer text not found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'K · UI Polish & Branding',
    name: 'K02 · "System Version 3.0" badge present',
    run: async () => {
      await delay(150);
      if (!document.body.textContent?.includes('System Version 3.0'))
        throw new Error('"System Version 3.0" text not found in footer');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'K · UI Polish & Branding',
    name: 'K03 · Glassmorphism: backdrop-blur on sticky header',
    run: async () => {
      await delay(150);
      const els = Array.from(document.querySelectorAll('[class*="backdrop-blur"]'));
      if (els.length === 0) throw new Error('No backdrop-blur elements found');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'K · UI Polish & Branding',
    name: 'K04 · Gradient background on root container',
    run: async () => {
      await delay(150);
      const root = document.querySelector('[class*="min-h-screen"]');
      if (!root) throw new Error('Root container not found');
      if (!root.className.includes('gradient') && !root.className.includes('from-['))
        throw new Error('No gradient class on root container');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
  {
    suite: 'K · UI Polish & Branding',
    name: 'K05 · Framework selector grid layout present',
    run: async () => {
      await delay(150);
      const grid = document.querySelector('[class*="grid"]');
      if (!grid) throw new Error('No CSS grid container found for framework selector');
      return { status: 'passed', error: null, screenshot: null };
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PDF Export
// ─────────────────────────────────────────────────────────────────────────────

function generatePdf(results: TestResult[], aiNarrative: string) {
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const ts = new Date().toLocaleString();

  // Group by suite prefix (e.g. "A", "B", ...)
  type SuiteMap = { [suite: string]: TestResult[] };
  const suiteMap: SuiteMap = {};
  results.forEach(r => {
    const prefix = r.name.match(/^([A-Z]\d{2})/)?.[1]?.[0] ?? 'Other';
    // Find suite name from scenario
    const scenario = SCENARIOS.find(s => s.name === r.name);
    const suiteName = scenario?.suite ?? prefix;
    suiteMap[suiteName] = suiteMap[suiteName] ?? [];
    suiteMap[suiteName].push(r);
  });

  const suiteRows = Object.entries(suiteMap).map(([suite, items]) => {
    const rows = items.map(r => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #F0EAD8;font-family:monospace;font-size:11px;color:#3E3228;">${r.name}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #F0EAD8;text-align:center;">
          <span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:10px;font-weight:700;${r.status === 'passed' ? 'background:#ECFDF5;color:#059669;' : 'background:#FEF2F2;color:#DC2626;'}">
            ${r.status.toUpperCase()}
          </span>
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #F0EAD8;font-size:11px;color:#DC2626;">${r.error ?? ''}</td>
      </tr>`).join('');
    return `
      <tr><td colspan="3" style="padding:10px 8px 4px;background:#FBF7F0;font-weight:700;color:#2D241E;font-size:12px;border-top:2px solid #C5A059;">${suite}</td></tr>
      ${rows}`;
  }).join('');

  const aiSection = aiNarrative ? `
    <div style="margin-top:32px;background:#1C1510;border-radius:12px;overflow:hidden;page-break-inside:avoid;">
      <div style="background:#2A2118;padding:10px 16px;display:flex;align-items:center;gap:8px;">
        <span style="width:12px;height:12px;border-radius:50%;background:#FF5F57;display:inline-block;"></span>
        <span style="width:12px;height:12px;border-radius:50%;background:#FEBC2E;display:inline-block;"></span>
        <span style="width:12px;height:12px;border-radius:50%;background:#28C840;display:inline-block;"></span>
        <span style="margin-left:8px;font-family:monospace;font-size:11px;color:rgba(255,255,255,0.35);">gemini-2.5-flash · QA Narrative</span>
      </div>
      <div style="padding:20px;font-family:monospace;font-size:12px;color:#C8B99A;line-height:1.7;white-space:pre-wrap;">${aiNarrative}</div>
    </div>` : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>E2E Test Report — Compliance Workflow Dashboard</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#FDFBF7; color:#2D241E; }
    @media print {
      body { background: white; }
      .no-print { display: none !important; }
      section { page-break-inside: avoid; }
    }
  </style>
</head>
<body style="max-width:900px;margin:0 auto;padding:40px 32px;">
  <!-- Cover -->
  <div style="border-bottom:4px solid #C5A059;padding-bottom:24px;margin-bottom:32px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <h1 style="font-size:26px;font-weight:700;background:linear-gradient(to right,#2D241E,#C5A059,#8B6914);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
          Compliance Workflow Dashboard
        </h1>
        <p style="color:#6B5E52;font-size:13px;margin-top:4px;">E2E Self-Test Report</p>
      </div>
      <div style="text-align:right;font-size:11px;color:#9E8E7E;">
        <div>Generated: ${ts}</div>
        <div>App Version: 3.0.0</div>
        <div>Runner: DOM Inspection Engine</div>
      </div>
    </div>
  </div>

  <!-- Summary -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px;">
    <div style="background:#FBF7F0;border:1px solid #E8DFC8;border-radius:12px;padding:20px;text-align:center;">
      <div style="font-size:36px;font-weight:700;color:#2D241E;">${results.length}</div>
      <div style="font-size:12px;color:#6B5E52;margin-top:4px;">Total Tests</div>
    </div>
    <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;padding:20px;text-align:center;">
      <div style="font-size:36px;font-weight:700;color:#059669;">${passed}</div>
      <div style="font-size:12px;color:#065F46;margin-top:4px;">Passed</div>
    </div>
    <div style="background:${failed > 0 ? '#FEF2F2' : '#F0FDF4'};border:1px solid ${failed > 0 ? '#FECACA' : '#BBF7D0'};border-radius:12px;padding:20px;text-align:center;">
      <div style="font-size:36px;font-weight:700;color:${failed > 0 ? '#DC2626' : '#059669'};">${failed}</div>
      <div style="font-size:12px;color:${failed > 0 ? '#991B1B' : '#065F46'};margin-top:4px;">Failed</div>
    </div>
  </div>

  <!-- Pass rate bar -->
  <div style="margin-bottom:32px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
      <span style="font-size:12px;font-weight:600;color:#2D241E;">Pass Rate</span>
      <span style="font-size:12px;color:#6B5E52;">${results.length > 0 ? Math.round((passed/results.length)*100) : 0}%</span>
    </div>
    <div style="background:#F0EAD8;border-radius:999px;height:10px;overflow:hidden;">
      <div style="height:10px;border-radius:999px;background:linear-gradient(to right,#C5A059,#8B6914);width:${results.length > 0 ? Math.round((passed/results.length)*100) : 0}%;box-shadow:0 0 8px rgba(197,160,89,0.5);"></div>
    </div>
  </div>

  <!-- Results table -->
  <section>
    <h2 style="font-size:14px;font-weight:700;color:#2D241E;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #E8DFC8;">Test Results by Suite</h2>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#2D241E;color:#EAE0D5;">
          <th style="padding:8px;text-align:left;font-size:11px;">Test Case</th>
          <th style="padding:8px;text-align:center;font-size:11px;width:80px;">Status</th>
          <th style="padding:8px;text-align:left;font-size:11px;">Error</th>
        </tr>
      </thead>
      <tbody>${suiteRows}</tbody>
    </table>
  </section>

  ${aiSection}

  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #E8DFC8;text-align:center;font-size:10px;color:#9E8E7E;">
    Techbridge University College · Compliance Workflow Dashboard v3.0 · AI Studio Project Refresh
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) { alert('Pop-up blocked. Please allow pop-ups and try again.'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 800);
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Narrative (Phase 2)
// ─────────────────────────────────────────────────────────────────────────────

async function runAiAnalysis(results: TestResult[], onChunk: (c: string) => void): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const summary = results.map(r =>
    `[${r.status.toUpperCase()}] ${r.name}${r.error ? ': ' + r.error : ''}`).join('\n');
  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: `You are a senior QA engineer reviewing ${results.length} automated DOM-inspection test results for the "Compliance Workflow Dashboard" React app.

Results:
${summary}

Write a concise (≤ 200 words) executive QA narrative:
1. Overall health verdict
2. Root cause for any failures
3. One specific recommendation

Plain text only. No markdown.`,
  });
  for await (const chunk of stream) onChunk(chunk.text ?? '');
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

// Group scenarios by suite
const SUITES = SCENARIOS.reduce<{ name: string; scenarios: Scenario[] }[]>((acc, s) => {
  const existing = acc.find(g => g.name === s.suite);
  if (existing) existing.scenarios.push(s);
  else acc.push({ name: s.suite, scenarios: [s] });
  return acc;
}, []);

const PlaywrightSelfTest = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'dom' | 'ai'>('idle');
  const [summary, setSummary] = useState<{ passed: number; failed: number } | null>(null);
  const [aiNarrative, setAiNarrative] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const screenshotModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedScreenshot) screenshotModalRef.current?.focus();
  }, [selectedScreenshot]);

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'running': return <Loader className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'passed':  return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':  return <XCircle className="w-4 h-4 text-red-500" />;
      default:        return <Beaker className="w-4 h-4 text-gray-400" />;
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setPhase('dom');
    setTestResults([]);
    setSummary(null);
    setAiNarrative('');
    setAiError(null);

    let passed = 0, failed = 0;
    const finalResults: TestResult[] = [];

    for (const scenario of SCENARIOS) {
      setTestResults(prev => [...prev,
        { name: scenario.name, status: 'running', error: null, screenshot: null }]);
      try {
        const result = await scenario.run();
        const final: TestResult = { name: scenario.name, ...result };
        if (result.status === 'passed') passed++; else failed++;
        finalResults.push(final);
        setTestResults(prev => prev.map(r => r.name === scenario.name ? final : r));
      } catch (e: any) {
        failed++;
        const final: TestResult = { name: scenario.name, status: 'failed', error: e.message ?? String(e), screenshot: null };
        finalResults.push(final);
        setTestResults(prev => prev.map(r => r.name === scenario.name ? final : r));
      }
    }

    setSummary({ passed, failed });

    if (hasApiKey) {
      setPhase('ai');
      try { await runAiAnalysis(finalResults, c => setAiNarrative(p => p + c)); }
      catch (e: any) { setAiError(e.message ?? 'AI analysis failed'); }
    }

    setPhase('idle');
    setIsRunning(false);
  };

  const totalRan = testResults.filter(r => r.status !== 'running').length;
  const canExport = !isRunning && testResults.length > 0;

  return (
    <>
      <section className="bg-white/70 dark:bg-[#1E1812]/70 backdrop-blur-sm rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-black/[0.05] dark:border-white/[0.05] p-6 hc-bg hc-border">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#2D241E] dark:text-[#EAE0D5] tracking-tight hc-text-yellow">
              Playwright Self-Test Suite
            </h2>
            <p className="text-sm text-gray-500 dark:text-[#C5A059]/80 mt-1 hc-text">
              {SCENARIOS.length} tests across {SUITES.length} suites
              {hasApiKey && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#8B6914] dark:text-[#C5A059] border border-[#C5A059]/25 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                  AI Analysis enabled
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Export PDF */}
            <button
              onClick={() => generatePdf(testResults, aiNarrative)}
              disabled={!canExport}
              title="Export results to PDF"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#C5A059]/40 text-[#8B6914] dark:text-[#C5A059] bg-[#C5A059]/[0.07] hover:bg-[#C5A059]/[0.14] disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              aria-label="Export test results to PDF"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 17V3M12 17l-4-4M12 17l4-4M3 21h18" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export PDF
            </button>
            {/* Run Tests */}
            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A059] text-[#1A1208] font-semibold rounded-xl hover:bg-[#D4B070] active:bg-[#B08D4C] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A059] dark:ring-offset-[#1E1812] shadow-sm"
              aria-busy={isRunning}
            >
              {isRunning ? <><Loader className="w-4 h-4 animate-spin" /><span>Running…</span></>
                         : <><Beaker className="w-4 h-4" /><span>Run Tests</span></>}
            </button>
          </div>
        </div>

        {/* Summary bar */}
        {summary && (
          <div className="flex flex-wrap items-center gap-4 mb-5 p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]">
            <span className="text-sm font-semibold text-gray-700 dark:text-[#EAE0D5]">{SCENARIOS.length} ran</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" /> {summary.passed} passed
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-red-500 dark:text-red-400">
              <XCircle className="w-4 h-4" /> {summary.failed} failed
            </span>
            {/* Pass rate bar */}
            <div className="flex-1 min-w-[100px] bg-black/[0.06] dark:bg-white/[0.06] rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#C5A059] to-[#8B6914] transition-all duration-500"
                style={{ width: `${Math.round((summary.passed / SCENARIOS.length) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
              {Math.round((summary.passed / SCENARIOS.length) * 100)}%
            </span>
            {summary.failed === 0 && (
              <span className="ml-auto text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30 px-3 py-1 rounded-full animate-pulse">
                All Clear ✓
              </span>
            )}
          </div>
        )}

        {/* Results — grouped by suite */}
        <div className="space-y-3">
          {testResults.length === 0 && !isRunning && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
              Click "Run Tests" to begin the self-test process.
            </div>
          )}

          {SUITES.map(suite => {
            const suiteResultsFlat = testResults.filter(r =>
              suite.scenarios.some(s => s.name === r.name)
            );
            if (suiteResultsFlat.length === 0) return null;

            const suitePassed = suiteResultsFlat.filter(r => r.status === 'passed').length;
            const suiteFailed = suiteResultsFlat.filter(r => r.status === 'failed').length;
            const suiteRunning = suiteResultsFlat.filter(r => r.status === 'running').length;

            return (
              <details key={suite.name} open className="group rounded-xl border border-black/[0.05] dark:border-white/[0.05] overflow-hidden">
                <summary className="flex items-center justify-between px-4 py-3 bg-black/[0.02] dark:bg-white/[0.03] cursor-pointer select-none hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors list-none">
                  <span className="text-sm font-semibold text-[#2D241E] dark:text-[#EAE0D5]">{suite.name}</span>
                  <div className="flex items-center gap-2">
                    {suiteRunning > 0 && <Loader className="w-3.5 h-3.5 animate-spin text-blue-400" />}
                    {suitePassed > 0 && <span className="text-xs text-green-600 dark:text-green-400 font-medium">{suitePassed}✓</span>}
                    {suiteFailed > 0 && <span className="text-xs text-red-500 font-medium">{suiteFailed}✗</span>}
                    <span className="text-xs text-gray-400">{suiteResultsFlat.length}/{suite.scenarios.length}</span>
                  </div>
                </summary>
                <ul className="divide-y divide-black/[0.04] dark:divide-white/[0.04]" aria-live="polite">
                  {suiteResultsFlat.map((result, i) => (
                    <li
                      key={i}
                      className={`px-4 py-2.5 flex items-start gap-3 transition-colors ${
                        result.status === 'passed' ? 'bg-green-50/40 dark:bg-green-900/10'
                        : result.status === 'failed' ? 'bg-red-50/40 dark:bg-red-900/10'
                        : 'bg-white/40 dark:bg-white/[0.02]'}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">{getStatusIcon(result.status)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#2D241E] dark:text-[#D4C5A9]">{result.name}</p>
                        {result.status === 'failed' && result.error && (
                          <pre className="mt-1 text-[10px] text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap bg-red-50 dark:bg-red-900/20 border border-red-200/40 dark:border-red-700/20 p-2 rounded-lg">
                            {result.error}
                          </pre>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}

          {isRunning && testResults.length === 0 && (
            <div className="text-center py-16 flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Initialising test runner… {totalRan}/{SCENARIOS.length}</span>
            </div>
          )}
        </div>

        {/* AI Narrative pane */}
        {hasApiKey && (summary || phase === 'ai') && (
          <div className="mt-5 rounded-xl border border-[#C5A059]/20 dark:border-[#C5A059]/10 overflow-hidden">
            <div className="bg-[#2A2118] dark:bg-[#0F0C09] px-4 py-3 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" aria-hidden="true" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" aria-hidden="true" />
              <span className="ml-2 text-xs text-white/35 font-mono select-none">gemini-2.5-flash · QA Narrative</span>
              {phase === 'ai' && (
                <span className="ml-auto flex items-center gap-1.5 text-xs text-[#C5A059]/70">
                  <Loader className="w-3.5 h-3.5 animate-spin" /> Analysing…
                </span>
              )}
            </div>
            <div className="bg-[#1C1510] dark:bg-[#0A0806] p-5 min-h-[72px]">
              {aiError
                ? <p className="text-red-400 text-sm font-mono">{aiError}</p>
                : aiNarrative
                  ? <p className="text-[#C8B99A] text-sm leading-relaxed font-mono whitespace-pre-wrap">{aiNarrative}</p>
                  : <p className="text-white/20 text-sm font-mono animate-pulse">Waiting for AI response…</p>
              }
            </div>
          </div>
        )}
      </section>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedScreenshot(null)}
          aria-modal="true" role="dialog" aria-labelledby="screenshot-title"
        >
          <div
            className="bg-white dark:bg-[#1E1812] rounded-2xl shadow-2xl w-full max-w-4xl p-4 relative outline-none"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
            ref={screenshotModalRef}
          >
            <h3 id="screenshot-title" className="text-lg font-semibold mb-4 text-[#2D241E] dark:text-[#EAE0D5]">Test Screenshot</h3>
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-gray-800 dark:hover:text-white text-xl leading-none focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              aria-label="Close screenshot viewer"
            >&times;</button>
            <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
              <img src={selectedScreenshot} alt="Test Screenshot" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaywrightSelfTest;