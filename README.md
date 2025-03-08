# Software Engineer Portfolio Website

A modern, responsive single-page portfolio website built with HTML, Tailwind CSS, and Node.js.

## Features

- Responsive design that works on all devices
- Smooth scrolling navigation
- Contact form with validation
- Modern UI with Tailwind CSS
- Node.js backend for form handling

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (optional):
```
PORT=3000
```

## Development

1. Start the Tailwind CSS build process:
```bash
npm run build:css
```

2. In a new terminal, start the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## Production

1. Build the CSS for production:
```bash
npm run build:css
```

2. Start the server:
```bash
npm start
```

## Customization

- Update the content in `public/index.html` with your information
- Modify the styling in `tailwind.config.js`
- Add custom CSS in `public/css/input.css`
- Configure email settings in `server.js`

## License

MIT 