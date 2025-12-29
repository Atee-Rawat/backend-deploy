import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";
import { REGISTER } from "../../apis/apisUtils";

const { Title, Text } = Typography;

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(REGISTER, data, {
        withCredentials: true,
      });
      navigate("/");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <div className={styles.login_container}>
        <div className={styles.container}>
          <div className={styles.left_container}>
            <img
              src="/logo-new.png"
              alt="Otomator Technologies"
              className={styles.logo}
            />
            
            <Text style={{ color: "white", fontSize: 18 }} className={styles.welcome_text}>
              Start managing your dashboard right away!
            </Text>
            <Link to="/">
              <Button className={styles.signup_button}>Log In</Button>
            </Link>
          </div>

          <div className={styles.right_container}>
            <Form className={styles.form_container} onSubmitCapture={handleSubmit}>
              <Title level={1} style={{ color: "#fff", fontWeight: 600 }} className={styles.login_title}>
                Sign Up
              </Title>

              {error && (
                <Alert message={error} type="error" showIcon className={styles.error_alert} />
              )}

              <Form.Item className={styles.input_item}>
                <Input
                  prefix={<UserOutlined style={{ color: "black", fontSize: 25 }} />}
                  name="firstName"
                  value={data.firstName}
                  onChange={handleChange}
                  required
                  className={styles.inputfield}
                  placeholder="First Name"
                />
              </Form.Item>

              <Form.Item className={styles.input_item}>
                <Input
                  prefix={<UserOutlined style={{ color: "black", fontSize: 25 }} />}
                  name="lastName"
                  value={data.lastName}
                  onChange={handleChange}
                  required
                  className={styles.inputfield}
                  placeholder="Last Name"
                />
              </Form.Item>

              <Form.Item className={styles.input_item}>
                <Input
                  prefix={<UserOutlined style={{ color: "black", fontSize: 25 }} />}
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  className={styles.inputfield}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item className={styles.input_item}>
                <Input
                  prefix={<LockOutlined style={{ color: "black", fontSize: 25 }} />}
                  name="password"
                  type="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  className={styles.inputfield}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item className={styles.button_item}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.inputbutton}
                  block
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
