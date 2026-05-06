import React from 'react';

export function Refunds() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-[#4A5340] mb-6">Refund Policy</h1>
      <div className="prose prose-lg text-stone-600">
        <p>
          We want you to be completely satisfied with your purchase. If you are not, we offer a comprehensive refund policy.
        </p>
        <h3>Returns</h3>
        <p>
          You have 14 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.
        </p>
        <h3>Refunds</h3>
        <p>
          Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
        </p>
      </div>
    </div>
  );
}
