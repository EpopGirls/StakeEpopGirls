const WhyChooseUsComponent = () => {
  return (
    <section id="investor">
      {/* Dividers */}
      <img
        src="svg/divider.svg"
        alt=""
        className="fn__svg fn__divider top_divider"
      />
      <img
        src="svg/divider.svg"
        alt=""
        className="fn__svg fn__divider bottom_divider"
      />
      {/* !Dividers */}
      <div className="container">
        {/* Main Title */}
        <div className="neoh_fn_title">
          <h3 className="fn_title">Community Hub</h3>
          <div className="line">
            <span />
          </div>
        </div>
        {/* !Main Title */}
        {/* Investor List Shortcode */}
        <div className="neoh_fn_investor">
          <ul>
            <li>
              <div className="item">
                <img src="img/investors/1.png" alt="" />
                <a href="https://www.intract.io/project/epop-girls" className="full_link" />
              </div>
            </li>
            <li>
              <div className="item">
                <img src="img/investors/2.png" alt="" />
                <a href="https://dac.metahub.finance/communities/epopgirls" className="full_link" />
              </div>
            </li>
            <li>
              <div className="item">
                <img src="img/investors/3.png" alt="" />
                <a href="https://app.questn.com/epopgirls" className="full_link" />
              </div>
            </li>
            <li>
              <div className="item">
                <img src="img/investors/4.png" alt="" />
                <a href="https://rewards.taskon.xyz/EpopGirls" className="full_link" />
              </div>
            </li>
            <li>
              <div className="item">
                <img src="img/investors/5.png" alt="" />
                <a href="#" className="full_link" />
              </div>
            </li>
          </ul>
        </div>
        {/* !Investor List Shortcode */}
      </div>
    </section>
  );
};
export default WhyChooseUsComponent;
