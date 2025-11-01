export const scenarioQuestions = [
  {
    scenario: "You just got your first job earning ₹40,000/month. What do you do with your income?",
    options: [
      { id: "a", text: "Spend it all on lifestyle upgrades" },
      { id: "b", text: "Save ₹10,000 and invest ₹5,000" },
      { id: "c", text: "Save ₹20,000 but make no investments" },
      { id: "d", text: "Take a loan for a new phone" },
    ],
    correctOption: "b",
    points: { a: 0, b: 10, c: 6, d: -5 },
  },
  {
    scenario: "You have ₹1,00,000 in savings. What’s the safest option to preserve its value against inflation?",
    options: [
      { id: "a", text: "Keep all cash at home" },
      { id: "b", text: "Deposit in a high-interest savings account" },
      { id: "c", text: "Invest in stocks and mutual funds" },
      { id: "d", text: "Buy a luxury item" },
    ],
    correctOption: "c",
    points: { a: 0, b: 6, c: 10, d: -5 },
  },
  {
    scenario: "You want to buy a laptop worth ₹80,000. What’s the most financially sound decision?",
    options: [
      { id: "a", text: "Buy on EMI despite no savings" },
      { id: "b", text: "Delay purchase and save up first" },
      { id: "c", text: "Borrow from a friend" },
      { id: "d", text: "Use your credit card to buy it immediately" },
    ],
    correctOption: "b",
    points: { a: 0, b: 10, c: 4, d: -4 },
  },
  {
    scenario: "Your car breaks down and needs ₹10,000 repair. What’s the best way to handle it?",
    options: [
      { id: "a", text: "Use credit card and pay minimum due" },
      { id: "b", text: "Take from emergency fund" },
      { id: "c", text: "Take a small personal loan" },
      { id: "d", text: "Ignore and continue using it" },
    ],
    correctOption: "b",
    points: { a: 3, b: 10, c: 5, d: 0 },
  },
  {
    scenario: "You receive a ₹50,000 bonus. What should you ideally do?",
    options: [
      { id: "a", text: "Invest it all in one high-risk stock" },
      { id: "b", text: "Spend it on a vacation" },
      { id: "c", text: "Split between investment and savings" },
      { id: "d", text: "Keep it idle in bank" },
    ],
    correctOption: "c",
    points: { a: 2, b: 0, c: 10, d: 5 },
  },
  {
    scenario: "You have multiple debts. What should you prioritize?",
    options: [
      { id: "a", text: "Pay the smallest first (snowball method)" },
      { id: "b", text: "Ignore until due dates arrive" },
      { id: "c", text: "Pay the highest interest one first" },
      { id: "d", text: "Take another loan to repay existing ones" },
    ],
    correctOption: "c",
    points: { a: 6, b: 0, c: 10, d: -5 },
  },
];

export default scenarioQuestions