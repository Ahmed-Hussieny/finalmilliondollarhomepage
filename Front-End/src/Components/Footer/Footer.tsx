import { useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation();

  const isActive = location.pathname !== '/ContactUs';
  return (
    <footer className="bg-black text-center">
    {isActive && <p className="textMainColor m-0">
      © 2024 مليون بكسل باللغة العربية. جميع الحقوق محفوظة.
    </p>}
  </footer>
  )
}

export default Footer
