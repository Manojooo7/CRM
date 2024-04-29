import { AuthPage} from "@refinedev/antd";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: {eamil: "demo@eamil", password: "demo"},
      }}
    />
  );
};