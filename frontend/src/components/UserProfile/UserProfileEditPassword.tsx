import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { userUpdateProfileDetails, userUpdatePassword } from '../../actions';
import { StoreState } from '../../reducers';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { AxiosError } from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export interface ProfileEditPasswordInput {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

const formValidation = {
  password: {
    required: {
      value: true,
      message: 'This field is required.',
    },
    minLength: {
      value: 6,
      message: 'Password minimum length is 6',
    },
    maxLength: {
      value: 255,
      message: 'Full Name field max character up to 255 only.',
    },
  },
  new_password: {
    required: {
      value: true,
      message: 'This field is required.',
    },
    minLength: {
      value: 6,
      message: 'Password minimum length is 6',
    },
    maxLength: {
      value: 255,
      message: 'Email field max character up to 255 only.',
    },
  },
  new_password_confirmation: {
    required: {
      value: true,
      message: 'This field is required.',
    },
    minLength: {
      value: 6,
      message: 'Password minimum length is 6',
    },
    maxLength: {
      value: 255,
      message: 'Email field max character up to 255 only.',
    },
  },
};

interface Props {
  userUpdateProfileDetails: Function;
}

const _UserProfileEditPassword = (props: Props) => {
  const [cookies] = useCookies();

  const [password, setPassword] = useState('');
  const [new_password, setNew_password] = useState('');
  const [new_password_confirmation, setNew_password_confirmation] =
    useState('');

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditPasswordInput>();

  const onSubmit = (data: ProfileEditPasswordInput) => {
    setIsLoading(true);
    setError(false);
    setSuccess(false);
    let profilePasswordData = {
      token: cookies.token,
      user_id: cookies.user.id,
      password: data.password,
      new_password: data.new_password,
      new_password_confirmation: data.new_password_confirmation,
      callback: () => {
        setSuccess(true);
        setMsg('Password Changed Successfully');
      },
      errorCallback: (err: AxiosError) => {
        setError(true);
        let errordata = err.response?.data;
        setMsg(errordata?.error?.message);
      },
      finallyCallback: () => {
        setIsLoading(false);
      },
    };

    userUpdatePassword(profilePasswordData);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          {...register('password', formValidation.password)}
          type={showPassword ? 'text' : 'password'}
          error={Boolean(errors?.password)}
          label="Current Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="filled"
          helperText={errors?.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div>
        <TextField
          {...register('new_password', formValidation.new_password)}
          type={showPassword ? 'text' : 'password'}
          error={Boolean(errors?.new_password)}
          label="New Password"
          value={new_password}
          onChange={(e) => setNew_password(e.target.value)}
          variant="filled"
          helperText={errors?.new_password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div>
        <TextField
          {...register('new_password_confirmation', {
            ...formValidation.new_password_confirmation,
            validate: (value) =>
              value === new_password || 'New Password does not match',
          })}
          type={showPassword ? 'text' : 'password'}
          error={Boolean(errors?.new_password_confirmation)}
          label="New Password Repeat"
          value={new_password_confirmation}
          onChange={(e) => setNew_password_confirmation(e.target.value)}
          variant="filled"
          helperText={errors?.new_password_confirmation?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div>
        <Stack>
          {error || success ? (
            <Alert severity={error ? 'error' : success ? 'success' : 'info'}>
              {msg}
            </Alert>
          ) : null}
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button type="submit" variant="contained" color="warning">
              Update Password
            </Button>
          )}
        </Stack>
      </div>
    </Box>
  );
};

const mapStateToProps = (state: StoreState) => ({});

export const UserProfileEditPassword = connect(mapStateToProps, {
  userUpdateProfileDetails,
})(_UserProfileEditPassword);

export default UserProfileEditPassword;
