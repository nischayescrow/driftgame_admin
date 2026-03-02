import { type ReactNode } from "react";
import bgImage from "../../assets/images/authLayoutBg.jpg";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`bg-cover bg-center bg-no-repeat min-w-screen max-w-screen min-h-screen flex`}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
