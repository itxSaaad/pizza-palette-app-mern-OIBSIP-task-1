# Pizza Delivery System App - MERN

> Pizza Delivery System App (MERN - MongoDB, Express, React, Node.js) is a comprehensive web application that enables users to customize and order pizzas online. This project showcases end-to-end development, including user authentication, custom pizza creation, payment integration, real-time order processing, admin control, and email notifications.

<br />
<div align="center">
  <p align="center">
    <br />
    <a href="https://github.com/itxSaaad/pizza-delivery-system-app-mern-OIBSIP">
    <strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://pizza-delivery-system-app-mern-oibsip.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/itxSaaad/pizza-delivery-system-app-mern-OIBSIP/issues">Report Bug</a>
    ·
    <a href="https://github.com/itxSaaad/pizza-delivery-system-app-mern-OIBSIP/issues">Request Feature</a>
  </p>
</div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

## Live Preview Project

[Live Preview](https://pizza-delivery-system-app-mern-oibsip.vercel.app/)

## Features

- **User Authentication:** Secure registration and login system with JWT tokens for enhanced authorization.
- **Custom Pizza Creation:** Intuitive UI for customizing pizza base, sauce, cheese, and toppings.
- **Payment Integration:** Seamless payment processing using the Razorpay API in test mode.
- **Real-time Order Processing:** Live inventory updates upon order placement for accurate stock management.
- **Admin Control:** Dedicated admin panel for inventory management, order status updates, and notifications.
- **Notifications:** Automated admin email alerts for low inventory levels, ensuring timely restocking.
- **Responsive Design:** User-friendly interfaces designed for various screen sizes.

## Built With

- **Frontend:** React.js (Vite.js) (Tailwind CSS) (React Router) (@reduxjs/toolkit) (React Redux) ()
- **Backend:** Node.js (Express) (bcryptjs) (cors) (dotenv) (express-async-handler) (jsonwebtoken)
- **Database:** MongoDB (Atlas) (Mongoose) (MongoDB Compass)
- **Payment:** Razorpay API (Test Mode)
- **Authentication:** JSON Web Tokens (JWT)
- **Email Notifications:** Nodemailer, SendGrid API
- **Version Control:** Git and GitHub

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [NPM](https://www.npmjs.com/) - Node Package Manager

### Installation

1.Clone the repo

```sh
git clone https://github.com/itxSaaad/pizza-delivery-system-app-mern-OIBSIP.git
```

2.Install NPM packages

```sh
npm install
```

3.Create a `.env` file in the root directory and add the following

```sh
NODE_ENV = development
PORT = 5000
MONGO_URI = <your_mongodb_uri>
JWT_SECRET = <your_jwt_secret>
SALT = <your_salt>
NODEMAILER_EMAIL = <your_nodemailer_email>
NODEMAILER_PASSWORD = <your_nodemailer_password>
NODEMAILER_SUPERADMIN_EMAIL = <your_nodemailer_superadmin_email>
```

4.Create a `.env` file in the client directory and add the following

```sh
VITE_SERVER_URL = <your_server_url>
VITE_CLIENT_URL = <your_client_url>
```

5.Run the app

```sh
npm run dev
```

## Contributing

Contributions are what make the open-source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the repo
2. Clone the project
3. Create your feature branch (`git checkout -b feature/AmazingFeature`)
4. Commit your changes (`git commit -m "Add some AmazingFeature"`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a pull request

## Contact

- Twitter: [@itxSaaad](https://twitter.com/itxSaaad)
- LinkedIn: [@itxSaaad](https://www.linkedin.com/in/itxsaaad/)
- Bento: [@itxSaaad](https://bento.me/itxsaaad)
- Email: [saadstudent.cs@gmail.com](mailto:saadstudent.cs@gmail.com)

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Support

Give ⭐️ if you like this project!

<a href="https://www.buymeacoffee.com/itxSaaad"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="200" /></a>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/itxSaaad/pizza-delivery-system-app-mern-OIBSIP.svg?style=for-the-badge
[contributors-url]: https://github.com/itxSaaad/pizza-delivery-system-app-mern-OIBSIP/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/itxSaaad/pizza-delivery-system-app-mern-OIBSIP.svg?style=for-the-badge
[forks-url]: https://github.com/itxSaaad/pizza-delivery-system-app-mern-OIBSIP/network/members
[stars-shield]: https://img.shields.io/github/stars/itxSaaad/pizza-delivery-system-app-mern-OIBSIP.svg?style=for-the-badge
[stars-url]: https://github.com/itxSaaad/pizza-delivery-system-app-mern-OIBSIP/stargazers
[issues-shield]: https://img.shields.io/github/issues/itxSaaad/pizza-delivery-system-app-mern-OIBSIP.svg?style=for-the-badge
[issues-url]: https://github.com/itxSaaad/pizza-delivery-system-app-mern-OIBSIP/issues
[license-shield]: https://img.shields.io/github/license/itxSaaad/pizza-delivery-system-app-mern-OIBSIP.svg?style=for-the-badge
[license-url]: https://github.com/itxSaaad/pizza-delivery-system-app-mern-OIBSIP/blob/main/LICENSE.md
