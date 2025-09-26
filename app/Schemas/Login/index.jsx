import * as yup from 'yup';
export const LoginSchema = yup.object({
    Username: yup.string().required('Username is required'),
    password: yup.string().min(8,'min 8 characters are required').max(25,'Password must be up to 25 characters').required('Password is required'),
})