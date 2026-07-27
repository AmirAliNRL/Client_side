import React, { useState } from "react";
import FirstStep from "./FirstStep";
import LoginWithPass from "./LoginWithPass";
import LoginWithOtp from "./LoginWithOtp";
import ForgetPass from "./ForgetPass";

export default function Auth() {
  const [pageType, setPageType] = useState("firstStep");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePage = (page) => setPageType(page);
  return (
    <>
      {pageType == "firstStep" ? (
        <FirstStep
          handlePage={handlePage}
          phoneNumber={phoneNumber}
          handlePhoneNumber={setPhoneNumber}
        />
      ) : pageType == "password" ? (
        <LoginWithPass
          handlePage={handlePage}
          phoneNumber={phoneNumber}
        />
      ) : pageType == "otp" ? (
        <LoginWithOtp
          handlePage={handlePage}
          phoneNumber={phoneNumber}
        />
      ) : (
        <ForgetPass handlePage={handlePage} />
      )}
    </>
  );
}
