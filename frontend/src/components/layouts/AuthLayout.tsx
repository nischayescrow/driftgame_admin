import { type ReactNode } from "react";
import bgImage from "../../assets/images/authLayoutBg.jpg";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`flex-1 bg-cover bg-center bg-no-repeat flex overflow-y-auto`}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
