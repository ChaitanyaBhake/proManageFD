import { Eye, Lock, Mail } from 'lucide-react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button/Button';
import FormInput from '../../../components/form/FormInput';
import { AuthContext } from '../../../context/AuthProvider';
import Form from '../Form/Form';
import styles from './Login.module.css';

//OUTLET for Auth Hero
const defaultValues = {
  email: '',
  password: '',
};

const Login = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  //User form function
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  //Function for Validating Entered FormData
  const validateForm = (data) => {
    let validationErrors = {};

    if (!data.email) {
      validationErrors = { ...validationErrors, email: 'Email is required' };
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      validationErrors = { ...validationErrors, email: 'Email is not valid' };
    }
    if (!data.password) {
      validationErrors = {
        ...validationErrors,
        password: 'Password is required',
      };
    } else if (data.password.length < 6) {
      validationErrors = {
        ...validationErrors,
        password: 'Password must be at least 6 characters',
      };
    }
    return validationErrors;
  };

  //onSubmit Function
  const onSubmit = async (data) => {
    const validationErrors = validateForm(data);

    //If there are any validation errors then show them to user
    if (Object.keys(validationErrors).length > 0) {
      Object.keys(validationErrors).forEach((field) => {
        setError(field, {
          type: 'manual',
          message: validationErrors[field],
        });
      });
      return;
    }

    try {
      // Api Call
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${baseUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error);
      }

      const resJson = await response.json();

      authCtx.login(resJson);

      //Show success toast after 400 ms.
      setTimeout(() => {
        toast.success('Login Successful!!!');
      }, 400);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <Form title="Login">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Email Input */}
        <FormInput
          error={errors.email}
          register={register}
          label="email"
          placeholder={'Email'}
          mainIcon={<Mail />}
        />

        {/* Password Input */}
        <FormInput
          error={errors.password}
          label="password"
          register={register}
          placeholder={'Password'}
          mainIcon={<Lock />}
          secondaryIcon={<Eye />}
        />

        <Button> {isSubmitting ? 'Logging in...' : 'Login'} </Button>
      </form>
    </Form>
  );
};

export default Login;
