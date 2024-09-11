import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { from_email } from "../utils/utils";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'verificationCode') {
      setVerificationCode(e.target.value);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/send_email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          from_email: from_email,
          subject: "Password Recovery",
          to_email: email 
        }),
      });

      let data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Email Sent!',
          text: 'Please check your email for the verification code.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
        setEmailSent(true);
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.detail || 'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send the email. Please check your connection.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleCheckVerificationCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/check_code/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verification_code: verificationCode }),
      });

      let data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Code Verified!',
          text: 'You can now reset your password.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
        navigate("/auth/reset-password/");
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.detail || 'Invalid verification code. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to verify the code. Please check your connection.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#f7f7f7',
  };

  const boxStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
  };

  const headingStyle = {
    fontSize: '24px',
    marginBottom: '10px',
  };

  const textStyle = {
    color: '#6c757d',
    fontSize: '14px',
    marginBottom: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '10px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={require("../assets/logo.png")}
            alt="Your Company"
            style={{ height: '48px', marginBottom: '16px' }}
          />
          <h2 style={headingStyle}>Forgot Password</h2>
          <p style={textStyle}>
            Enter your email to receive a verification code. Check your email for further instructions.
          </p>
        </div>
        <form onSubmit={emailSent ? handleCheckVerificationCode : handleForgotPassword}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleInputChange}
              disabled={emailSent}
              style={inputStyle}
            />
          </div>
          {emailSent && (
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          )}
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
            disabled={emailSent && !verificationCode}
          >
            {emailSent ? 'Verify Code' : 'Send Verification Code'}
          </button>
          <p style={textStyle}>
            Remember your password?{' '}
            <Link to="/login">
              <span style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'underline' }}>
                Sign In
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
