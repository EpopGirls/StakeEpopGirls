import Link from "next/link";
import { Fragment, useState } from "react";
const Timeline = () => {
  const [active, setActive] = useState(1);
  const [activeTimeline, setActiveTimeline] = useState(1);
  const onClick = (value) => {
    setActive(value);
  };
  const activeClass = (value) =>
    value === active ? "active" : value > active ? "next" : "previous";
  const filter = (value) => (100 / active) * value;
  return (
    <Fragment>
      {/* Main Title */}
      <div className="neoh_fn_title">
        <h3 id="ecosystem" className="fn_title">Epop Ecosystem</h3>
        <div className="line">
          <span />
        </div>
      </div>
      {/* !Main Title */}
      {/* Timeline */}
      <div className="neoh_fn_timeline">
        {/* Timeline Content */}
        <div className="timeline_content">
          <ul className="timeline_list">
            <li className={`timeline_item ${activeClass(1)}`} data-index={1}>
              <div className="t_item">
                <div className="t_item_img">
                  <div className="neoh_fn_gallery_1_2">
                    <div className="gallery_in">
                      <div className="item row2">
                        <img src="img/timeline/1/1.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/1/2.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/1/3.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="t_item_info">
                  <p className="fn_date">
                    <span>About</span>
                  </p>
                  <h3 className="fn_title">
                    <Link legacyBehavior href="/">
                      How it works?
                    </Link>
                  </h3>
                  <p className="fn_desc">
                    Epop Girls is an exciting NFT adventure where you can earn rewards for staking and get the main token of the ecosystem, join the adventure by minting your first EGirl and become a big player in the erotic NFT world, while building and expanding your empire with bars and nightclubs from the ecosystem store.
                  </p>
                </div>
              </div>
            </li>
            <li className={`timeline_item ${activeClass(2)}`} data-index={2}>
              <div className="t_item">
                <div className="t_item_img">
                  <div className="neoh_fn_gallery_1_2">
                    <div className="gallery_in">
                      <div className="item row2">
                        <img src="img/timeline/2/1.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/2/2.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/2/3.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="t_item_info">
                  <p className="fn_date">
                    <span>Token Burn System</span>
                  </p>
                  <h3 className="fn_title">
                    <Link legacyBehavior href="/">
                      Token Burn
                    </Link>
                  </h3>
                  <p className="fn_desc">
                    In the ecosystem, the first to benefit will be the NFT holders, since token minting will not begin until the first NFT phase is completed.
                  </p>
                  <p>
                    Knowing this, the first to obtain the $EPOP token will have the opportunity to burn their tokens to obtain up to 3 Epop Girls NFT, thus having a greater sense of value for the token and the first holders will be able to obtain greater benefits.
                  </p>
                </div>
              </div>
            </li>
            <li className={`timeline_item ${activeClass(3)}`} data-index={3}>
              <div className="t_item">
                <div className="t_item_img">
                  <div className="neoh_fn_gallery_1_2">
                    <div className="gallery_in">
                      <div className="item row2">
                        <img src="img/timeline/3/1.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/3/2.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/3/3.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="t_item_info">
                  <p className="fn_date">
                    <span>Staking rewards</span>
                  </p>
                  <h3 className="fn_title">
                    <Link legacyBehavior href="/">
                      NFT Staking
                    </Link>
                  </h3>
                  <p className="fn_desc">
                    The $EPOP token is the main token of the project launched on the Polygon network with an expected supply of 10,000,000,000 tokens. This token serves as the main reward for staking activities within the NFT collection among other activities such as giveaways and promotional campaigns.
                  </p>
                  <p className="fn_desc">
                    Essentially, the token is designed to incentivize holder participation in the ecosystem, gaining benefits and rewards within the ecosystem.
                  </p>
                </div>
              </div>
            </li>
            <li className={`timeline_item ${activeClass(4)}`} data-index={4}>
              <div className="t_item">
                <div className="t_item_img">
                  <div className="neoh_fn_gallery_1_2">
                    <div className="gallery_in">
                      <div className="item row2">
                        <img src="img/timeline/4/1.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/4/2.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/4/3.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="t_item_info">
                  <p className="fn_date">
                    <span>Specs and Provenance</span>
                  </p>
                  <h3 className="fn_title">
                    <Link legacyBehavior href="/">
                    Specs and Provenance
                    </Link>
                  </h3>
                  <p className="fn_desc">
                    Each Epop Girl is unique and is programmatically generated from over 310 possible traits. Epop Girls are stored as ERC-721 tokens on the Polygon blockchain and their metadata is hosted on IPFS.
                  </p>
                  <p className="fn_desc">
                    Each member has the opportunity to access unique features, such as NFT staking, P2P token sales, unique items and enjoy 0 fees on the NFT market (Transactions and sales), as well as exclusive events for holders.
                  </p>
                </div>
              </div>
            </li>
            <li className={`timeline_item ${activeClass(5)}`} data-index={5}>
              <div className="t_item">
                <div className="t_item_img">
                  <div className="neoh_fn_gallery_1_2">
                    <div className="gallery_in">
                      <div className="item row2">
                        <img src="img/timeline/5/1.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/5/2.png" alt="" />
                      </div>
                      <div className="item">
                        <img src="img/timeline/5/3.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="t_item_info">
                  <p className="fn_date">
                    <span>Token Launch</span>
                  </p>
                  <h3 className="fn_title">
                    <Link legacyBehavior href="/roadmap-single">
                      Token Launch
                    </Link>
                  </h3>
                  <p className="fn_desc">
                    The launch of the token is linked in its entirety to the mining phases of the NFTs, i.e. once the mining phases of the epop girls have finished, the token will be officially launched in Uniswap and Dex223.
                  </p>
                  <p className="fn_read">
                    <Link legacyBehavior href="https://info.epopgirls.xyz">
                      <a className="neoh_fn_button only_text">
                        <span className="text">White Paper</span>
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        {/* !Timeline Content */}
        {/* Timeline Progress */}
        <div className="timeline_progress">
          {/* Nav */}
          <a
            className="nav_prev c-pointer"
            onClick={() =>
              setActiveTimeline(
                activeTimeline == 1 ? activeTimeline : activeTimeline - 1
              )
            }
          >
            <img src="svg/right-arr.svg" alt="" className="fn__svg" />
          </a>
          <a
            onClick={() =>
              setActiveTimeline(
                activeTimeline == 5 ? activeTimeline : activeTimeline + 1
              )
            }
            className="nav_next c-pointer"
          >
            <img src="svg/right-arr.svg" alt="" className="fn__svg" />
          </a>
          {/* !Nav */}
          <div className="progress_line_wrapper">
            <div
              className="progress_line"
              style={{
                width: "1645.66px",
                transform: `translateX(-${
                  (100 / activeTimeline) * (activeTimeline - 2)
                }%)`,
              }}
            >
              <ul>
                <li className={activeClass(1)}>
                  <a onClick={() => onClick(1)}>
                    <span className="text">About Epop Girls</span>
                    <span
                      className="circle"
                      style={{ filter: `brightness(${filter(1)}%)` }}
                    />
                  </a>
                </li>
                <li className={activeClass(2)}>
                  <a onClick={() => onClick(2)}>
                    <span className="text">Token Burn System</span>
                    <span
                      className="circle"
                      style={{ filter: `brightness(${filter(2)}%)` }}
                    />
                  </a>
                </li>
                <li className={activeClass(3)}>
                  <a onClick={() => onClick(3)}>
                    <span className="text">Staking Rewards</span>
                    <span
                      className="circle"
                      style={{ filter: `brightness(${filter(3)}%)` }}
                    />
                  </a>
                </li>
                <li className={activeClass(4)}>
                  <a onClick={() => onClick(4)}>
                    <span className="text">Specs and Provenance</span>
                    <span
                      className="circle"
                      style={{ filter: `brightness(${filter(4)}%)` }}
                    />
                  </a>
                </li>
                <li className={activeClass(5)}>
                  <a onClick={() => onClick(5)}>
                    <span className="text">Token Launch</span>
                    <span
                      className="circle"
                      style={{ filter: `brightness(${filter(5)}%)` }}
                    />
                  </a>
                </li>
              </ul>
              <span className="active_line" />
            </div>
          </div>
        </div>
        {/* !Timeline Progress */}
      </div>
      {/* !Timeline */}
    </Fragment>
  );
};
export default Timeline;
