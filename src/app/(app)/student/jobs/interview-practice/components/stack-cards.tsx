import Image from 'next/image';
import styles from './stack-cards.module.css';

const StackCards = () => {
  const cards = [
    { className: 'q1', title: 'Tell me about yourself?', img: '/images/q1.png' },
    { className: 'q2', title: 'How do you handle stress at work?', img: '/images/q2.png' },
    { className: 'q3', title: 'What are your weaknesses?', img: '/images/q3.png' },
    { className: 'q4', title: 'Where do you see yourself in 5 years?', img: '/images/q4.png' },
    { className: 'q5', title: 'Why do you want to work here?', img: '/images/q5.png' },
  ];

  return (
    <div className={styles.tariffCards}>
      {cards.map((card, index) => (
        <div
          key={index}
          className={styles[card.className]}
          style={{ '--index': index } as React.CSSProperties}
        >
            <h3>{card.title}</h3>
          <span>Question</span>
          <div className={styles.imageWrapper}>
            <Image src={card.img} alt={card.title} layout="fill" objectFit="cover" />
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default StackCards;
