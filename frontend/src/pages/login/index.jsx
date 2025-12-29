//login page
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, AppleFilled, GoogleOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";
import { LOGIN } from "../../apis/apisUtils";

const { Title, Text } = Typography;

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: res } = await axios.post(LOGIN, data, {
        withCredentials: true,  
      });

      navigate("/dashboard");
      console.log(res.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.login_container}>
    <div className={styles.container}>
      <div className={styles.left_container}>
        <img
          src="/logo-new.png"
          alt="Otomator Technologies"
          className={styles.logo}
        />
        <Text style={{ color: "white", fontSize: 18 }} className={styles.welcome_text}>
          Welcome back. You are just one step away from your dashboard.
        </Text>
        {/* <Link to="/signup">
          <Button className={styles.signup_button}>
            Sign Up
          </Button>
        </Link> */}
      </div>

      <div className={styles.right_container}>
        <Form className={styles.form_container} onSubmitCapture={handleSubmit}>
          <Title level={1} style={{ color: "#fff", fontWeight: 600 }} className={styles.login_title}>
            Log In
          </Title>

                {error && <Alert message={error} type="error" showIcon className={styles.error_alert} />}

                <Form.Item className={styles.input_item}>
                  <Input
                    prefix={<UserOutlined style={{ color: "black", fontSize: 25 }} />}
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                    className={styles.inputfield}
                    type="email"
                    placeholder="Email"
                  />
                </Form.Item>

                <Form.Item className={styles.input_item}>
                  <Input
                    prefix={<LockOutlined style={{ color: "black", fontSize: 25 }} />}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    required
                    className={styles.inputfield}
                    type="password"
                    placeholder="Password"

                  />
                </Form.Item>

                <Form.Item className={styles.checkbox_item}>
                  <Checkbox style={{ color: "white" }} className={styles.checkbox}>Keep me logged in</Checkbox>
                  <Link to="/forgot-password" className={styles.forgot_password}>Forgot Password?</Link>
                </Form.Item>

                <Form.Item className={styles.button_item}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.inputbutton}
                    block
                  >
                    Sign In
                  </Button>
                </Form.Item>


              </Form>
            </div>
          </div>
        </div>
  );
};

export default Login;