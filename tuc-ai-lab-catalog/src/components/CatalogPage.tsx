import React, { useState } from 'react';
import AppCatalog from './AppCatalog';

/**
 * Catalog Page wrapper - can be integrated into main App
 * Usage: <CatalogPage /> or render within App navigation
 */
export default function CatalogPage() {
  return (
    <div className="w-full">
      <AppCatalog />
    </div>
  );
}
