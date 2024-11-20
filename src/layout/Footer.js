import Link from "next/link";
const Footer = () => {
  return (
    <footer id="footer">
      <div className="neoh_fn_footer">
        {/* Footer Bottom */}
        <div className="footer_bottom">
          <div className="container">
            <div className="fb_in">
              <div className="fb_left">
                <p>
                  Copyright {new Date().getFullYear()} - Designed &amp;
                  Developed by Epop Girls
                </p>
              </div>
              <div className="fb_right">
                <ul>
                  <li>
                    <a href="https://x.com/EPopGirlsNFT">Twitter</a>
                  </li>
                  <li>
                    <a href="https://discord.gg/jsfkEbDABP">Discord</a>
                  </li>
                  <li>
                    <a href="https://t.me/epopgirlsNFT">Telegram</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* !Footer Bottom */}
      </div>
    </footer>
  );
};
export default Footer;
