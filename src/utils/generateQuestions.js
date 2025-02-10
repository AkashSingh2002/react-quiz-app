function generateQuestions(count) {
    const sampleQuestions = [
      { question: "What is React?", options: ["Library", "Framework", "Language", "IDE"], answer: 0 },
      { question: "Who created React?", options: ["Google", "Facebook", "Microsoft", "Amazon"], answer: 1 },
      { question: "What is JSX?", options: ["JavaScript XML", "JavaScript Extension", "Java Syntax", "Java XML"], answer: 0 },
      { question: "Which hook is used for state?", options: ["useRef", "useState", "useEffect", "useMemo"], answer: 1 },
      { question: "What is the use of useEffect?", options: ["API Calls", "State Updates", "Side Effects", "All of the Above"], answer: 3 },
    ];
    return sampleQuestions.slice(0, count);
  }
  
  export default generateQuestions;
  