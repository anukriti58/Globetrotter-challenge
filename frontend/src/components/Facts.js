import { motion } from 'framer-motion';

const Facts = ({ facts, trivia }) => {
  return (
    <motion.div
      className="facts"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{ marginTop: '20px' }}
    >
      <h3>Fun Facts</h3>
      {facts.map((fact, index) => (
        <p key={index}>{fact}</p>
      ))}
      <h3>Trivia</h3>
      {trivia.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </motion.div>
  );
};

export default Facts;