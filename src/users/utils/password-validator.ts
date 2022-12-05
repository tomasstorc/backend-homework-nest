import passwordValidator from 'password-validator';
const validatePassword = (password: string): boolean | any[] => {
  const schema = new passwordValidator();
  schema
    .is()
    .min(6, 'password must be atleast 6 characters long')
    .has()
    .uppercase(1, 'password must contain atleast one upper case letter')
    .has()
    .lowercase(1, 'password must contain atleast one lower case letter');

  return schema.validate(password);
};

export default validatePassword;
