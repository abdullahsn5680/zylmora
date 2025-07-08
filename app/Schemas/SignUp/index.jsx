import * as Yup from 'yup';

export const singUpSchema = Yup.object({
  Username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 6 characters').max(25,'Password must be up to 25 characters').required('Password is required'),
});