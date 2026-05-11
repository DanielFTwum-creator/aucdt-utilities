/**
 * useSSEStream — subscribes to the LyriaStream SSE endpoint.
 *
 * Handles all 5 event types from SRS §8.2:
 *   progress | blend_update | audio_chunk | error | done
 *
 * Auto-reconnects on network drop (max 3 retries).
 * Closes EventSource when done/error received or component unmounts.
 */
import { useEffect, useRef, useCallback } from 'react';
import { generation } from '@/services/api';
export function useSSEStream({ jobId, enabled = true, onProgress, onBlendUpdate, onAudioChunk, onError, onDone, }) {
    const esRef = useRef(null);
    const retryRef = useRef(0);
    const doneRef = useRef(false);
    const MAX_RETRY = 3;
    // Stable callback refs so effect doesn't re-fire on every render
    const cbRef = useRef({});
    cbRef.current = { onProgress, onBlendUpdate, onAudioChunk, onError, onDone };
    const connect = useCallback(() => {
        if (!jobId || !enabled || doneRef.current)
            return;
        const url = generation.streamUrl(jobId);
        const es = new EventSource(url, { withCredentials: true });
        esRef.current = es;
        // ── progress ──────────────────────────────────────────────────────────
        es.addEventListener('progress', (e) => {
            try {
                cbRef.current.onProgress?.(JSON.parse(e.data));
            }
            catch { /* malformed */ }
        });
        // ── blend_update ──────────────────────────────────────────────────────
        es.addEventListener('blend_update', (e) => {
            try {
                cbRef.current.onBlendUpdate?.(JSON.parse(e.data));
            }
            catch { /* malformed */ }
        });
        // ── audio_chunk ───────────────────────────────────────────────────────
        es.addEventListener('audio_chunk', (e) => {
            try {
                cbRef.current.onAudioChunk?.(JSON.parse(e.data));
            }
            catch { /* malformed */ }
        });
        // ── error ─────────────────────────────────────────────────────────────
        es.addEventListener('error', (e) => {
            // Distinguish SSE connection error from application error event
            if ('data' in e && e.data) {
                try {
                    const payload = JSON.parse(e.data);
                    if (!payload.fallback) {
                        doneRef.current = true;
                        es.close();
                    }
                    cbRef.current.onError?.(payload);
                }
                catch { /* malformed */ }
            }
            else {
                // Network-level error — attempt reconnect
                es.close();
                if (retryRef.current < MAX_RETRY && !doneRef.current) {
                    retryRef.current++;
                    const delay = retryRef.current * 2000;
                    setTimeout(connect, delay);
                }
            }
        });
        // ── done ──────────────────────────────────────────────────────────────
        es.addEventListener('done', (e) => {
            try {
                doneRef.current = true;
                es.close();
                cbRef.current.onDone?.(JSON.parse(e.data));
            }
            catch { /* malformed */ }
        });
    }, [jobId, enabled]);
    useEffect(() => {
        doneRef.current = false;
        retryRef.current = 0;
        connect();
        return () => {
            esRef.current?.close();
            esRef.current = null;
        };
    }, [connect]);
    const close = useCallback(() => {
        doneRef.current = true;
        esRef.current?.close();
        esRef.current = null;
    }, []);
    return { close };
}
