const test = () => {
  throw new Error('Some error');
};

test()
  .then(() => {
    console.log('success');
  })
  .catch((err) => {
    console.log('USER DEFINED ERROR:: ', err);
  });
