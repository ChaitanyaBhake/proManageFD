import { Eye, Lock, Mail, User } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button/Button';
import FormInput from '../../../components/form/FormInput';
import { AuthContext } from '../../../context/AuthProvider';
import Form from '../Form/Form';
import styles from './Register.module.css';

const defaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Register = () => {
  const [isSafeToReset, setIsSafeToReset] = useState(false);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  //Functions from react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  //Function for Validating Entered FormData
  const validateForm = (data) => {

    //Empty validationError Object
    let validationErrors = {};

    if (!data.name) {
      validationErrors = { ...validationErrors, name: 'Name is required' };
    }

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

    if (data.password !== data.confirmPassword) {
      validationErrors = {
        ...validationErrors,
        confirmPassword: 'Passwords do not match',
      };
    }

    return validationErrors;
  };

  //Submit Function
  const onSumbit = async (data) => {
    try {
      //Validate Form Data
      const validationErrors = validateForm(data);

      //If there are any validation errors then show them to the user
      if (Object.keys(validationErrors).length > 0) {
        Object.keys(validationErrors).forEach((field) => {
          setError(field, {
            type: 'manual',
            message: validationErrors[field],
          });
        });
        return;
      }

      // If ALl validations conditions are met then make API Call
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${baseUrl}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      //If there is an API error from server then show it to the user
      if (!response.ok) {
        const errorJson = await response.json();
        console.log(errorJson);
        const { errors } = errorJson;

        // Iterate over the errors object returned by the API
        for (const property in errors) {
          setError(property, {
            type: 'custom',
            message: errors[property],
          });
        }
        throw new Error(errorJson.error);
      }

      const resJson = await response.json();
      
      //If there is no API error from server then show a success message to the user
      toast.success('Successfully Registered!Redirecting...');

      // Delay execution of authCtx.login(resJson) by 1.5 seconds
      setTimeout(() => {
        authCtx.login(resJson);
        navigate('/');
        setIsSafeToReset(true);
      }, 1500);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  //Reset Form Values on Mount and Dependancy
  useEffect(() => {
    if (!isSafeToReset) return;
    reset(defaultValues);
  }, [reset, isSafeToReset]);

  return (
    <Form title="Register">
      <form onSubmit={handleSubmit(onSumbit)} className={styles.form}>
        {/* Name Field Input */}
        <FormInput
          error={errors.name}
          label="name"
          register={register}
          placeholder={'Name'}
          mainIcon={<User />}
        />

        {/* Email Field Input */}
        <FormInput
          error={errors.email}
          label="email"
          placeholder={'Email'}
          register={register}
          mainIcon={<Mail />}
        />

        {/* Password Field Input */}
        <FormInput
          error={errors.password}
          label={'password'}
          register={register}
          type="password"
          placeholder={'Password'}
          mainIcon={<Lock />}
          secondaryIcon={<Eye />}
        />

        {/*Confirm Password Field Input */}
        <FormInput
          error={errors.confirmPassword}
          label={'confirmPassword'}
          register={register}
          type="password"
          placeholder={'Confirm Password'}
          mainIcon={<Lock />}
          secondaryIcon={<Eye />}
        />

        <Button>{isSubmitting ? 'Registering...' : 'Register'}</Button>
      </form>
    </Form>
  );
};

export default Register;
