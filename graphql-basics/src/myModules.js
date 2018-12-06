// Named export - has a name, have as many as needed
// Default export  - has no name, you can have only one

const message = "Some message from myModule.js";
const name = "Ash";
const location = "India";

const getGreeting = name => {
  return `Welcomt to the course ${name}`;
};

export { message, name, getGreeting, location as default };
