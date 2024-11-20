import Layout from "@/layout/Layout";
import AboutComponent from "@components/AboutComponent";
import Drops from "@components/Drops";
import ServicesComponent from "@components/ServicesComponent";
import WhyChooseUsComponent from "@components/WhyChooseUsComponent";

const Index = () => {
  return (
    <Layout pageName={"Home Static"}>
      {/* Hero Header */}
      <div className="neoh_fn_hero">
        {/* Overlay (of hero header) */}
        <div className="bg_overlay">
          {/* Overlay Color */}
          <div className="bg_color" />
          {/* !Overlay Color */}
        </div>
        {/* Overlay (of hero header) */}
        <div className="hero_content">
          <div className="container">
            <div className="content">
              <span>
                <img src="/img/main-banner.png" alt="" />
              </span>
            </div>
          </div>
          <a
            href="#about"
            className="neoh_fn_down magic-hover magic-hover__square"
          >
            <span className="text">Stake Now</span>
            <span className="icon">
              <img src="svg/right-arr.svg" alt="" className="fn__svg" />
            </span>
          </a>
        </div>
      </div>
      {/* !Hero Header */}
      {/* About Section */}
      <AboutComponent />
      {/* !About Section */}
      {/* Services Section */}
      <ServicesComponent />
      {/* !Services Section */}
      <Drops />
      {/* Investor Section */}
      <WhyChooseUsComponent />
    </Layout>
  );
};
export default Index;
