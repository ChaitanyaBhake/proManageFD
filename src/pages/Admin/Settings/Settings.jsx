import { Eye, Lock, Mail, User } from 'lucide-react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import Text from '../../../components/common/Text/Text';
import FormInput from '../../../components/form/FormInput';
import { AuthContext } from '../../../context/AuthProvider';
import styles from './Settings.module.css';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);

  const defaultValues = {
    name: user.data.name,
    email: user.data.email,
    oldPassword: '',
    newPassword: '',
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const validateForm = (data) => {
    let validationErrors = {};

    if (!data.oldPassword && !data.newPassword && !data.name && !data.email) {
      validationErrors = {
        ...validationErrors,
        newPassword: 'At least one field is required for update',
      };
    }

    if (
      (data.oldPassword && !data.newPassword) ||
      (!data.oldPassword && data.newPassword)
    ) {
      validationErrors = {
        ...validationErrors,
        newPassword: 'Both password fields are required for update',
      };
    }

    // Validate email format if provided
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      validationErrors = {
        ...validationErrors,
        email: 'Please put valid email',
      };
    }

    // console.log(validationErrors);
    return validationErrors;
  };

  const onSubmit = async (data) => {
    try {
      // 1) Validate Form Data
      const validationErrors = validateForm(data);

      // 2) If there are any validation errors then show them to the user
      if (Object.keys(validationErrors).length > 0) {
        Object.keys(validationErrors).forEach((field) => {
          setError(field, {
            type: 'manual',
            message: validationErrors[field],
          });
        });
        return;
      }

      // 3) Make Api Call Once All Validation are Checked
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      
      const response = await fetch(`${baseUrl}/user/update`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errJson = await response.json();
        console.log(errJson);
        const { errors } = errJson;

        for (const property in errors) {
          setError(property, {
            type: 'custom',
            message: errors[property],
          });
        }
        throw new Error(errJson.error);
      }

      toast.success('Successfully Updated Details!');
      //Logout Function from AuthContext
      logout();
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Text step={5} weight="700">
        Settings
      </Text>

      <form action="" onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <FormInput
          label="name"
          register={register}
          placeholder="Name"
          mainIcon={<User />}
        />

        {/* Email */}
        <FormInput
          error={errors.email}
          label="email"
          register={register}
          placeholder="Email"
          mainIcon={<Mail />}
        />

        {/* Password */}
        <FormInput
          error={errors.newPassword}
          label="oldPassword"
          register={register}
          placeholder="Old Password"
          type="password"
          mainIcon={<Lock />}
          secondaryIcon={<Eye />}
        />

        {/* Confirm Password */}
        <FormInput
          error={errors.newPassword}
          label="newPassword"
          register={register}
          placeholder="New Password"
          type="password"
          mainIcon={<Lock />}
          secondaryIcon={<Eye />}
        />

        <Button>{isSubmitting ? 'Updating...' : 'Update'}</Button>
      </form>
    </div>
  );
};

export default Settings;
