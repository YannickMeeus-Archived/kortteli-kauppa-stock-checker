export const dump = (event: React.ChangeEvent<HTMLSelectElement>) =>
  console.log(JSON.stringify(event.target.value, null, 2));
