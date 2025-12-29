import MyPageLayout from "./MyPageLayout";
import "./MyOrders.css";

function MyProfile() {
  return (
    <MyPageLayout title="회원 정보">
      <div className="order-state">
        회원 정보 페이지 
      </div>
    </MyPageLayout>
  );
}

export default MyProfile;
