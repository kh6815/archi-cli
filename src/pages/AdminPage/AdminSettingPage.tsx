import React from "react";
import CategorySetting from "./components/CategorySetting";

const AdminSettingPage: React.FC = () => {
    
// 어드민만 해당 페이지 접근 가능
  
    return (
        <>
            <CategorySetting />
        </>
    );
  };

  export default AdminSettingPage;