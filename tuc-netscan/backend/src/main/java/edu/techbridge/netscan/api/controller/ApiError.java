package edu.techbridge.netscan.api.controller;

import java.time.Instant;

/** Shared error envelope returned by the NetScan API. */
public record ApiError(int status, String code, String message, Instant timestamp, String path) {}
