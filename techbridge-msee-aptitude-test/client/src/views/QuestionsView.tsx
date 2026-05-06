export default function QuestionsView() {
  const questions = [
    { id: 1, q: 'What is the primary goal of the MSEE programme?' },
    { id: 2, q: 'Define systems engineering in the context of complex projects.' },
    { id: 3, q: 'Explain the difference between verification and validation.' },
  ];
  return (
    <div className="space-y-4">
      {questions.map(({ id, q }) => (
        <div key={id} className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-zinc-400 mb-1">Question {id}</p>
          <p className="text-gray-800 font-medium">{q}</p>
          <textarea className="mt-3 w-full border rounded p-2 text-sm resize-none h-20" placeholder="Your answer..." />
        </div>
      ))}
    </div>
  );
}
