import React from "react";
import "./footer.css";

function Footer() {
  return (
    <div className="footer-container">
      <footer>
        <div class="container">
          <p class="m-0 text-center text-white">
            <div class="footer-categories">
              <div class="footer-category">
                <h3>For Dev</h3>
                <ul>
                  <li>
                    <a href="#">How it works</a>
                  </li>
                  <li>
                    <a href="#">How to create a profile</a>
                  </li>
                  <li>
                    <a href="#">Find jobs</a>
                  </li>
                </ul>
              </div>
              <div class="footer-category">
                <h3>For Clients</h3>
                <ul>
                  <li>
                    <a href="#">How it works</a>
                  </li>
                  <li>
                    <a href="#">How to post a job</a>
                  </li>
                  <li>
                    <a href="#">Find Dev</a>
                  </li>
                </ul>
              </div>
              <div class="footer-category">
                <h3>Devlink</h3>
                <ul>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Terms</a>
                  </li>
                  <li>
                    <a href="#">Code of Conduct</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="footer-category2">
              <h3>Stay Connected</h3>
              <ul class="social-icons">
                <li>
                  <a href="#">
                    <i class="fab fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="fab fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="fab fa-twitter"></i>
                  </a>
                </li>
              </ul>
            </div>
            Copyright &copy; Devlink 2023
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
