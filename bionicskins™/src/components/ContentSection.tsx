import { motion } from 'motion/react';

interface Props {
  title: string;
  description: string;
  imageSrc: string;
}

export default function ContentSection({ title, description, imageSrc }: Props) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center"
    >
      <div>
        <h2 className="text-5xl font-bold font-serif text-navy mb-8 tracking-tight">{title}</h2>
        <p className="text-xl text-[#5F7182] font-sans leading-relaxed font-light">{description}</p>
      </div>
      <img src={imageSrc} alt={title} className="rounded-[16px] shadow-xl w-full h-[500px] object-cover border-4 border-[#FDFCFA]" referrerPolicy="no-referrer" />
    </motion.section>
  );
}
