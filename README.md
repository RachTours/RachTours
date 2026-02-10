# Rach Tours Website

This is the source code for the Rach Tours website, a travel agency platform for booking local tours, day trips, and unique attractions in Agadir and Taghazout.

## Features

- **Interactive Tour Selection**: Users can select multiple tours, filter by category, and see a running total of the price.
- **WhatsApp Integration**: Bookings are sent directly to a WhatsApp business number using the Meta WhatsApp Cloud API.
- **Responsive Design**: Fully responsive UI for mobile and desktop.
- **Dynamic Content**: Tour details are populated dynamically via JavaScript.

## Setup & Installation

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory with the following keys:

    ```env
    PORT=3000
    ACCESS_TOKEN=your_meta_access_token
    PHONE_NUMBER_ID=your_phone_number_id
    RECIPIENT_PHONE=destination_phone_number
    ```

3.  **Run the Server**:

    ```bash
    npm start
    ```

    or for development:

    ```bash
    npm run dev
    ```

4.  **Visit**:
    Open `http://localhost:3000` in your browser.

## Technologies

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Security**: Helmet, XSS-Clean, HPP, Rate Limiting
- **API**: Meta WhatsApp Cloud API

## License

ISC
