function generateQuestions(count) {
  const sampleQuestions = [
    { question: "What is React?", options: ["Library", "Framework", "Language", "IDE"], correctIndex: 0 },
    { question: "Who created React?", options: ["Google", "Facebook", "Microsoft", "Amazon"], correctIndex: 1 },
    { question: "What is JSX?", options: ["JavaScript XML", "JavaScript Extension", "Java Syntax", "Java XML"], correctIndex: 0 },
    { question: "Which hook is used for state?", options: ["useRef", "useState", "useEffect", "useMemo"], correctIndex: 1 },
    { question: "What is the use of useEffect?", options: ["API Calls", "State Updates", "Side Effects", "All of the Above"], correctIndex: 3 },
    { question: "Which command is used to create a new React app?", options: ["npx create-react-app", "npm install react", "react init", "npm start"], correctIndex: 0 },
    { question: "How do you pass data to a child component?", options: ["Using state", "Using props", "Using refs", "Using useEffect"], correctIndex: 1 },
    { question: "Which method is used to update state in a class component?", options: ["setState()", "updateState()", "changeState()", "modifyState()"], correctIndex: 0 },
    { question: "Which file contains the root component in a React app?", options: ["App.js", "index.js", "Main.js", "Root.js"], correctIndex: 1 },
    { question: "What does React use to optimize rendering performance?", options: ["DOM", "Virtual DOM", "Shadow DOM", "None of the Above"], correctIndex: 1 },
  ];
  return sampleQuestions.slice(0, count);
}

export default generateQuestions;
