import React from 'react';

const steps = [
  {
    number: '1',
    title: 'Check Requirements',
    description: 'Admissions are open each Academic Year. Check that your qualifications are accepted and your grades meet the entry requirements.'
  },
  {
    number: '2',
    title: 'Submit Application',
    description: 'Fill and submit the application form by using our online portal. You will be notified by email within 48 hours.'
  },
  {
    number: '3',
    title: 'Application Review',
    description: 'Each application will be reviewed by the admissions team. This involves a review, verification of documents, and interviews.'
  },
  {
    number: '4',
    title: 'Receive Offer',
    description: 'Successful applicants will receive an offer package by mail with an Admission Letter and Fee Schedule.'
  },
]

const Step: React.FC<{ number: string, title: string, description: string }> = ({ number, title, description }) => (
  <div className="flex">
    <div className="flex-shrink-0 mr-6">
      <div className="w-16 h-16 flex items-center justify-center bg-aucdt-secondary rounded-full text-aucdt-primary font-bold text-2xl">
        {number}
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-aucdt-primary">{title}</h3>
      <p className="mt-2 text-aucdt-dark-text">{description}</p>
    </div>
  </div>
);

const HowToApply: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-aucdt-primary">Incoming Freshman</h2>
            <p className="mt-4 text-lg text-aucdt-dark-text">Follow these steps to join our community of creative thinkers.</p>
        </div>
        <div className="space-y-12">
          {steps.map(step => (
            <Step key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToApply;
