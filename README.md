# Angular Certificate App

This project is an Angular application designed to manage and generate health certificates. It provides a user-friendly interface for inputting certificate data and downloading the certificate as a PDF.

## Project Structure

The project is organized as follows:

```
angular-certificate-app
├── src
│   ├── app
│   │   ├── components
│   │   │   └── certificado
│   │   │       ├── certificado.component.ts  # Logic for the health certificate modal
│   │   │       ├── certificado.component.html # HTML template for the modal
│   │   │       └── certificado.component.css  # Styles for the modal
│   │   ├── services
│   │   │   ├── solicitud.service.ts           # Service for handling certificate data
│   │   │   └── translator.service.ts          # Service for handling translations
│   │   ├── app.module.ts                       # Main application module
│   │   ├── app.component.ts                    # Root component logic
│   │   ├── app.component.html                  # Root component template
│   │   └── app.component.css                   # Styles for the root component
│   ├── assets                                   # Directory for static assets
│   ├── environments                             # Environment configuration files
│   │   ├── environment.ts                      # Development environment settings
│   │   └── environment.prod.ts                 # Production environment settings
│   ├── index.html                              # Main HTML file
│   ├── main.ts                                 # Entry point for the application
│   └── styles.css                              # Global styles
├── angular.json                                # Angular CLI configuration
├── package.json                                # Project metadata and dependencies
├── tsconfig.json                               # TypeScript configuration
└── README.md                                   # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd angular-certificate-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   ng serve
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:4200
   ```

## Features

- Modal for entering health certificate data.
- Translation support for certificate fields.
- PDF generation for downloaded certificates.
- Responsive design for better user experience.

## Usage

To use the application, fill in the required fields in the modal and click the download button to generate the PDF certificate. The application supports both English and Spanish languages for the certificate content.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.