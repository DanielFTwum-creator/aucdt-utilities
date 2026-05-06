import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import ExcelJS from 'exceljs';
import { products } from '../../data/products';
import type { Product } from '../../data/products';

// ─── Types ───────────────────────────────────────────────────────────────────

type StockStatus = 'In Stock' | 'Out of Stock' | 'Made to Order';

interface Row {
  product: Product;
  status: StockStatus;
  priceInput: string;  // GHS, editable string
  saved: boolean;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const PRICE_KEY  = 'sashmade_prices';
const STATUS_KEY = 'sashmade_statuses';

function loadPrices(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(PRICE_KEY) || '{}'); } catch { return {}; }
}
function savePrices(p: Record<string, number>) {
  localStorage.setItem(PRICE_KEY, JSON.stringify(p));
}
function loadStatuses(): Record<string, StockStatus> {
  try { return JSON.parse(localStorage.getItem(STATUS_KEY) || '{}'); } catch { return {}; }
}
function saveStatuses(s: Record<string, StockStatus>) {
  localStorage.setItem(STATUS_KEY, JSON.stringify(s));
}

const STATUS_CYCLE: StockStatus[] = ['In Stock', 'Made to Order', 'Out of Stock'];

function nextStatus(current: StockStatus): StockStatus {
  const i = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length];
}

// ─── Build initial rows ───────────────────────────────────────────────────────

function buildRows(): Row[] {
  const prices   = loadPrices();
  const statuses = loadStatuses();
  return products.map((p) => ({
    product: p,
    status: statuses[p.id] ?? (p.inStock ? 'In Stock' : 'Out of Stock'),
    priceInput: String(prices[p.id] ?? p.price),
    saved: false,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InventoryManager() {
  const [rows, setRows]           = useState<Row[]>(buildRows);
  const [filter, setFilter]       = useState<'all' | StockStatus>('all');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => { setRows(buildRows()); }, []);

  // ── Price editing ───────────────────────────────────────────────────────────

  const handlePriceChange = (id: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => r.product.id === id ? { ...r, priceInput: value, saved: false } : r)
    );
  };

  const handleSave = (id: string) => {
    setRows((prev) => {
      const row = prev.find((r) => r.product.id === id);
      if (!row) return prev;
      const parsed = parseFloat(row.priceInput);
      if (isNaN(parsed) || parsed < 0) return prev;

      const stored = loadPrices();
      stored[id] = Math.round(parsed);
      savePrices(stored);

      if (timers.current[id]) clearTimeout(timers.current[id]);
      timers.current[id] = setTimeout(() => {
        setRows((cur) => cur.map((r) => r.product.id === id ? { ...r, saved: false } : r));
      }, 2000);

      return prev.map((r) =>
        r.product.id === id ? { ...r, priceInput: String(Math.round(parsed)), saved: true } : r
      );
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') handleSave(id);
  };

  // ── Status cycling ──────────────────────────────────────────────────────────

  const handleStatusToggle = (id: string) => {
    setRows((prev) => {
      const updated = prev.map((r) => {
        if (r.product.id !== id) return r;
        return { ...r, status: nextStatus(r.status) };
      });
      const s = loadStatuses();
      const row = updated.find((r) => r.product.id === id)!;
      s[id] = row.status;
      saveStatuses(s);
      return updated;
    });
  };

  // ── Excel export ────────────────────────────────────────────────────────────

  const handleExport = async () => {
    setExporting(true);
    setExportError('');
    try {
      const THUMB_H  = 80;
      const ROW_H    = 84;
      const SITE_BASE = window.location.origin;

      const wb = new ExcelJS.Workbook();
      wb.creator = 'SashMade Admin';
      const ws = wb.addWorksheet('SashMade Inventory');

      ws.columns = [
        { header: 'Photo',       key: 'photo',       width: 14 },
        { header: 'ID',          key: 'id',          width: 18 },
        { header: 'Design Name', key: 'name',        width: 22 },
        { header: 'Category',    key: 'category',    width: 16 },
        { header: 'Status',      key: 'status',      width: 14 },
        { header: 'Price (GHS)', key: 'price',       width: 14 },
        { header: 'Features',    key: 'features',    width: 40 },
        { header: 'Description', key: 'description', width: 52 },
      ];

      // Header styling — SashMade brand colours (#4A5340 bg / #D97706 text)
      const headerRow = ws.getRow(1);
      headerRow.height = 22;
      headerRow.eachCell((cell) => {
        cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A3C6B' } };
        cell.font   = { bold: true, color: { argb: 'FFC9A84C' }, size: 11 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { bottom: { style: 'thin', color: { argb: 'FFC9A84C' } } };
      });
      ws.views = [{ state: 'frozen', ySplit: 1 }];

      for (let i = 0; i < rows.length; i++) {
        const r      = rows[i];
        const rowNum = i + 2;
        const row    = ws.getRow(rowNum);
        row.height   = ROW_H;

        const inStock = r.status === 'In Stock';
        const bgColor = inStock ? 'FFFFF8ED' : 'FFFFF3F0';

        row.getCell('id').value          = r.product.id;
        row.getCell('name').value        = r.product.name;
        row.getCell('category').value    = r.product.category;
        row.getCell('status').value      = r.status;
        row.getCell('price').value       = parseFloat(r.priceInput) || r.product.price;
        row.getCell('features').value    = r.product.features.join(' · ');
        row.getCell('description').value = r.product.description;

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
          cell.alignment = { wrapText: true, vertical: 'middle' };
          cell.border    = { bottom: { style: 'hair', color: { argb: 'FFDDDDDD' } } };
        });
        row.getCell('price').numFmt = '"₵"#,##0';

        // Embed thumbnail
        try {
          const imgUrl    = `${SITE_BASE}${r.product.image.startsWith('http') ? '' : ''}${r.product.image}`;
          const pngBase64 = await new Promise<string | null>((resolve) => {
            const img        = new Image();
            img.crossOrigin  = 'anonymous';
            img.onload = () => {
              const scale  = THUMB_H / img.naturalHeight;
              const w      = Math.max(1, Math.round(img.naturalWidth * scale));
              const canvas = document.createElement('canvas');
              canvas.width  = w;
              canvas.height = THUMB_H;
              const ctx = canvas.getContext('2d');
              if (!ctx) { resolve(null); return; }
              ctx.drawImage(img, 0, 0, w, THUMB_H);
              resolve(canvas.toDataURL('image/png').split(',')[1]);
            };
            img.onerror = () => resolve(null);
            img.src = imgUrl;
          });

          if (pngBase64) {
            const imgId = wb.addImage({ base64: pngBase64, extension: 'png' });
            ws.addImage(imgId, {
              tl: { col: 0, row: rowNum - 1 } as ExcelJS.Anchor,
              br: { col: 1, row: rowNum }     as ExcelJS.Anchor,
              editAs: 'oneCell',
            });
          }
        } catch {
          // skip image if fetch fails (external URL / CORS)
        }
      }

      const buf  = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = `sashmade-inventory-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  // ── Derived counts ──────────────────────────────────────────────────────────

  const inStockCount     = rows.filter((r) => r.status === 'In Stock').length;
  const mtoCount         = rows.filter((r) => r.status === 'Made to Order').length;
  const outOfStockCount  = rows.filter((r) => r.status === 'Out of Stock').length;
  const visibleRows      = filter === 'all' ? rows : rows.filter((r) => r.status === filter);

  const statusStyle = (s: StockStatus) => {
    if (s === 'In Stock')     return 'border-green-600/50 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20';
    if (s === 'Made to Order') return 'border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20';
    return 'border-red-400/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20';
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Inventory Manager</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            Edit prices, toggle availability, and export to Excel.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4A5340] text-white text-sm font-bold rounded-xl hover:bg-[#3A4232] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Download inventory as Excel file"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? 'Building…' : 'Download Inventory (.xlsx)'}
        </button>
      </div>

      {exportError && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg" role="alert">
          {exportError}
        </p>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'In Stock',      count: inStockCount,    color: 'text-green-600' },
          { label: 'Made to Order', count: mtoCount,        color: 'text-amber-600' },
          { label: 'Out of Stock',  count: outOfStockCount, color: 'text-red-500'   },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap" role="tablist">
        {([
          ['all', `All (${rows.length})`],
          ['In Stock', `In Stock (${inStockCount})`],
          ['Made to Order', `Made to Order (${mtoCount})`],
          ['Out of Stock', `Out of Stock (${outOfStockCount})`],
        ] as const).map(([val, label]) => (
          <button
            key={val}
            role="tab"
            aria-selected={filter === val}
            onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              filter === val
                ? 'bg-[#4A5340] text-white border-[#4A5340]'
                : 'border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-[#4A5340] dark:hover:border-[#D97706]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[64px_1fr_140px_140px_160px_80px] gap-4 px-5 py-3 bg-[#4A5340] text-[#D97706] text-xs font-bold uppercase tracking-widest">
          <div></div>
          <div>Design</div>
          <div>Category</div>
          <div>Status</div>
          <div>Price (GHS)</div>
          <div></div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-stone-100 dark:divide-stone-700">
          {visibleRows.map((row) => (
            <div
              key={row.product.id}
              className="grid grid-cols-[64px_1fr_140px_140px_160px_80px] gap-4 items-center px-5 py-3 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
            >
              {/* Thumbnail */}
              <img
                src={row.product.image}
                alt={row.product.name}
                className="w-14 h-14 object-cover rounded-lg bg-stone-100 dark:bg-stone-700 shrink-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Name + tagline */}
              <div className="min-w-0">
                <p className="font-serif font-bold text-[#4A5340] dark:text-white truncate">{row.product.name}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">{row.product.tagline}</p>
                <ul className="flex flex-wrap gap-x-2 mt-1">
                  {row.product.features.map((f, i) => (
                    <li key={i} className="text-[10px] text-[#D97706] font-medium">{f}</li>
                  ))}
                </ul>
              </div>

              {/* Category */}
              <div className="text-xs text-stone-600 dark:text-stone-300 truncate">{row.product.category}</div>

              {/* Status toggle */}
              <button
                onClick={() => handleStatusToggle(row.product.id)}
                title="Click to cycle status"
                aria-label={`Status: ${row.status}. Click to change.`}
                className={`text-xs px-3 py-1.5 rounded-full border font-bold transition-colors truncate ${statusStyle(row.status)}`}
              >
                {row.status}
              </button>

              {/* Price input */}
              <div className="flex items-center gap-1">
                <span className="text-stone-500 dark:text-stone-400 text-sm font-bold">₵</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={row.priceInput}
                  onChange={(e) => handlePriceChange(row.product.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, row.product.id)}
                  className="w-20 bg-transparent border-b border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white text-sm py-1 px-1 focus:outline-none focus:border-[#4A5340] dark:focus:border-[#D97706] transition-colors"
                  aria-label={`Price for ${row.product.name}`}
                />
              </div>

              {/* Save button */}
              <div className="flex items-center gap-2">
                {row.saved ? (
                  <CheckCircle className="w-5 h-5 text-green-500" aria-label="Saved" />
                ) : (
                  <button
                    onClick={() => handleSave(row.product.id)}
                    className="px-3 py-1 bg-[#4A5340] text-white text-xs font-bold rounded-lg hover:bg-[#3A4232] transition-colors"
                    aria-label={`Save price for ${row.product.name}`}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-stone-400 text-center">
        Prices and statuses are persisted in localStorage. Export includes embedded product images.
      </p>
    </motion.div>
  );
}
