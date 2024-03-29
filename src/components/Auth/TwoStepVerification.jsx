import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../lib/http-request";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { API } from "../../utils/config/api-end-points.config";
import { useDataApi } from "../../hooks/useDataApi";
import { QUERYKEY } from "../../utils/config/query-keys.config";
import { Container } from "../../components/UI/Containers";
import { verifyEmailAndPhoneNumberSchema } from "../../utils/validation/auth.validation";
import { useUserStore } from "../../store/user.store";

const TwoStepVerification = () => {
  const navigate = useNavigate();

  const accessToken = useUserStore((state) => state.accessToken);

  let { state } = useLocation();

  const { email, phoneNumber, userId } = state;

  const [verificationStatus, setVerificationStatus] = useState("");

  // if (isLoading) return <h1>Loading</h1>;
  // return (
  //   <>
  //     <Container.Auth>
  //       <QRCode value={data?.data?.data} />
  //     </Container.Auth>
  //   </>
  // );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifyEmailAndPhoneNumberSchema),
  });

  console.log("errors: ", errors);

  const sendTokenForEmailVerification = async (email) => {
    try {
      const res = await axios({
        method: "POST",
        url: API.sendTokenForEmailVerification,
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        data: { email },
      });
      console.log("sendTokenForEmailVerification: res: ", res);
      if (res.status == 200) {
        toast.success(res?.data?.msg);
      }
    } catch (err) {
      console.error("Error: ", err);
      toast.error(err?.response?.data?.message);
    }
  };

  const sendOtpForPhoneNumVerification = async (
    phoneNumber,
    reason = "register"
  ) => {
    try {
      const res = await axios({
        method: "POST",
        url: API.sendOtpForPhoneNumVerification,
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        data: { phoneNumber, reason },
      });
      console.log("sendOtpForPhoneNumVerification: res: ", res);
    } catch (err) {
      console.error("Error: ", err);
      toast.error(err?.response?.data?.message);
    }
  };

  const verifyPhoneNumber = async (phoneNumber, otp) => {
    try {
      const res = await axios({
        method: "POST",
        url: API.verifyPhoneNumber,
        data: { phoneNumber, otp },
      });
      return res;
    } catch (err) {
      console.error("Error: verifyPhoneNumber: ", err);
      toast.error(err?.response?.data?.message);
    }
  };

  const verifyEmail = async (token) => {
    try {
      const res = await axios({
        method: "POST",
        url: API.verifyEmail,
        params: {
          token,
        },
      });
      return res;
    } catch (err) {
      console.error("Error: verifyEmail: ", err);
      toast.error(err?.response?.data?.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      const emailVerificationToken = data?.emailVerificationToken?.trim();
      const phoneVerificationToken = data?.phoneVerificationToken?.trim();

      const emailVerificationRes = await verifyEmail(emailVerificationToken);
      const phoneVerificationRes = await verifyPhoneNumber(
        phoneNumber,
        phoneVerificationToken
      );

      console.log("emailVerificationRes: ", emailVerificationRes);
      console.log("phoneVerificationRes: ", phoneVerificationRes);

      if (
        phoneVerificationRes.status === 200 &&
        emailVerificationRes.status === 200
      ) {
        setVerificationStatus("Both phone number and email are verified!");
        toast.success("Both phone number and email are verified!");
        navigate("/login");
      } else if (phoneVerificationRes.status === 200) {
        refetch();
        setVerificationStatus(
          "Phone number is verified, but email verification failed."
        );
        toast.error("Phone number is verified, but email verification failed.");
      } else if (emailVerificationRes.status === 200) {
        refetch();
        setVerificationStatus(
          "Email is verified, but phone number verification failed."
        );
        toast.error("Email is verified, but phone number verification failed.");
      } else {
        refetch();
        setVerificationStatus(
          "Both phone number and email verification failed. Please try again."
        );
        toast.error(
          "Both phone number and email verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error occurred during verification:", error);
      setVerificationStatus(
        "Error occurred during verification. Please try again."
      );
    }
  };

  const handleResendEmailVerificationLink = async () => {
    console.log("handleResendEmailVerificationLink!");
    await sendTokenForEmailVerification(email);
  };

  const handleResendOtpLink = async () => {
    console.log("handleResendOtpLink!");
    await sendOtpForPhoneNumVerification(phoneNumber);
  };

  return (
    <>
      <Toaster />
      {/* <div className="preloader">
        <img
          src="assets/images/btc-logo.svg"
          alt="preloader icon"
          style={{ height: "90px" }}
        />
      </div> */}
      <section className="account padding-top--style2 padding-bottom-style2 sec-bg-color2">
        <div className="container">
          <div className="account__wrapper">
            <div className="account__inner">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="account__thumb">
                    <img
                      src="assets/images/register.png"
                      alt="account-image"
                      className="dark"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="account__content account__content--style2">
                    <div className="ugf-content pt340">
                      <form
                        action="account-category.html"
                        id="verificationForm"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <div className="input-block">
                          <h4>Verify Email Address</h4>
                        </div>
                        <p>
                          Please check your Email{" "}
                          <strong>mail@example.com</strong> <br /> and put the
                          verification code here
                        </p>
                        <div className="form-group">
                          <input
                            name="emailVerificationToken"
                            {...register("emailVerificationToken", {
                              required: true,
                            })}
                            type="text"
                            className="form-control"
                            id="account-email"
                            placeholder="Enter email verification code"
                            required=""
                          />
                        </div>
                        <p className="resend-code">
                          Don't get?
                          {/* <a href="#">Resend code</a> */}
                          <span onClick={handleResendEmailVerificationLink}>
                            Resend code
                          </span>
                        </p>
                        <div className="input-block">
                          <h4>Verify Phone Number</h4>
                        </div>
                        <p>
                          Please check your Phone <strong>XXXXXX7848</strong>{" "}
                          <br /> and put the verification code here
                        </p>
                        <div className="form-flex email-verification-form">
                          <input
                            name="phoneVerificationToekn"
                            {...register("phoneVerificationToken", {
                              required: true,
                            })}
                            type="text"
                            className="form-control"
                            id="account-email"
                            placeholder="Enter otp"
                            required=""
                          />
                        </div>
                        {/* <div className="form-flex email-verification-form">
                          <div className="form-group">
                            <input
                              type="text"
                              name="phoneNumVerificationOtpInput1"
                              {...register("phoneNumVerificationOtpInput1", {
                                required: true,
                              })}
                              placeholder="0"
                              className="form-control"
                              maxLength="1"
                              required=""
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              name="phoneNumVerificationOtpInput2"
                              {...register("phoneNumVerificationOtpInput2", {
                                required: true,
                              })}
                              placeholder="0"
                              className="form-control"
                              maxLength="1"
                              required=""
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              name="phoneNumVerificationOtpInput3"
                              {...register("phoneNumVerificationOtpInput3", {
                                required: true,
                              })}
                              placeholder="0"
                              className="form-control"
                              maxLength="1"
                              required=""
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              name="phoneNumVerificationOtpInput4"
                              {...register("phoneNumVerificationOtpInput4", {
                                required: true,
                              })}
                              placeholder="0"
                              className="form-control"
                              maxLength="1"
                              required=""
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              name="phoneNumVerificationOtpInput5"
                              {...register("phoneNumVerificationOtpInput5", {
                                required: true,
                              })}
                              placeholder="0"
                              className="form-control"
                              maxLength="1"
                              required=""
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              name="phoneNumVerificationOtpInput6"
                              {...register("phoneNumVerificationOtpInput6", {
                                required: true,
                              })}
                              placeholder="0"
                              className="form-control"
                              maxLength="1"
                              required=""
                            />
                          </div>
                        </div> */}
                        <p className="resend-code">
                          Don't get?
                          {/* <a href="#">Resend code</a> */}
                          <span onClick={handleResendOtpLink}>Resend code</span>
                        </p>
                        <button
                          type="submit"
                          className="trk-btn trk-btn--border trk-btn--primary d-block mt-4"
                        >
                          Submit
                        </button>
                      </form>
                      <div className="account__switch">
                        <p>
                          <a className="style2" href="signup.html">
                            <i className="fa-solid fa-arrow-left-long"></i>
                            Back to Previous
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { TwoStepVerification };

// const onSubmit = async (data) => {
//   const emailVerificationToken = data?.emailVerificationToken?.trim();
//   const phoneVerificationToken = data?.phoneVerificationToken?.trim();
//   console.log("🔷 emailVerificationToken:  ", emailVerificationToken);
//   console.log("🔷 phoneVerificationToken:  ", phoneVerificationToken);

//   try {
//     const emailVerificationResponse = await verifyEmail(
//       emailVerificationToken
//     );
//     const phoneVerificationResponse = await verifyPhoneNumber(
//       phoneNumber,
//       phoneVerificationToken
//     );

//     if (
//       phoneVerificationResponse.status === "success" &&
//       emailVerificationResponse.status === "success"
//     ) {
//       setVerificationStatus("Both phone number and email are verified!");
//     } else if (phoneVerificationResponse.status === "success") {
//       setVerificationStatus(
//         "Phone number is verified, but email verification failed."
//       );
//     } else if (emailVerificationResponse.status === "success") {
//       setVerificationStatus(
//         "Email is verified, but phone number verification failed."
//       );
//     } else {
//       setVerificationStatus(
//         "Both phone number and email verification failed. Please try again."
//       );
//     }
//   } catch (error) {
//     console.error("Error occurred during verification:", error);
//     setVerificationStatus(
//       "Error occurred during verification. Please try again."
//     );
//   }
// };
