import Link from "next/link";
import { Fragment, useState } from "react";
import { ConnectWallet, useAddress, useContract, Web3Button, lightTheme } from "@thirdweb-dev/react";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const [homeToggle, setHomeToggle] = useState(false);
  return (
    <Fragment>
      {/* Right Navigation */}
      <div
        className={`nav_overlay ${toggle ? "go" : ""}`}
        onClick={() => setToggle(false)}
      />
      <div className={`neoh_fn_nav ${toggle ? "go" : ""}`}>
        <div className="trigger is-active">
          <div className="trigger_in" onClick={() => setToggle(false)}>
            <span className="text">Close</span>
            <span className="hamb">
              <span className="hamb_a" />
              <span className="hamb_b" />
              <span className="hamb_c" />
            </span>
          </div>
        </div>
        <div className="nav_content">
          <div className="nav_menu">
            <ul>
              <li className="menu-item menu-item-has-children">
                <a
                  href="https://epopgirls.xyz/"
                  onClick={(e) => {
                    e.preventDefault();
                    setHomeToggle(!homeToggle);
                  }}
                >
                  Home
                </a>
              </li>
              <li className="menu-item">
                <Link legacyBehavior href="https://epopgirls.xyz/#about">
                  About
                </Link>
              </li>
              <li className="menu-item">
                <Link legacyBehavior href="#ecosystem">
                  Ecosystem
                </Link>
              </li>
              <li className="menu-item">
                <Link legacyBehavior href="https://stake.epopgirls.xyz">
                  NFT Stake
                </Link>
              </li>
              <li className="menu-item">
                <Link legacyBehavior href="https://market.epopgirls.xyz" target="_blank">
                  NFT Market
                </Link>
              </li>
              <li className="menu-item">
                <Link legacyBehavior href="https://info.epopgirls.xyz" target="_blank">
                  White Paper
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Nav Footer */}
        <div className={`nav_footer ${toggle ? "ready" : ""}`}>
          <div className="nf_left">
            <p>
              Copyright {new Date().getFullYear()}- Designed &amp; Developed by Epop Girls
            </p>
          </div>
          <div className="nf_right">
            <div className="neoh_fn_social_list">
              <ul>
                <li>
                  <a href="https://x.com/EPopGirlsNFT">
                    <i className="fn-icon-twitter" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* !Nav Footer */}
      </div>
      {/* !Right Navigation */}
      {/* Header */}
      <header className="neoh_fn_header">
        <div className="container">
          <div className="header_in">
            <div className="logo">
              <Link legacyBehavior href="/">
                <a>
                  <img src="img/logo.png" alt="" />
                </a>
              </Link>
            </div>
            <div>
              <ConnectWallet
                theme={lightTheme({
                  colors: {
                    modalBg: "#26001c",
                    borderColor: "transparent",
                    separatorLine: "#3d002a",
                    secondaryText: "#c4c4c4",
                    primaryText: "#ffffff",
                    connectedButtonBg: "transparent",
                    primaryButtonBg: "transparent",
                    primaryButtonText: "#ffffff",
                    secondaryButtonHoverBg: "#3d002a",
                    connectedButtonBgHover: "transparent",
                    walletSelectorButtonHoverBg: "#3d002a",
                    secondaryButtonText: "#ffffff",
                    secondaryButtonBg: "#3d002a",
                  },
                })}
                modalTitle={"Epop Girls"}
                switchToActiveChain={true}
                modalSize={"compact"}
                showThirdwebBranding={false}
                modalTitleIconUrl={"/favicon.ico"}
              />
            </div>
            <div className="trigger">
              <div className="trigger_in" onClick={() => setToggle(!toggle)}>
                <span className="hamb">
                  <span className="hamb_a" />
                  <span className="hamb_b" />
                  <span className="hamb_c" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* !Header */}
    </Fragment>
  );
};
export default Header;
